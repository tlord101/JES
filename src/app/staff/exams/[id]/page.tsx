import React from 'react';
import { redirect } from 'next/navigation';

export default function StaffExamDetailRedirect({ params }: { params: { id: string } }) {
  redirect(`/staff/exams/${params.id}/questions`);
}
