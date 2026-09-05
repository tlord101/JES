import { redirect } from 'next/navigation';

export default async function StudentExamDetailRedirect({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params;
  redirect(`/student/exams/${examId}/instructions`);
}
