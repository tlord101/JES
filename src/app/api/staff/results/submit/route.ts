import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { results } = body;

    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json({ error: 'Results list is required' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `${results.length} draft result(s) submitted for Admin & Principal approval. Results remain unassigned until reviewed.`,
      status: 'submitted_for_review',
      submittedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Invalid result submission payload' }, { status: 400 });
  }
}
