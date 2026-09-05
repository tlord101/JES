import { NextResponse } from 'next/server';
import { cbtAttemptsStore, cbtExamsStore, cbtQuestionsPool } from '@/lib/cbtStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { attemptId } = body;

    const attempt = cbtAttemptsStore.find((a) => a.id === attemptId);
    if (!attempt) {
      return NextResponse.json({ error: 'Attempt session not found' }, { status: 404 });
    }

    const exam = cbtExamsStore.find((e) => e.id === attempt.examId);
    if (!exam) {
      return NextResponse.json({ error: 'Exam reference not found' }, { status: 404 });
    }

    const examQuestions = cbtQuestionsPool.filter((q) => exam.questionIds.includes(q.id));

    let totalEarned = 0;
    let maxPossibleMarks = 0;

    examQuestions.forEach((q) => {
      maxPossibleMarks += q.marks;
      const studentAns = attempt.answers[q.id];

      if (studentAns !== undefined && studentAns !== null) {
        if (Array.isArray(q.correctAnswer)) {
          if (
            Array.isArray(studentAns) &&
            studentAns.length === q.correctAnswer.length &&
            studentAns.every((val) => (q.correctAnswer as string[]).includes(val))
          ) {
            totalEarned += q.marks;
          }
        } else {
          if (
            typeof studentAns === 'string' &&
            studentAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
          ) {
            totalEarned += q.marks;
          }
        }
      }
    });

    const percentage = maxPossibleMarks > 0 ? (totalEarned / maxPossibleMarks) * 100 : 0;
    const passed = percentage >= exam.passMark;

    attempt.status = 'submitted';
    attempt.submittedAt = new Date().toISOString();
    attempt.score = totalEarned;
    attempt.percentage = Math.round(percentage * 10) / 10;
    attempt.passed = passed;

    return NextResponse.json({
      success: true,
      message: 'Exam submitted and graded server-side',
      score: totalEarned,
      maxPossibleMarks,
      percentage: attempt.percentage,
      passed,
      submittedAt: attempt.submittedAt,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to finalize submission' }, { status: 400 });
  }
}
