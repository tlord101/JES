import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { assignmentId, studentId, grade, feedback } = body;

    if (!assignmentId || !studentId || grade === undefined) {
      return NextResponse.json({ error: 'Assignment ID, Student ID, and Grade are required' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Graded assignment ${assignmentId} for student ${studentId}`,
      grade: Number(grade),
      feedback: feedback || '',
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Invalid grading payload format' }, { status: 400 });
  }
}
