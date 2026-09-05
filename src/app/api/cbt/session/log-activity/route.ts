import { NextResponse } from 'next/server';
import { cbtAttemptsStore } from '@/lib/cbtStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { attemptId, eventType } = body;

    const attempt = cbtAttemptsStore.find((a) => a.id === attemptId);
    if (!attempt) {
      return NextResponse.json({ error: 'Attempt session not found' }, { status: 404 });
    }

    if (eventType === 'tab_switch' || eventType === 'blur') {
      attempt.tabSwitchCount = (attempt.tabSwitchCount || 0) + 1;
    }

    return NextResponse.json({
      success: true,
      tabSwitchCount: attempt.tabSwitchCount,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid activity payload' }, { status: 400 });
  }
}
