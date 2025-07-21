
import { getConversationById, getCurrentUser } from '@/lib/mock-data';
import { MessageView } from '@/components/message-view';
import { notFound } from 'next/navigation';
import type { User } from '@/lib/types';

export default async function ConversationPage({ params }: { params: { id: string } }) {
  const conversation = await getConversationById(params.id);
  const currentUser = await getCurrentUser();

  if (!conversation || !currentUser) {
    notFound();
  }

  return (
    <div className="flex-1 flex flex-col pb-20">
        <MessageView initialConversation={conversation} currentUser={currentUser as User} className="flex-1" />
    </div>
  );
}
