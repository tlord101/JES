'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  defaultWards,
  defaultParentFeeItems,
  defaultParentPaymentTxs,
  ParentPaymentTx,
} from '@/lib/parentData';

export default function WardFeePage({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.studentId;

  const ward = defaultWards.find((w) => w.id === studentId);

  if (!ward) {
    notFound();
  }

  const wardFeeItems = defaultParentFeeItems.filter((f) => f.wardId === ward.id);
  const [transactions, setTransactions] = useState<ParentPaymentTx[]>(
    defaultParentPaymentTxs.filter((t) => t.wardId === ward.id)
  );

  const [selectedReceipt, setSelectedReceipt] = useState<ParentPaymentTx | null>(null);

  // Payment Form State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number>(ward.outstandingBalance || 100000);
  const [paymentMethod, setPaymentMethod] = useState('Online Card / WebPAY');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState('');

  const handleMakePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentSuccessMsg('');

    try {
      const res = await fetch('/api/parent/fees/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wardId: ward.id,
          amount: paymentAmount,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Payment server verification failed.');
        setIsProcessing(false);
        return;
      }

      setIsProcessing(false);
      setPaymentSuccessMsg('Payment successfully verified by server and posted to central ledger!');
      setTransactions([data.transaction, ...transactions]);

      setTimeout(() => {
        setShowPaymentModal(false);
        setPaymentSuccessMsg('');
      }, 1500);
    } catch (err) {
      alert('Network error during payment verification.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link href="/parent/fees" className="text-xs font-bold text-[var(--primary)] hover:underline flex items-center gap-1 mb-2">
            <i className="bi bi-arrow-left"></i>
            <span>Back to Fees List</span>
          </Link>
          <span className="px-2.5 py-0.5 bg-[var(--primary-light)] text-[var(--primary-dark)] text-[10px] font-bold rounded">
            {ward.class}
          </span>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">
            Fee Statement — {ward.name}
          </h1>
          <p className="text-xs text-[var(--muted-text)]">
            Admission No: {ward.admissionNo}
          </p>
        </div>

        <button
          onClick={() => setShowPaymentModal(true)}
          className="px-5 py-2.5 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2"
        >
          <i className="bi bi-credit-card"></i>
          <span>Make Online Payment</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-5 border border-[var(--border)] rounded space-y-1">
          <span className="text-[var(--muted-text)] block text-[10px] uppercase font-bold">Total Term Fees</span>
          <span className="text-xl font-black text-[var(--primary-dark)] font-mono">₦{ward.totalFees.toLocaleString()}</span>
        </div>

        <div className="bg-white p-5 border border-[var(--border)] rounded space-y-1">
          <span className="text-[var(--muted-text)] block text-[10px] uppercase font-bold">Total Settled</span>
          <span className="text-xl font-black text-green-700 font-mono">₦{ward.amountPaid.toLocaleString()}</span>
        </div>

        <div className="bg-white p-5 border border-[var(--border)] rounded space-y-1">
          <span className="text-[var(--muted-text)] block text-[10px] uppercase font-bold">Outstanding Balance</span>
          <span className="text-xl font-black text-[var(--primary-dark)] font-mono">₦{ward.outstandingBalance.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fee Itemization Table */}
        <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4 text-xs">
          <h2 className="text-sm font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-3 flex items-center gap-2">
            <i className="bi bi-list-stars text-[var(--primary)]"></i>
            <span>Term Fee Schedule Breakdown</span>
          </h2>

          <div className="space-y-2">
            {wardFeeItems.map((item) => (
              <div key={item.id} className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded flex justify-between items-center">
                <div>
                  <div className="font-bold text-[var(--primary-dark)]">{item.title}</div>
                  <div className="text-[10px] text-[var(--muted-text)]">Category: {item.category}</div>
                </div>
                <div className="font-extrabold text-[var(--primary-dark)] font-mono">₦{item.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment History & Receipts */}
        <div className="bg-white p-6 border border-[var(--border)] rounded space-y-4 text-xs">
          <h2 className="text-sm font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-3 flex items-center gap-2">
            <i className="bi bi-receipt text-[var(--primary)]"></i>
            <span>Verified Payment Receipts</span>
          </h2>

          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-4 bg-[var(--soft-bg)] border border-[var(--border)] rounded space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono font-bold text-[var(--primary)] text-xs block">{tx.receiptNo}</span>
                    <div className="font-bold text-[var(--primary-dark)] mt-0.5">{tx.description}</div>
                  </div>
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 font-extrabold text-[10px] rounded">
                    Server Verified
                  </span>
                </div>

                <div className="flex justify-between items-center text-[11px] text-[var(--muted-text)] pt-1">
                  <span>Date: {tx.date} ({tx.paymentMethod})</span>
                  <span className="font-extrabold text-green-700 font-mono">₦{tx.amountPaid.toLocaleString()}</span>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setSelectedReceipt(tx)}
                    className="px-3 py-1 bg-white border border-[var(--border)] font-bold text-xs rounded hover:bg-slate-100 flex items-center gap-1"
                  >
                    <i className="bi bi-download"></i>
                    <span>Download Receipt</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Online Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded border border-[var(--border)] p-6 space-y-4 shadow-xl text-xs">
            <div className="flex justify-between items-start border-b border-[var(--border)] pb-3">
              <h3 className="font-extrabold text-sm text-[var(--primary-dark)]">Server-Verified Fee Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-black">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {paymentSuccessMsg && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded font-bold flex items-center gap-2">
                <i className="bi bi-check-circle-fill text-green-600"></i>
                <span>{paymentSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleMakePayment} className="space-y-4">
              <div>
                <label className="font-bold text-[var(--primary-dark)] block mb-1">Ward Name</label>
                <input
                  type="text"
                  disabled
                  value={`${ward.name} (${ward.class})`}
                  className="w-full p-2.5 border rounded bg-slate-100 font-bold text-[var(--primary-dark)]"
                />
              </div>

              <div>
                <label className="font-bold text-[var(--primary-dark)] block mb-1">Payment Amount (₦)</label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full p-2.5 border rounded bg-[var(--soft-bg)] focus:bg-white font-mono font-bold text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-[var(--primary-dark)] block mb-1">Payment Gateway / Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-2.5 border rounded bg-[var(--soft-bg)] focus:bg-white font-bold"
                >
                  <option>Online Card / WebPAY</option>
                  <option>Direct Bank Transfer Settlement</option>
                  <option>USSD Code Checkout</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 border rounded font-bold hover:bg-[var(--soft-bg)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2 bg-[var(--primary)] text-white font-bold rounded hover:bg-[var(--primary-dark)] flex items-center gap-2"
                >
                  {isProcessing && <i className="bi bi-arrow-repeat animate-spin"></i>}
                  <span>{isProcessing ? 'Verifying...' : 'Authorize Payment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded border border-[var(--border)] p-6 space-y-6 shadow-xl text-xs">
            <div className="flex justify-between items-start border-b border-[var(--border)] pb-3">
              <div>
                <div className="text-lg font-black text-[var(--primary-dark)] uppercase">Jasmine Exclusive School</div>
                <div className="text-[10px] font-bold text-[var(--muted-text)]">Official Verified Payment Receipt</div>
              </div>
              <button onClick={() => setSelectedReceipt(null)} className="text-slate-400 hover:text-black">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="space-y-3 font-mono">
              <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded flex justify-between">
                <span>Receipt Number:</span>
                <span className="font-bold text-[var(--primary-dark)]">{selectedReceipt.receiptNo}</span>
              </div>
              <div className="p-3 bg-[var(--soft-bg)] border border-[var(--border)] rounded flex justify-between">
                <span>Ward Name:</span>
                <span className="font-bold text-[var(--primary-dark)]">{ward.name}</span>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 text-center rounded space-y-1">
                <span className="text-[10px] font-bold text-green-800 uppercase block">Amount Paid</span>
                <div className="text-2xl font-black text-green-900">₦{selectedReceipt.amountPaid.toLocaleString()}</div>
                <span className="text-[10px] font-bold text-green-700 block">Status: SERVER VERIFIED</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[var(--primary)] text-white font-bold rounded hover:bg-[var(--primary-dark)] flex items-center gap-1.5"
              >
                <i className="bi bi-printer"></i>
                <span>Print Receipt</span>
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 border rounded font-bold hover:bg-[var(--soft-bg)]"
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
