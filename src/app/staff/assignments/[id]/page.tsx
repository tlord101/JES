import React from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { mockStaffAssignments } from '@/lib/staffData';

export default function StaffAssignmentDetailPage({ params }: { params: { id: string } }) {
  const assignment = mockStaffAssignments.find((a) => a.id === params.id);
  if (!assignment) {
    notFound();
  }

  redirect(`/staff/assignments/${assignment.id}/grade`);
}
