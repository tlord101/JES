import React from 'react';
import Link from 'next/link';
import { mockStaffMaterials } from '@/lib/staffData';

export default function StaffMaterialsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lesson Materials & E-Learning</h1>
          <p className="text-sm text-slate-500">Upload and organize slide decks, lecture notes, videos, and worksheets.</p>
        </div>
        <button
          type="button"
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-2"
        >
          <i className="bi bi-cloud-arrow-up"></i> Upload Material
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockStaffMaterials.map((mat) => (
          <div key={mat.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
                {mat.className} • {mat.subject}
              </span>
              <span className="text-[10px] text-slate-400">Uploaded {mat.uploadedAt}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900">{mat.title}</h2>
            <div className="text-xs text-slate-500 font-medium">Topic: {mat.topic}</div>
            <div className="pt-2 flex justify-between items-center border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <i className={`bi ${mat.type === 'video' ? 'bi-play-circle-fill text-red-600' : 'bi-file-earmark-pdf-fill text-blue-600'}`}></i>
                {mat.type.toUpperCase()} File
              </span>
              <a
                href={mat.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-lg text-xs font-bold transition-colors"
              >
                Access File
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
