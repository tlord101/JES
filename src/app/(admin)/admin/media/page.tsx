'use client';

import { useState } from 'react';
import { mediaCMSStore, MediaFile } from '@/lib/cmsStore';
import { logAuditEvent } from '@/lib/auditStore';

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaFile[]>([...mediaCMSStore]);
  const [search, setSearch] = useState('');
  const [showUploadModal, setShowModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);

  // New file form
  const [fileName, setFileName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileSize, setFileSize] = useState('1.5 MB');
  const [fileType, setFileType] = useState<'image' | 'document' | 'video'>('image');
  const [category, setCategory] = useState('Campus');
  const [error, setError] = useState('');

  const filtered = mediaList.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fileName || !fileUrl) {
      setError('File name and URL are required.');
      return;
    }

    // Validate extension
    const validImageExts = ['.jpg', '.jpeg', '.png', '.webp'];
    const validDocExts = ['.pdf', '.doc', '.docx'];

    if (fileType === 'image' && !validImageExts.some((ext) => fileUrl.toLowerCase().includes(ext) || fileName.toLowerCase().endsWith(ext))) {
      // allow fallback unsplash images
      if (!fileUrl.includes('unsplash.com')) {
        setError('Invalid image format. Expected JPG, PNG, or WEBP.');
        return;
      }
    }

    const newMedia: MediaFile = {
      id: `med_${Date.now()}`,
      name: fileName,
      url: fileUrl,
      size: fileSize,
      type: fileType,
      category,
      uploadedAt: new Date().toISOString().substring(0, 10),
    };

    mediaCMSStore.push(newMedia);
    setMediaList([...mediaCMSStore]);
    logAuditEvent('Media File Uploaded', 'CMS', `Uploaded ${fileType} file "${fileName}" (${fileSize})`);

    setFileName('');
    setFileUrl('');
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    const idx = mediaCMSStore.findIndex((m) => m.id === id);
    if (idx !== -1) {
      const removed = mediaCMSStore.splice(idx, 1)[0];
      setMediaList([...mediaCMSStore]);
      logAuditEvent('Media File Deleted', 'CMS', `Deleted media file "${removed.name}"`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Media Library & Document Vault</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Upload, categorize, preview, and manage school prospectus documents, campus photos, and video resources.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
        >
          <i className="bi bi-cloud-upload-fill"></i>
          <span>Upload File</span>
        </button>
      </div>

      <div className="bg-white p-4 border border-[var(--border)] rounded flex items-center text-xs">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search media files by name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 border border-[var(--border)] rounded bg-white focus:outline-none focus:border-[var(--primary)]"
          />
          <i className="bi bi-search absolute left-2.5 top-2.5 text-[var(--muted-text)]"></i>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((m) => (
          <div key={m.id} className="bg-white border border-[var(--border)] rounded overflow-hidden flex flex-col justify-between text-xs">
            <div className="p-3 space-y-2">
              <div className="flex justify-between items-center text-[10px]">
                <span className="px-2 py-0.5 bg-[var(--primary-light)] text-[var(--primary-dark)] font-bold rounded">
                  {m.category}
                </span>
                <span className="font-mono text-[var(--muted-text)]">{m.size}</span>
              </div>

              {m.type === 'image' ? (
                <img
                  src={m.url}
                  alt={m.name}
                  onClick={() => setPreviewFile(m)}
                  className="w-full h-32 object-cover rounded border border-[var(--border)] cursor-pointer hover:opacity-90"
                />
              ) : (
                <div
                  onClick={() => setPreviewFile(m)}
                  className="w-full h-32 bg-[var(--soft-bg)] border border-[var(--border)] rounded flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100"
                >
                  <i className="bi bi-file-earmark-pdf-fill text-4xl text-red-600"></i>
                  <span className="text-[10px] font-bold text-[var(--primary-dark)] mt-2">Document Preview</span>
                </div>
              )}

              <div className="font-bold text-[var(--primary-dark)] truncate pt-1">{m.name}</div>
              <div className="text-[10px] text-[var(--muted-text)]">Uploaded: {m.uploadedAt}</div>
            </div>

            <div className="p-3 border-t border-[var(--border)] bg-[var(--soft-bg)] flex justify-between items-center text-[11px]">
              <button
                onClick={() => setPreviewFile(m)}
                className="font-bold text-[var(--primary)] hover:underline"
              >
                Preview
              </button>
              <button
                onClick={() => handleDelete(m.id)}
                className="font-bold text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 border border-[var(--border)] rounded max-w-md w-full space-y-4">
            <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
              <h2 className="text-base font-bold text-[var(--primary-dark)]">Upload Media File</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-black">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {error && <div className="p-2 bg-red-50 text-red-700 text-xs rounded">{error}</div>}

            <form onSubmit={handleUpload} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">File Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Admission_Guide_2025.pdf"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">File Target URL / Hosted Path *</label>
                <input
                  type="text"
                  required
                  placeholder="https://..."
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className="w-full p-2 border border-[var(--border)] rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">File Type</label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value as any)}
                    className="w-full p-2 border border-[var(--border)] rounded font-bold"
                  >
                    <option value="image">Image (JPG/PNG)</option>
                    <option value="document">Document (PDF/DOC)</option>
                    <option value="video">Video (MP4/WebM)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border border-[var(--border)] rounded"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-[var(--border)] font-bold rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[var(--primary)] text-white font-bold rounded">
                  Upload & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 border border-[var(--border)] rounded max-w-lg w-full space-y-4">
            <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
              <h2 className="text-base font-bold text-[var(--primary-dark)]">{previewFile.name}</h2>
              <button onClick={() => setPreviewFile(null)} className="text-gray-500 hover:text-black">
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {previewFile.type === 'image' ? (
              <img src={previewFile.url} alt={previewFile.name} className="w-full max-h-80 object-contain rounded" />
            ) : (
              <div className="p-8 bg-[var(--soft-bg)] border border-[var(--border)] rounded text-center space-y-2">
                <i className="bi bi-file-earmark-pdf-fill text-5xl text-red-600"></i>
                <div className="font-bold text-sm text-[var(--primary-dark)]">{previewFile.name}</div>
                <div className="text-xs text-[var(--muted-text)] font-mono">File Size: {previewFile.size}</div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewFile(null)}
                className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
