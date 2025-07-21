
import { getConversations, getCurrentUser } from "@/lib/mock-data";
import type { Conversation, User } from "@/lib/types";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { ChatItemProps } from "@/components/chats/ChatItem";
import { ChatList } from "@/components/chats/ChatList";
import type { Gender } from "@/lib/profile-store";


function transformConversationToProps(conversation: Conversation, currentUser: User): ChatItemProps | null {
    const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id);
    if (!otherParticipant) return null;

    const lastMessage = conversation.messages[conversation.messages.length - 1];

    const unreadCount = conversation.messages.filter(m => m.senderId !== currentUser.id && m.status !== 'read').length;

    return {
        id: conversation.id,
        avatarUrl: otherParticipant.avatarUrl,
        name: otherParticipant.name,
        lastMessage: lastMessage ? lastMessage.text : "Нет сообщений",
        timestamp: lastMessage ? formatDistanceToNow(new Date(lastMessage.timestamp), { addSuffix: true, locale: ru }) : '',
        unreadCount: unreadCount > 0 ? unreadCount : undefined,
        avatarHint: "person portrait",
        isOnline: otherParticipant.isOnline,
        gender: 'unselected' // Placeholder, as mock User doesn't have gender
    };
}


export default async function ChatsPage() {
  const allConversations = await getConversations();
  const currentUser = await getCurrentUser() as User;
  
  const mainConvs = allConversations.filter(c => c.id.startsWith('conv-'));
  const friendConvs = allConversations.filter(c => c.id.startsWith('friend-'));

  const mainChatProps = mainConvs.map(c => transformConversationToProps(c, currentUser)).filter(Boolean) as ChatItemProps[];
  const friendChatProps = friendConvs.map(c => transformConversationToProps(c, currentUser)).filter(Boolean) as ChatItemProps[];

  return <ChatList mainChats={mainChatProps} friendChats={friendChatProps} />;
}
