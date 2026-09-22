import { requireRole } from '@/lib/auth/session';
import { isUserRole, PARENT_PORTAL_ROLES, roleLabel } from '@/lib/auth/roles';
import { listMyChildren, listMyMessages, listSchoolContacts } from '@/lib/data/portal';
import { formatDateTime } from '@/lib/format';
import { MarkReadButton, MessageComposer } from './MessageForms';

export const metadata = { title: 'Messages | JES Parent Portal' };

export default async function ParentMessagesPage() {
  const user = await requireRole(PARENT_PORTAL_ROLES);

  const [messages, contacts, wards] = await Promise.all([
    listMyMessages({ id: user.id, fullName: user.fullName }),
    listSchoolContacts(),
    listMyChildren(),
  ]);

  const unread = messages.filter((message) => message.direction === 'incoming' && !message.isRead);

  return (
    <div className="space-y-6 text-xs">
      <div className="bg-white p-6 border border-[var(--border)] rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary-dark)]">Messages</h1>
          <p className="text-xs text-[var(--muted-text)]">
            Communicate with the school office about results, attendance, fees or any other concern.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-bold text-[var(--primary)]">{messages.length} messages</div>
          <div className="text-[11px] text-[var(--muted-text)]">{unread.length} unread</div>
        </div>
      </div>

      <MessageComposer
        contacts={contacts.map((contact) => ({
          profileId: contact.profileId,
          fullName: contact.fullName,
          roleLabel: isUserRole(contact.role) ? roleLabel(contact.role) : contact.role,
        }))}
        wards={wards.map((ward) => ({ studentId: ward.studentId, fullName: ward.fullName }))}
      />

      <div className="bg-white border border-[var(--border)] rounded overflow-hidden">
        <div className="p-4 border-b border-[var(--border)] font-bold text-[var(--primary-dark)]">
          Conversation history
        </div>

        {messages.length === 0 ? (
          <p className="p-6 text-[var(--muted-text)]">
            No messages yet. Use the form above to send the first message to the school office.
          </p>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {messages.map((message) => (
              <div key={message.id} className="p-4 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                      message.direction === 'incoming'
                        ? 'bg-[var(--primary-light)] text-[var(--primary)]'
                        : 'bg-[var(--soft-bg)] border border-[var(--border)] text-[var(--muted-text)]'
                    }`}
                  >
                    {message.direction === 'incoming' ? 'Received' : 'Sent'}
                  </span>
                  <span className="font-bold text-[var(--primary-dark)]">{message.subject}</span>
                  {message.direction === 'incoming' && !message.isRead && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-bold rounded uppercase">
                      New
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[var(--muted-text)]">
                  {message.direction === 'incoming' ? 'From' : 'To'} {message.counterpartName} •{' '}
                  {formatDateTime(message.createdAt)}
                </p>
                <p className="text-[var(--text)] whitespace-pre-line">{message.body}</p>
                {message.direction === 'incoming' && !message.isRead && (
                  <MarkReadButton messageId={message.id} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
