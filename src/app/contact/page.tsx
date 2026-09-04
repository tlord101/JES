'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 space-y-10">

        {/* Header */}
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider">Get in Touch</span>
          <h1 className="text-3xl font-bold text-[var(--primary-dark)] mt-1">Contact Jasmine Exclusive School</h1>
          <p className="text-xs text-[var(--muted-text)] mt-1">
            We are here to answer your questions regarding admissions, academics, campus visits, or general inquiries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 bg-[var(--soft-bg)] p-6 md:p-8 border border-[var(--border)] rounded-md space-y-6">
            <h2 className="text-lg font-bold text-[var(--primary-dark)] border-b border-slate-300 pb-2">
              Send Us a Message
            </h2>

            {submitted ? (
              <div className="p-8 bg-green-50 border border-green-200 rounded text-center space-y-3">
                <i className="bi bi-check-circle-fill text-4xl text-[var(--success)]"></i>
                <h3 className="text-xl font-bold text-slate-800">Message Received!</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Thank you, <strong>{formData.name}</strong>. Your message has been routed to our administrative office. We will respond via <strong>{formData.email}</strong> shortly.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your complete name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text)] mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--text)] mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+234 800 000 0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">Subject *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Admissions & Prospectus">Admissions & Prospectus</option>
                    <option value="Fees & Billing">Fees & Billing</option>
                    <option value="Campus Tour Request">Campus Tour Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text)] mb-1">Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write your query or message here..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors inline-flex items-center gap-2"
                >
                  Send Message <i className="bi bi-send"></i>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Contact Details & Locations */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-[var(--soft-bg)] border border-[var(--border)] rounded-md space-y-4">
              <h2 className="text-lg font-bold text-[var(--primary-dark)] border-b border-slate-300 pb-2">
                School Location & Contacts
              </h2>

              <div className="space-y-4 text-xs text-[var(--text)]">
                <div className="flex items-start gap-3">
                  <i className="bi bi-geo-alt-fill text-xl text-[var(--primary)] mt-0.5"></i>
                  <div>
                    <h3 className="font-bold text-[var(--primary-dark)]">Campus 1 Address</h3>
                    <p className="text-[var(--muted-text)] leading-relaxed">
                      12 Aitamegbe Street, Off Narrow Way Street, Off Reliance, Aduwawa, Benin City, Edo State, Nigeria.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <i className="bi bi-geo-alt-fill text-xl text-[var(--primary)] mt-0.5"></i>
                  <div>
                    <h3 className="font-bold text-[var(--primary-dark)]">Campus 2 Address</h3>
                    <p className="text-[var(--muted-text)] leading-relaxed">
                      7 Asemota Street, Off College Road, Aduwawa, Benin City, Edo State, Nigeria.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <i className="bi bi-telephone-fill text-xl text-[var(--primary)]"></i>
                  <div>
                    <h3 className="font-bold text-[var(--primary-dark)]">Phone Line</h3>
                    <p className="text-[var(--muted-text)]">+234 806 078 2404</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <i className="bi bi-envelope-fill text-xl text-[var(--primary)]"></i>
                  <div>
                    <h3 className="font-bold text-[var(--primary-dark)]">Official Email</h3>
                    <p className="text-[var(--muted-text)]">jasmineexclusiveschool@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Channels */}
            <div className="p-6 bg-white border border-[var(--border)] rounded-md space-y-3">
              <h3 className="font-bold text-sm text-[var(--primary-dark)]">Official Social Media</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2 border border-slate-200 rounded flex items-center gap-2 hover:bg-[var(--soft-bg)]">
                  <i className="bi bi-facebook text-blue-600 text-lg"></i> Facebook
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 border border-slate-200 rounded flex items-center gap-2 hover:bg-[var(--soft-bg)]">
                  <i className="bi bi-instagram text-pink-600 text-lg"></i> Instagram
                </a>
                <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="p-2 border border-slate-200 rounded flex items-center gap-2 hover:bg-[var(--soft-bg)]">
                  <i className="bi bi-whatsapp text-emerald-600 text-lg"></i> WhatsApp
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="p-2 border border-slate-200 rounded flex items-center gap-2 hover:bg-[var(--soft-bg)]">
                  <i className="bi bi-youtube text-red-600 text-lg"></i> YouTube
                </a>
              </div>
            </div>

            {/* Google Maps Embed Container */}
            <div className="bg-slate-100 border border-[var(--border)] rounded-md overflow-hidden p-3 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-[var(--primary-dark)]">
                <span><i className="bi bi-map mr-1"></i> Interactive Map Area (Aduwawa, Benin City)</span>
              </div>
              <div className="w-full h-48 bg-slate-200 border border-slate-300 rounded flex flex-col items-center justify-center text-slate-500 text-xs space-y-2">
                <i className="bi bi-geo text-3xl text-[var(--primary)]"></i>
                <span className="font-medium text-center px-4">
                  Google Maps Location Placeholder: Aduwawa, Benin City, Edo State
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
