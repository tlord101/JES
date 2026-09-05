'use client';

import React, { useState } from 'react';
import { studentInvoicesStore, paymentReceiptsStore, PaymentReceipt } from '@/lib/financeStore';

export default function ParentFeesPage() {
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | null>(null);
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<any | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [provider, setProvider] = useState<'Paystack' | 'Flutterwave'>('Paystack');
  const [isProcessing, setIsProcessing] = useState(false);

  // Invoices associated with Chief Emeka Okafor's children
  const familyInvoices = studentInvoicesStore.filter((inv) => inv.parentId === 'par-201');

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
          description: `Parent Online payment via ${provider} for ${paymentModalInvoice.studentName} (${paymentModalInvoice.title})`,
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
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Family School Fee Portal</h1>
        <p className="text-sm text-slate-500">Manage termly fees, make secure Paystack / Flutterwave payments, and print official receipts for your wards.</p>
      </div>

      <div className="space-y-6">
        {familyInvoices.map((inv) => {
          const receipts = paymentReceiptsStore.filter((r) => r.invoiceId === inv.id);

          return (
            <div key={inv.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                <div>
                  <span className="text-xs font-bold text-blue-600 block">{inv.studentName} ({inv.className})</span>
                  <h2 className="text-base font-bold text-slate-900">{inv.title}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full ${
                      inv.status === 'Paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {inv.status}
                  </span>
                  {inv.balanceDue > 0 && (
                    <button
                      onClick={() => {
                        setPaymentModalInvoice(inv);
                        setPaymentAmount(inv.balanceDue);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                    >
                      Pay ₦{inv.balanceDue.toLocaleString()}
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Fee Package</span>
                  <span className="text-sm font-bold text-slate-900">₦{inv.totalAmount.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 block">Amount Verified Paid</span>
                  <span className="text-sm font-bold text-emerald-800">₦{inv.amountPaid.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <span className="text-[10px] uppercase font-bold text-amber-600 block">Balance Outstanding</span>
                  <span className="text-sm font-bold text-amber-800">₦{inv.balanceDue.toLocaleString()}</span>
                </div>
              </div>

              {receipts.length > 0 && (
                <div className="pt-2 space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">Verified Digital Receipts</span>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {receipts.map((rec) => (
                      <button
                        key={rec.id}
                        onClick={() => setSelectedReceipt(rec)}
                        className="px-3 py-1.5 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-800 font-bold rounded-xl flex items-center gap-1.5"
                      >
                        <i className="bi bi-receipt"></i> Receipt #{rec.receiptNumber} (₦{rec.amountPaid.toLocaleString()})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ONLINE PAYMENT GATEWAY CHECKOUT MODAL */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-5 shadow-xl text-xs">
            <div className="text-center space-y-1">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 font-bold rounded-xl flex items-center justify-center text-lg mx-auto">
                <i className="bi bi-shield-lock-fill"></i>
              </div>
              <h2 className="text-base font-bold text-slate-900">Parent Secure Online Fee Checkout</h2>
              <p className="text-slate-500">Paying for candidate: <strong>{paymentModalInvoice.studentName}</strong></p>
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
