
"use client";

import Link from "next/link";
import { usePathname, useParams, useRouter, useSearchParams } from "next/navigation";
import { GradientCloudIcon } from "@/components/icons/GradientCloudIcon";
import { GradientMessageCircleIcon } from "@/components/icons/GradientMessageCircleIcon";
import React from "react";
import { GradientUserCircleIcon } from "@/components/icons/GradientUserCircleIcon";
import { cn } from "@/lib/utils";
import { mockChats, mockFriendsChats } from "@/app/(main)/chats/page";
import type { ChatItemProps } from "@/components/chats/ChatItem";
import { ArrowLeft, MapIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Image from "next/image";

const BackToMapButton = () => {
    const router = useRouter();
    return (
        <Button variant="ghost" size="sm" onClick={() => router.push('/map')} className="text-foreground text-xs absolute left-4">
            <MapIcon className="h-4 w-4 mr-1" />
            На карту
        </Button>
    )
};


const defaultHeader = (
    <>
        <Link href="/main" className="flex items-center space-x-2 ml-4">
           <GradientCloudIcon className="h-8 w-8" />
           <span className="text-3xl font-headline bg-[linear-gradient(135deg,var(--tw-gradient-stops))] from-primary to-secondary bg-clip-text text-transparent">MeetCloud</span>
        </Link>
         <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-1">
                {/* Additional nav items can go here */}
            </nav>
        </div>
    </>
);

const HeaderWithBackButton = ({ title, backPath }: { title: string, backPath?: string }) => {
    const router = useRouter();
    const handleBack = () => {
        if (backPath) {
            router.push(backPath);
        } else {
            router.back();
        }
    }
    return (
         <div className="w-full h-full relative flex items-center justify-center">
             <Button variant="ghost" size="icon" onClick={handleBack} className="text-foreground absolute left-0">
                <ArrowLeft className="h-6 w-6" />
                <span className="sr-only">Назад</span>
             </Button>
             <span className="text-xl font-headline text-foreground">{title}</span>
         </div>
    );
};


const ChatHeader = ({ chatInfo, showMapButton }: { chatInfo: ChatItemProps, showMapButton: boolean }) => {
    const router = useRouter();
    
    return (
        <div className="w-full h-full relative flex items-center justify-center">
            <div className="absolute left-0">
                 {showMapButton ? (
                    <Button variant="ghost" size="icon" onClick={() => router.push('/map')} className="text-foreground">
                        <MapIcon className="h-6 w-6" />
                        <span className="sr-only">На карту</span>
                    </Button>
                ) : (
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-foreground">
                        <ArrowLeft className="h-6 w-6" />
                        <span className="sr-only">Назад</span>
                    </Button>
                )}
            </div>
            
            <Link href={`/users/${chatInfo.id}`} className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                    <Image
                        src={chatInfo.avatarUrl}
                        alt={chatInfo.name}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                        data-ai-hint={chatInfo.avatarHint}
                    />
                    <AvatarFallback>{chatInfo.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                     <span className="text-lg font-bold text-foreground leading-none">{chatInfo.name}</span>
                     <span className="text-xs text-muted-foreground">был(а) недавно</span>
                </div>
            </Link>
        </div>
    )
};


export function Header() {
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const [headerContent, setHeaderContent] = React.useState(defaultHeader);
  const [mounted, setMounted] = React.useState(false);
  const showMapButton = searchParams.get('from') === 'map';

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    
    if (pathname.startsWith('/chats/')) {
        const chatId = params.id as string;
        const allChats: ChatItemProps[] = [...mockChats, ...mockFriendsChats];
        const chatInfo = allChats.find(chat => chat.id === chatId);
        
        if (chatInfo) {
            setHeaderContent(<ChatHeader chatInfo={chatInfo} showMapButton={showMapButton} />);
        } else {
            setHeaderContent(defaultHeader); // Fallback
        }
    } else if (pathname.startsWith('/users/')) {
        const userId = params.id as string;
        const allUsers: ChatItemProps[] = [...mockChats, ...mockFriendsChats];
        const userInfo = allUsers.find(user => user.id === userId);
        const title = userInfo ? `Профиль ${userInfo.name}` : "Профиль";
        setHeaderContent(<HeaderWithBackButton title={title} />);
    } else if (pathname === '/chats') {
        setHeaderContent(
            <div className="w-full h-full relative flex items-center justify-center">
                {showMapButton && <BackToMapButton />}
                <span className="text-xl font-headline text-foreground">Чаты</span>
            </div>
        );
    } else if (pathname.startsWith('/profile/edit')) {
        setHeaderContent(<HeaderWithBackButton title="Редактирование профиля" backPath="/settings" />);
    } else if (pathname === '/settings') {
         setHeaderContent(
            <div className="w-full h-full relative flex items-center justify-center">
                <span className="text-xl font-headline text-foreground">Настройки</span>
            </div>
         );
    } else if (pathname.startsWith('/settings/')) {
        let title = "Настройки";
        if (pathname.includes('account')) title = "Аккаунт";
        if (pathname.includes('help')) title = "Помощь";
        if (pathname.includes('notifications')) title = "Уведомления";
        if (pathname.includes('language')) title = "Язык";
        if (pathname.includes('rate')) title = "Оценить приложение";
        if (pathname.includes('about')) title = "О приложении";
        if (pathname.includes('premium')) title = "Премиум";
        
        setHeaderContent(<HeaderWithBackButton title={title} backPath="/settings" />);

    } else {
        setHeaderContent(defaultHeader);
    }
  }, [pathname, params, mounted, showMapButton]);

  if (!mounted) {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                {defaultHeader}
            </div>
        </header>
    );
  }
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className={cn("container flex h-16 items-center justify-between space-x-4 px-4 sm:space-x-0")}>
        {headerContent}
      </div>
    </header>
  );
}
