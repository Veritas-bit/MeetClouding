
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { ChatItem, type ChatItemProps } from "./ChatItem";


interface ChatListProps {
    mainChats: ChatItemProps[];
    friendChats: ChatItemProps[];
}

export function ChatList({ mainChats, friendChats }: ChatListProps) {
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
                  {mainChats.map((chat) => (
                    <Link key={chat.id} href={`/chats/${chat.id}`} passHref>
                        <ChatItem {...chat} />
                    </Link>
                  ))}
                </div>
            </TabsContent>
            <TabsContent value="friends" className="m-0">
                <div className="flex flex-col">
                  {friendChats.map((chat) => (
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
