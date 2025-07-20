import { getConversations, getCurrentUser } from '@/lib/mock-data';
import { ConversationList } from '@/components/conversation-list';
import type { User } from '@/lib/types';

export default async function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const conversations = await getConversations();
  const currentUser = await getCurrentUser() as User;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <ConversationList conversations={conversations} currentUser={currentUser} />
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
