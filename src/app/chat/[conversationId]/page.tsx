import { getConversationById, getCurrentUser } from '@/lib/mock-data';
import { MessageView } from '@/components/message-view';
import { notFound } from 'next/navigation';
import type { User } from '@/lib/types';

export default async function ConversationPage({ params }: { params: { conversationId: string } }) {
  const conversation = await getConversationById(params.conversationId);
  const currentUser = await getCurrentUser() as User;

  if (!conversation) {
    notFound();
  }

  return <MessageView initialConversation={conversation} currentUser={currentUser} />;
}
