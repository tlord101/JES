import { NextResponse } from 'next/server';
import { cbtAttemptsStore } from '@/lib/cbtStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { attemptId, questionId, answer, markedForReview } = body;

    const attempt = cbtAttemptsStore.find((a) => a.id === attemptId);
    if (!attempt) {
      return NextResponse.json({ error: 'Attempt session not found' }, { status: 404 });
    }

    if (attempt.status !== 'in_progress') {
      return NextResponse.json({ error: 'Attempt is no longer active' }, { status: 400 });
    }

    // Check if time expired
    if (new Date() > new Date(attempt.expiresAt)) {
      attempt.status = 'expired';
      return NextResponse.json({ error: 'Exam time expired', expired: true }, { status: 400 });
    }

    if (questionId && answer !== undefined) {
      attempt.answers[questionId] = answer;
    }

    if (Array.isArray(markedForReview)) {
      attempt.markedForReview = markedForReview;
    }

    return NextResponse.json({
      success: true,
      message: 'Answer auto-saved server-side',
      attemptId: attempt.id,
      savedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Failed to process answer payload' }, { status: 400 });
  }
}
