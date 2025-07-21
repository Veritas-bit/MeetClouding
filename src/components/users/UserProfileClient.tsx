
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, UserMinus, Send, Check, X } from "lucide-react";
import { getFriendshipStatus, setFriendshipStatus } from "@/lib/mock-data";


type FriendshipStatus = "none" | "sent" | "received" | "friends";

// Mock hook for friendship status
const useFriendshipStatus = (userId: string): [FriendshipStatus, (action: "send" | "cancel" | "accept" | "decline" | "remove") => void] => {
  const [status, setStatus] = useState<FriendshipStatus>(() => getFriendshipStatus(userId));
  const { toast } = useToast();

  const handleAction = (action: "send" | "cancel" | "accept" | "decline" | "remove") => {
    let newStatus: FriendshipStatus = status;
    switch(action) {
      case "send":
        newStatus = "sent";
        toast({ title: "Запрос отправлен", description: "Ожидайте подтверждения от пользователя." });
        break;
      case "accept":
        newStatus = "friends";
        toast({ title: "Запрос принят!", description: "Теперь вы друзья." });
        break;
      case "decline":
        newStatus = "none";
        toast({ title: "Запрос отклонен" });
        break;
      case "remove":
        newStatus = "none";
        toast({ title: "Друг удален", variant: "destructive" });
        break;
      case "cancel": 
        newStatus = "none";
        toast({ title: "Запрос отменен" });
        break;
    }
    setStatus(newStatus);
    setFriendshipStatus(userId, newStatus);
  };

  return [status, handleAction];
}


export function UserProfileClient({ userId }: { userId: string}) {
    const [friendshipStatus, handleFriendshipAction] = useFriendshipStatus(userId);

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

    return renderFriendshipButton();
}
