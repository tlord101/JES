'use client';

import React, { useState } from 'react';
import { studentInvoicesStore, paymentReceiptsStore, PaymentReceipt } from '@/lib/financeStore';

export default function StudentFeesPage() {
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | null>(null);
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<any | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [provider, setProvider] = useState<'Paystack' | 'Flutterwave'>('Paystack');
  const [isProcessing, setIsProcessing] = useState(false);

  // Student david okafor invoice
  const myInvoice = studentInvoicesStore.find((inv) => inv.studentId === 'std-101') || studentInvoicesStore[0];
  const myReceipts = paymentReceiptsStore.filter((rec) => rec.invoiceId === myInvoice.id);

  const handlePayClick = () => {
    setPaymentModalInvoice(myInvoice);
    setPaymentAmount(myInvoice.balanceDue);
  };

  const executeOnlinePayment = async () => {
    if (!paymentModalInvoice || paymentAmount <= 0) return;
    setIsProcessing(true);

    try {
      const mockRef = `${provider === 'Paystack' ? 'PST' : 'FLW'}_REF_${Date.now()}`;
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: paymentModalInvoice.id,
          amount: paymentAmount,
          paymentMethod: provider,
          transactionReference: mockRef,
          description: `Online payment via ${provider} for ${paymentModalInvoice.title}`,
        }),
      });

      const data = await res.json();
      if (res.ok && data.receipt) {
        setSelectedReceipt(data.receipt);
        setPaymentModalInvoice(null);
      } else {
        alert(data.error || 'Payment verification failed.');
      }
    } catch {
      alert('Network error connecting to payment gateway.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">School Fees & Payment History</h1>
          <p className="text-sm text-slate-500">View termly invoices, fee breakdowns, server-verified receipts, and pay online.</p>
        </div>
        {myInvoice.balanceDue > 0 && (
          <button
            onClick={handlePayClick}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <i className="bi bi-credit-card-fill"></i> Pay Outstanding Fees (₦{myInvoice.balanceDue.toLocaleString()})
          </button>
        )}
      </div>

      {/* SUMMARY BANNER */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Term Fee</span>
          <div className="text-2xl font-extrabold text-slate-900">₦{myInvoice.totalAmount.toLocaleString()}</div>
          <span className="text-[11px] text-slate-400">{myInvoice.title}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-emerald-600 uppercase">Amount Paid</span>
          <div className="text-2xl font-extrabold text-emerald-700">₦{myInvoice.amountPaid.toLocaleString()}</div>
          <span className="text-[11px] text-emerald-600 font-medium">Verified by Bursary</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-amber-600 uppercase">Outstanding Balance</span>
          <div className="text-2xl font-extrabold text-amber-700">₦{myInvoice.balanceDue.toLocaleString()}</div>
          <span className="text-[11px] text-amber-600 font-medium">Due Date: {myInvoice.dueDate}</span>
        </div>
      </div>

      {/* INVOICE BREAKDOWN */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase">{myInvoice.invoiceNumber}</span>
            <h2 className="text-base font-bold text-slate-900">{myInvoice.title}</h2>
          </div>
          <span
            className={`px-3 py-1 text-xs font-bold rounded-full ${
              myInvoice.status === 'Paid'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {myInvoice.status}
          </span>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase">Fee Items Breakdown</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {myInvoice.items.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">{item.category}</span>
                  <span className="font-semibold text-slate-800">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">₦{item.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PAYMENT RECEIPTS LOG */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900">Official Payment Receipts</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase bg-slate-50">
                <th className="py-2.5 px-3">Receipt Ref</th>
                <th className="py-2.5 px-3">Gateway Reference</th>
                <th className="py-2.5 px-3">Amount Paid</th>
                <th className="py-2.5 px-3">Payment Method</th>
                <th className="py-2.5 px-3">Date & Time</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myReceipts.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{rec.receiptNumber}</td>
                  <td className="py-3 px-3 font-mono text-[11px] text-blue-700">{rec.transactionReference}</td>
                  <td className="py-3 px-3 font-extrabold text-emerald-800">₦{rec.amountPaid.toLocaleString()}</td>
                  <td className="py-3 px-3 font-semibold text-slate-700">{rec.paymentMethod}</td>
                  <td className="py-3 px-3 text-slate-500 text-[11px]">{rec.date}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setSelectedReceipt(rec)}
                      className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold rounded-lg transition-colors"
                    >
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ONLINE PAYMENT GATEWAY CHECKOUT MODAL */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-5 shadow-xl text-xs">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 font-bold rounded-xl flex items-center justify-center text-lg mx-auto">
                <i className="bi bi-shield-lock-fill"></i>
              </div>
              <h2 className="text-base font-bold text-slate-900">Secure Online Fee Checkout</h2>
              <p className="text-slate-500">Verified server integration with Paystack and Flutterwave.</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Payment Provider</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setProvider('Paystack')}
                    className={`py-2 px-3 border rounded-xl font-bold transition-all ${
                      provider === 'Paystack' ? 'bg-blue-50 border-blue-600 text-blue-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Paystack
                  </button>
                  <button
                    type="button"
                    onClick={() => setProvider('Flutterwave')}
                    className={`py-2 px-3 border rounded-xl font-bold transition-all ${
                      provider === 'Flutterwave' ? 'bg-amber-50 border-amber-600 text-amber-800' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    Flutterwave
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Amount (₦)</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-slate-900 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                Payment reference will be generated and verified server-side prior to issuing official digital receipt.
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPaymentModalInvoice(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeOnlinePayment}
                disabled={isProcessing}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm disabled:opacity-50"
              >
                {isProcessing ? 'Verifying...' : `Pay ₦${paymentAmount.toLocaleString()}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE RECEIPT MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 lg:p-8 space-y-6 shadow-xl">
            <div className="text-center border-b border-slate-100 pb-4 space-y-1">
              <div className="w-12 h-12 bg-blue-900 text-white font-bold rounded-2xl flex items-center justify-center text-lg mx-auto">
                JES
              </div>
              <h2 className="text-lg font-bold text-slate-900">{selectedReceipt.schoolName}</h2>
              <p className="text-[11px] text-slate-500">Official Payment Verification Receipt</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Receipt Number:</span>
                <span className="font-mono font-bold text-slate-900">{selectedReceipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Transaction Reference:</span>
                <span className="font-mono text-blue-700">{selectedReceipt.transactionReference}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold text-slate-900">{selectedReceipt.studentName} ({selectedReceipt.admissionNo})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Parent / Payer:</span>
                <span className="font-medium text-slate-800">{selectedReceipt.parentName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Payment Gateway Method:</span>
                <span className="font-semibold text-slate-800">{selectedReceipt.paymentMethod}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Date & Time Verified:</span>
                <span className="text-slate-800">{selectedReceipt.date}</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center text-emerald-900">
                <span className="font-bold">Amount Verified Paid:</span>
                <span className="text-lg font-extrabold">₦{selectedReceipt.amountPaid.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors"
              >
                <i className="bi bi-printer mr-1"></i> Print Receipt
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
