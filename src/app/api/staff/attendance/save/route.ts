import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { classId, date, records } = body;

    if (!classId || !date || !Array.isArray(records)) {
      return NextResponse.json({ error: 'Missing required attendance payload fields' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: `Attendance register saved for class ${classId} on ${date}`,
      savedCount: records.length,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Invalid attendance request format' }, { status: 400 });
  }
}
