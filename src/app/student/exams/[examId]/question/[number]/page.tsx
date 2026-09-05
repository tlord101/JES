'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function StudentExamQuestionPage() {
  const router = useRouter();
  const routeParams = useParams();
  const examId = (routeParams?.examId as string) || '';
  const currentNum = parseInt((routeParams?.number as string) || '1', 10) || 1;

  const [attempt, setAttempt] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [examTitle, setExamTitle] = useState('');
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [reviewFlags, setReviewFlags] = useState<string[]>([]);
  const [secondsLeft, setSecondsLeft] = useState<number>(1800);
  const [savingStatus, setSavingStatus] = useState<'saved' | 'saving' | 'offline'>('saved');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize state from sessionStorage
  useEffect(() => {
    const storedAttempt = sessionStorage.getItem('cbt_attempt');
    const storedQuestions = sessionStorage.getItem('cbt_questions');
    const storedTitle = sessionStorage.getItem('cbt_exam_title');

    if (storedAttempt && storedQuestions) {
      const att = JSON.parse(storedAttempt);
      const qList = JSON.parse(storedQuestions);
      setAttempt(att);
      setQuestions(qList);
      setExamTitle(storedTitle || 'CBT Examination');
      setAnswers(att.answers || {});
      setReviewFlags(att.markedForReview || []);

      const expires = new Date(att.expiresAt).getTime();
      const now = new Date().getTime();
      const diffSec = Math.max(0, Math.floor((expires - now) / 1000));
      setSecondsLeft(diffSec);
    } else {
      if (examId) {
        router.replace(`/student/exams/${examId}/instructions`);
      }
    }
  }, [examId, router]);

  // Handle Tab Switch & Visibility Detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && attempt) {
        fetch('/api/cbt/session/log-activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ attemptId: attempt.id, eventType: 'tab_switch' }),
        }).catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [attempt]);

  // Final submission on time expiry
  const handleFinalSubmit = useCallback(async () => {
    if (!attempt) return;
    try {
      const res = await fetch('/api/cbt/session/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId: attempt.id }),
      });
      const data = await res.json();
      if (res.ok) {
        sessionStorage.setItem('cbt_last_result', JSON.stringify(data));
        router.replace(`/student/exams/${examId}/result`);
      }
    } catch {
      router.replace(`/student/exams/${examId}/result`);
    }
  }, [attempt, examId, router]);

  // Countdown timer effect
  useEffect(() => {
    if (secondsLeft <= 0 && attempt) {
      handleFinalSubmit();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, attempt, handleFinalSubmit]);

  const currentQ = questions[currentNum - 1];

  // Auto-save logic
  const saveAnswer = async (qId: string, val: any, updatedReview?: string[]) => {
    const newAns = { ...answers, [qId]: val };
    setAnswers(newAns);
    setSavingStatus('saving');

    if (attempt) {
      attempt.answers = newAns;
      if (updatedReview) attempt.markedForReview = updatedReview;
      sessionStorage.setItem('cbt_attempt', JSON.stringify(attempt));

      try {
        const res = await fetch('/api/cbt/session/save-answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            attemptId: attempt.id,
            questionId: qId,
            answer: val,
            markedForReview: updatedReview || reviewFlags,
          }),
        });
        if (res.ok) {
          setSavingStatus('saved');
        } else {
          setSavingStatus('offline');
        }
      } catch {
        setSavingStatus('offline');
      }
    }
  };

  const toggleReviewFlag = () => {
    if (!currentQ) return;
    const isFlagged = reviewFlags.includes(currentQ.id);
    const updated = isFlagged
      ? reviewFlags.filter((id) => id !== currentQ.id)
      : [...reviewFlags, currentQ.id];
    setReviewFlags(updated);
    saveAnswer(currentQ.id, answers[currentQ.id], updated);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!currentQ) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const timerStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const currentAnswer = answers[currentQ.id];
  const isFlagged = reviewFlags.includes(currentQ.id);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans select-none">
      {/* TOP HEADER */}
      <header className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg text-white font-bold flex items-center justify-center text-xs">
            CBT
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">{examTitle}</h1>
            <span className="text-[10px] text-slate-400">Candidate: David Okafor</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400">Time Remaining:</span>
            <span className={`font-mono text-sm font-bold ${secondsLeft < 300 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`}>
              {timerStr}
            </span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs text-slate-300"
            title="Toggle Fullscreen"
          >
            <i className={`bi ${isFullscreen ? 'bi-fullscreen-exit' : 'bi-arrows-fullscreen'}`}></i>
          </button>
        </div>
      </header>

      {/* AUTO-SAVE STATUS & PROGRESS BAR */}
      <div className="bg-slate-950/60 border-b border-slate-800/80 px-4 py-1.5 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2">
          {savingStatus === 'saved' && (
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <i className="bi bi-cloud-check-fill"></i> Auto-saved
            </span>
          )}
          {savingStatus === 'saving' && (
            <span className="text-amber-400 font-semibold flex items-center gap-1">
              <i className="bi bi-arrow-repeat animate-spin"></i> Saving to server...
            </span>
          )}
          {savingStatus === 'offline' && (
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <i className="bi bi-wifi-off"></i> Saved locally (Offline)
            </span>
          )}
        </div>

        <div className="text-slate-400 font-medium">
          Answered {Object.keys(answers).length} of {questions.length} questions
        </div>
      </div>

      {/* MAIN TEST CONTAINER */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Question Header Row */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-900/60 text-blue-300 rounded-lg text-xs font-bold border border-blue-700/50">
                Question {currentNum} of {questions.length}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                ({currentQ.marks} {currentQ.marks === 1 ? 'Mark' : 'Marks'})
              </span>
            </div>

            <button
              onClick={toggleReviewFlag}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                isFlagged
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
              }`}
            >
              <i className={`bi ${isFlagged ? 'bi-flag-fill text-amber-400' : 'bi-flag'}`}></i>
              {isFlagged ? 'Marked for Review' : 'Mark for Review'}
            </button>
          </div>

          {/* Question Text & Media */}
          <div className="space-y-4">
            <h2 className="text-base md:text-lg font-semibold text-white leading-relaxed">
              {currentQ.question}
            </h2>

            {currentQ.mathFormula && (
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-sm text-blue-300">
                LaTeX Formula: {currentQ.mathFormula}
              </div>
            )}

            {currentQ.imageUrl && (
              <div className="max-w-md rounded-xl overflow-hidden border border-slate-800">
                <img src={currentQ.imageUrl} alt="Question Diagram" className="w-full object-cover" />
              </div>
            )}
          </div>

          {/* Answer Input Controls */}
          <div className="space-y-2.5 pt-2">
            {/* MCQ & True/False */}
            {(currentQ.type === 'mcq' || currentQ.type === 'true_false' || currentQ.type === 'image') &&
              currentQ.options?.map((opt: string, i: number) => {
                const letter = String.fromCharCode(65 + i);
                const isSelected = currentAnswer === opt;
                return (
                  <button
                    key={i}
                    onClick={() => saveAnswer(currentQ.id, opt)}
                    className={`w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-colors flex items-center gap-3 ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-white font-bold'
                        : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 text-slate-200'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {letter}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}

            {/* Multiple Select */}
            {currentQ.type === 'multi_select' &&
              currentQ.options?.map((opt: string, i: number) => {
                const currentArr: string[] = Array.isArray(currentAnswer) ? currentAnswer : [];
                const isChecked = currentArr.includes(opt);

                const handleToggleMulti = () => {
                  const updated = isChecked
                    ? currentArr.filter((item) => item !== opt)
                    : [...currentArr, opt];
                  saveAnswer(currentQ.id, updated);
                };

                return (
                  <button
                    key={i}
                    onClick={handleToggleMulti}
                    className={`w-full text-left p-3.5 rounded-xl border text-sm font-medium transition-colors flex items-center gap-3 ${
                      isChecked
                        ? 'bg-blue-600/20 border-blue-500 text-white font-bold'
                        : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 text-slate-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span>{opt}</span>
                  </button>
                );
              })}

            {/* Short Answer & Fill in the Blank */}
            {(currentQ.type === 'short_answer' || currentQ.type === 'fill_in_blank' || currentQ.type === 'math') && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Type your answer below:</label>
                <input
                  type="text"
                  placeholder="Type answer here..."
                  value={currentAnswer || ''}
                  onChange={(e) => saveAnswer(currentQ.id, e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm font-medium text-white outline-none focus:border-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM NAVIGATION CONTROLS */}
        <div className="pt-8 space-y-6">
          <div className="flex items-center justify-between border-t border-slate-800 pt-4">
            <button
              onClick={() => router.push(`/student/exams/${examId}/question/${currentNum - 1}`)}
              disabled={currentNum <= 1}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-30 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <i className="bi bi-chevron-left"></i> Previous
            </button>

            {currentNum < questions.length ? (
              <button
                onClick={() => router.push(`/student/exams/${examId}/question/${currentNum + 1}`)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                Next <i className="bi bi-chevron-right"></i>
              </button>
            ) : (
              <button
                onClick={() => router.push(`/student/exams/${examId}/submit`)}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                Proceed to Submit
              </button>
            )}
          </div>

          {/* QUESTION GRID NAVIGATOR */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Question Navigator</div>
            <div className="flex flex-wrap gap-2">
              {questions.map((q, idx) => {
                const qNum = idx + 1;
                const isCurrent = qNum === currentNum;
                const isAnswered = answers[q.id] !== undefined && answers[q.id] !== '';
                const isFlagged = reviewFlags.includes(q.id);

                let btnClass = 'bg-slate-800 text-slate-400 border-slate-700';
                if (isCurrent) btnClass = 'bg-blue-600 text-white font-bold ring-2 ring-blue-400';
                else if (isFlagged) btnClass = 'bg-amber-500/30 text-amber-300 border-amber-500/60 font-bold';
                else if (isAnswered) btnClass = 'bg-emerald-900/60 text-emerald-300 border-emerald-700/60 font-semibold';

                return (
                  <button
                    key={q.id}
                    onClick={() => router.push(`/student/exams/${examId}/question/${qNum}`)}
                    className={`w-8 h-8 rounded-lg border text-xs flex items-center justify-center transition-all ${btnClass}`}
                  >
                    {qNum}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
