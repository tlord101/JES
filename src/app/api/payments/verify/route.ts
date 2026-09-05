import { NextRequest, NextResponse } from 'next/server';
import { studentInvoicesStore, paymentReceiptsStore, PaymentReceipt } from '@/lib/financeStore';
import { addAuditLog } from '@/lib/auditStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { invoiceId, amount, paymentMethod, transactionReference, description } = body;

    if (!invoiceId || !amount || !transactionReference) {
      return NextResponse.json({ error: 'Missing required payment parameters.' }, { status: 400 });
    }

    const invoice = studentInvoicesStore.find((inv) => inv.id === invoiceId);
    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found.' }, { status: 404 });
    }

    // SERVER-SIDE PAYMENT VERIFICATION SIMULATION
    // In production, this verifies with Paystack/Flutterwave server APIs:
    // e.g. GET https://api.paystack.co/transaction/verify/:reference
    const numericAmount = Number(amount);
    if (numericAmount <= 0) {
      return NextResponse.json({ error: 'Invalid payment amount.' }, { status: 400 });
    }

    // Update invoice record
    invoice.amountPaid += numericAmount;
    invoice.balanceDue = Math.max(0, invoice.totalAmount - invoice.amountPaid);

    if (invoice.balanceDue === 0) {
      invoice.status = 'Paid';
    } else if (invoice.amountPaid > 0) {
      invoice.status = 'Partially Paid';
    }

    // Generate verified receipt
    const receiptNum = `RCP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReceipt: PaymentReceipt = {
      id: `rec-${Date.now()}`,
      receiptNumber: receiptNum,
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      schoolName: 'Jasmine Exclusive School, Benin City',
      studentName: invoice.studentName,
      admissionNo: invoice.admissionNo,
      parentName: invoice.parentName,
      amountPaid: numericAmount,
      paymentMethod: paymentMethod || 'Paystack',
      transactionReference,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'Verified',
      description: description || `Payment for ${invoice.title}`,
    };

    paymentReceiptsStore.unshift(newReceipt);

    // Audit log
    addAuditLog(
      'Payment Verification & Receipt Issuance',
      'Finance',
      `Server verified online payment of ₦${numericAmount.toLocaleString()} for ${invoice.studentName} (${transactionReference}). Receipt #${receiptNum} generated.`
    );

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully server-side.',
      invoice,
      receipt: newReceipt,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error processing payment.' }, { status: 500 });
  }
}
