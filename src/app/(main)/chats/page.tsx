
'use client';

import { ChatItem, type ChatItemProps } from "@/components/chats/ChatItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getConversations, getCurrentUser } from "@/lib/mock-data";
import type { Conversation, User } from "@/lib/types";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import Link from "next/link";
import { FullScreenLoader } from "@/components/common/FullScreenLoader";
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
        unreadCount: unreadCount,
        avatarHint: "person portrait",
        isOnline: otherParticipant.isOnline,
        gender: 'unselected' // Placeholder, as mock User doesn't have gender
    };
}


export default function ChatsPage() {
  const [chatItems, setChatItems] = useState<ChatItemProps[]>([]);
  const [friendChatItems, setFriendChatItems] = useState<ChatItemProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConversations() {
      const allConversations = await getConversations();
      const currentUser = await getCurrentUser() as User;
      
      const mainConvs = allConversations.filter(c => c.id.startsWith('conv-'));
      const friendConvs = allConversations.filter(c => !c.id.startsWith('conv-'));

      const mainChatProps = mainConvs.map(c => transformConversationToProps(c, currentUser)).filter(Boolean) as ChatItemProps[];
      const friendChatProps = friendConvs.map(c => transformConversationToProps(c, currentUser)).filter(Boolean) as ChatItemProps[];
      
      setChatItems(mainChatProps);
      setFriendChatItems(friendChatProps);
      setLoading(false);
    }

    loadConversations();
  }, []);

  if (loading) {
    return <FullScreenLoader text="Загрузка чатов..." />;
  }

  return (
    <div className="container mx-auto p-0 sm:p-4 pb-24">
      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-center p-2 sticky top-16 bg-background z-10">
            <TabsList>
                <TabsTrigger value="all">Чаты</TabsTrigger>
                <TabsTrigger value="friends">Друзья</TabsTrigger>
            </TabsList>
        </div>
        <div className="pt-2">
            <TabsContent value="all" className="m-0">
                <div className="flex flex-col">
                  {chatItems.map((chat) => (
                    <Link key={chat.id} href={`/chats/${chat.id}`} passHref>
                        <ChatItem {...chat} />
                    </Link>
                  ))}
                </div>
            </TabsContent>
            <TabsContent value="friends" className="m-0">
                <div className="flex flex-col">
                  {friendChatItems.map((chat) => (
                    <Link key={chat.id} href={`/chats/${chat.id}`} passHref>
                      <ChatItem key={chat.id} {...chat} />
                    </Link>
                  ))}
                </div>
            </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
