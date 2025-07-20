"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, UserCheck, UserX, Send, Check, X, Gem } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import { mockChats, mockFriendsChats } from "@/app/(main)/chats/page";
import type { ChatItemProps } from "@/components/chats/ChatItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gender, useProfileStore } from "@/lib/profile-store";

const meetingPhotos = [
  { src: "https://placehold.co/200x200.png", alt: "Meeting photo 1", hint: "people meeting" },
  { src: "https://placehold.co/200x200.png", alt: "Meeting photo 2", hint: "friends cafe" },
  { src: "https://placehold.co/200x200.png", alt: "Meeting photo 3", hint: "people concert" },
  { src: "https://placehold.co/200x200.png", alt: "Meeting photo 4", hint: "group selfie" },
  { src: "https://placehold.co/200x200.png", alt: "Meeting photo 5", hint: "friends laughing" },
  { src: "https://placehold.co/200x200.png", alt: "Meeting photo 6", hint: "outdoor activity" },
];

type FriendshipStatus = "none" | "sent" | "received" | "friends";

// Mock hook for friendship status
const useFriendshipStatus = (userId: string): [FriendshipStatus, (action: "send" | "cancel" | "accept" | "decline" | "remove") => void] => {
  const isInitiallyFriend = mockFriendsChats.some(friend => friend.id === userId);
  const initialStatus: FriendshipStatus = isInitiallyFriend ? "friends" : "none";
  
  const [status, setStatus] = useState<FriendshipStatus>(initialStatus);
  const { toast } = useToast();

  const handleAction = (action: "send" | "cancel" | "accept" | "decline" | "remove") => {
    switch(action) {
      case "send":
        setStatus("sent");
        toast({ title: "Запрос отправлен", description: "Ожидайте подтверждения от пользователя." });
        break;
      case "accept":
        setStatus("friends");
        toast({ title: "Запрос принят!", description: "Теперь вы друзья." });
        break;
      case "decline":
        setStatus("none");
        toast({ title: "Запрос отклонен" });
        break;
      case "remove":
        setStatus("none");
        toast({ title: "Друг удален", variant: "destructive" });
        break;
      case "cancel": // Placeholder for future use
        setStatus("none");
        toast({ title: "Запрос отменен" });
        break;
    }
  };

  return [status, handleAction];
}

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const { isPremium } = useProfileStore(); // Mock premium status for the viewed user. In real app, this would come with user data.

  const [friendshipStatus, handleFriendshipAction] = useFriendshipStatus(userId);

  // Find user info from mock data. In a real app, this would be a fetch.
  const allUsers: ChatItemProps[] = [...mockChats, ...mockFriendsChats];
  const userInfo = allUsers.find(user => user.id === userId);
  

  const getGenderText = (gender?: Gender) => {
    switch (gender) {
      case 'male': return 'мужской';
      case 'female': return 'женский';
      default: return 'не выбран';
    }
  };

  const renderFriendshipButton = () => {
    switch(friendshipStatus) {
      case 'none':
        return (
          <Button onClick={() => handleFriendshipAction('send')} className="w-full">
            <UserPlus className="mr-2 h-4 w-4" />
            Добавить в друзья
          </Button>
        );
      case 'sent':
        return (
          <Button variant="outline" disabled className="w-full">
            <Send className="mr-2 h-4 w-4" />
            Запрос отправлен
          </Button>
        );
      case 'received':
        return (
          <div className="flex w-full gap-2">
            <Button onClick={() => handleFriendshipAction('accept')} className="w-full">
              <Check className="mr-2 h-4 w-4" />
              Принять
            </Button>
            <Button variant="destructive" onClick={() => handleFriendshipAction('decline')} className="w-full">
              <X className="mr-2 h-4 w-4" />
              Отклонить
            </Button>
          </div>
        );
      case 'friends':
        return (
          <Button variant="secondary" onClick={() => handleFriendshipAction('remove')} className="w-full">
            <UserMinus className="mr-2 h-4 w-4" />
            Удалить из друзей
          </Button>
        );
      default:
        return null;
    }
  }

  if (!userInfo) {
    return <div className="flex flex-grow items-center justify-center">Пользователь не найден.</div>;
  }
  
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 pt-4 pb-24 flex flex-col items-center">
      <div className="relative">
        <Image
          src={userInfo.avatarUrl || "https://placehold.co/64x64.png"}
          alt={userInfo.name || "User Avatar"}
          width={64}
          height={64}
          className="rounded-full border-2 border-background object-cover aspect-square"
          data-ai-hint={userInfo.avatarHint}
        />
        {isPremium && (
          <div className="absolute -bottom-1 -right-1 bg-gradient-to-tr from-primary to-secondary p-1 rounded-full">
              <Gem className="h-3 w-3 text-primary-foreground" />
          </div>
        )}
      </div>

      <div className="text-center mb-4">
        <h1 className="text-md font-bold text-foreground">{userInfo.name || 'Пользователь'}</h1>
        <p className="text-xs text-muted-foreground">{getGenderText(userInfo.gender)}</p>
      </div>

      <div className="w-full max-w-md space-y-4">
        
        {renderFriendshipButton()}
        
        <Card className="bg-card/50">
          <CardContent className="px-3 pt-2 pb-3">
            <h2 className="text-sm font-semibold mt-1">О себе</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Информация не указана.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50">
            <CardHeader className="px-3 pt-2 pb-2">
                <CardTitle className="text-sm font-semibold">Медиатека</CardTitle>
            </CardHeader>
            <CardContent className="px-1 pb-1">
                <Tabs defaultValue="photos" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 h-auto">
                        <TabsTrigger value="photos" className="text-xs">Фото</TabsTrigger>
                        <TabsTrigger value="videos" className="text-xs">Видео</TabsTrigger>
                        <TabsTrigger value="audio" className="text-xs">Голосовые</TabsTrigger>
                        <TabsTrigger value="links" className="text-xs">Ссылки</TabsTrigger>
                    </TabsList>
                    <TabsContent value="photos" className="mt-2">
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2 p-2">
                            {meetingPhotos.map((photo, index) => (
                                <div key={index} className="relative aspect-square w-full">
                                    <Image 
                                        src={photo.src} 
                                        alt={photo.alt} 
                                        fill
                                        sizes="(max-width: 768px) 50vw, 33vw"
                                        className="rounded-md object-cover" 
                                        data-ai-hint={photo.hint} 
                                    />
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="videos">
                        <div className="text-center p-8 text-muted-foreground text-sm">
                            Здесь будут видео из чата.
                        </div>
                    </TabsContent>
                    <TabsContent value="audio">
                        <div className="text-center p-8 text-muted-foreground text-sm">
                            Здесь будут голосовые сообщения из чата.
                        </div>
                    </TabsContent>
                    <TabsContent value="links">
                        <div className="text-center p-8 text-muted-foreground text-sm">
                            Здесь будут ссылки из чата.
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
