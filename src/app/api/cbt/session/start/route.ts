import { NextResponse } from 'next/server';
import { cbtExamsStore, cbtQuestionsPool, cbtAttemptsStore, CBTAttempt } from '@/lib/cbtStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { examId, studentId, studentName } = body;

    const exam = cbtExamsStore.find((e) => e.id === examId);
    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    const now = new Date();
    const start = new Date(exam.startDate);
    const end = new Date(exam.endDate);

    if (now < start) {
      return NextResponse.json({ error: 'Exam has not started yet' }, { status: 400 });
    }
    if (now > end) {
      return NextResponse.json({ error: 'Exam period has expired' }, { status: 400 });
    }

    const existingAttempts = cbtAttemptsStore.filter(
      (a) => a.examId === examId && a.studentId === studentId
    );

    if (existingAttempts.length >= exam.attemptsAllowed) {
      const last = existingAttempts[existingAttempts.length - 1];
      if (last.status === 'submitted' || last.status === 'expired') {
        return NextResponse.json({ error: 'Maximum attempts reached for this exam' }, { status: 400 });
      }
      return NextResponse.json({
        success: true,
        attempt: last,
        questions: getSanitizedQuestions(exam),
      });
    }

    const expiresAt = new Date(now.getTime() + exam.durationMinutes * 60 * 1000).toISOString();

    const newAttempt: CBTAttempt = {
      id: `att-${Date.now()}`,
      examId: exam.id,
      studentId: studentId || 'std-101',
      studentName: studentName || 'David Okafor',
      startedAt: now.toISOString(),
      expiresAt,
      answers: {},
      markedForReview: [],
      status: 'in_progress',
      tabSwitchCount: 0,
    };

    cbtAttemptsStore.push(newAttempt);

    return NextResponse.json({
      success: true,
      attempt: newAttempt,
      examTitle: exam.title,
      durationMinutes: exam.durationMinutes,
      questions: getSanitizedQuestions(exam),
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
  }
}

function getSanitizedQuestions(exam: any) {
  const questions = cbtQuestionsPool
    .filter((q) => exam.questionIds.includes(q.id))
    .map((q) => {
      const { correctAnswer, explanation, ...sanitized } = q;
      return sanitized;
    });

  if (exam.randomizeQuestions) {
    questions.sort(() => Math.random() - 0.5);
  }

  return questions;
}
