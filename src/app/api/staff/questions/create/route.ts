import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, type, options, correctAnswer, explanation, marks, subject, classId, topic, difficulty } = body;

    if (!question || !type || !subject || !classId) {
      return NextResponse.json({ error: 'Question text, type, subject, and class ID are required' }, { status: 400 });
    }

    const newQuestion = {
      id: `q-${Date.now().toString().slice(-4)}`,
      type,
      question,
      options: options || [],
      correctAnswer: correctAnswer || '',
      explanation: explanation || '',
      marks: Number(marks) || 1,
      subject,
      classId,
      topic: topic || 'General',
      difficulty: difficulty || 'Medium',
    };

    return NextResponse.json({
      success: true,
      message: 'Question added to Question Bank successfully',
      question: newQuestion,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid question payload format' }, { status: 400 });
  }
}
