'use client';

import { useState } from 'react';
import { defaultPTATopics, PTAForumTopic } from '@/lib/parentData';

export default function ParentPTAPage() {
  const [topics, setTopics] = useState<PTAForumTopic[]>(defaultPTATopics);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert('Please fill out topic title and description.');
      return;
    }

    const created: PTAForumTopic = {
      id: `pta_${Date.now()}`,
      title: newTitle,
      author: 'Dr. Emmanuel Okafor (Parent)',
      date: new Date().toISOString().split('T')[0],
      repliesCount: 0,
      category: 'Parent Discussion',
      content: newContent,
    };

    setTopics([created, ...topics]);
    setNewTitle('');
    setNewContent('');
    setIsComposing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-2.5 py-0.5 bg-[var(--primary-light)] text-[var(--primary)] text-[11px] font-bold rounded">
            PTA Forum
          </span>
          <h1 className="text-xl font-bold text-[var(--primary-dark)] mt-1">
            Parent-Teacher Association Assembly
          </h1>
          <p className="text-xs text-[var(--muted-text)]">
            Consultative forum, school welfare projects, and parent executive community.
          </p>
        </div>

        <button
          onClick={() => setIsComposing(!isComposing)}
          className="px-4 py-2 bg-[var(--primary)] text-white text-xs font-bold rounded hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-1.5"
        >
          <i className="bi bi-chat-left-text"></i>
          <span>{isComposing ? 'Cancel' : 'Start PTA Topic'}</span>
        </button>
      </div>

      {isComposing && (
        <form onSubmit={handleCreateTopic} className="bg-white p-6 border border-[var(--border)] rounded space-y-4 text-xs">
          <h2 className="text-sm font-bold text-[var(--primary-dark)] border-b border-[var(--border)] pb-2">
            Create New PTA Consultative Discussion
          </h2>

          <div className="space-y-1">
            <label className="font-bold text-[var(--primary-dark)] block">Topic Title</label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Suggestion regarding school bus routes..."
              className="w-full p-2.5 border rounded bg-[var(--soft-bg)] focus:bg-white text-[var(--text)] outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[var(--primary-dark)] block">Discussion Details</label>
            <textarea
              rows={4}
              required
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Type details for parents and executives..."
              className="w-full p-2.5 border rounded bg-[var(--soft-bg)] focus:bg-white text-[var(--text)] outline-none"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsComposing(false)}
              className="px-4 py-2 border rounded font-bold hover:bg-[var(--soft-bg)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[var(--primary)] text-white font-bold rounded hover:bg-[var(--primary-dark)]"
            >
              Post Topic
            </button>
          </div>
        </form>
      )}

      {/* Forum Threads */}
      <div className="space-y-4">
        {topics.map((t) => (
          <div key={t.id} className="bg-white p-6 border border-[var(--border)] rounded space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="px-2.5 py-0.5 bg-[var(--primary-light)] text-[var(--primary-dark)] font-bold text-[10px] rounded">
                {t.category}
              </span>
              <span className="text-[var(--muted-text)]">{t.date} • {t.author}</span>
            </div>

            <h2 className="text-base font-extrabold text-[var(--primary-dark)]">{t.title}</h2>
            <p className="text-xs text-[var(--text)] bg-[var(--soft-bg)] p-3 border border-[var(--border)] rounded leading-relaxed">
              {t.content}
            </p>

            <div className="pt-2 flex justify-between items-center text-xs text-[var(--muted-text)]">
              <span>{t.repliesCount} Community Replies</span>
              <button
                onClick={() => alert(`Opening replies for: ${t.title}`)}
                className="font-bold text-[var(--primary)] hover:underline"
              >
                Join Discussion →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
