
"use client";

import Link from "next/link";
import { usePathname, useParams, useRouter, useSearchParams } from "next/navigation";
import { GradientCloudIcon } from "@/components/icons/GradientCloudIcon";
import React from "react";
import { cn } from "@/lib/utils";
import { ArrowLeft, MapIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import Image from "next/image";
import type { Conversation, User } from "@/lib/types";
import { getConversationById, getCurrentUser } from "@/lib/mock-data";
import { useTranslation } from "@/hooks/use-translation";


const originalTexts = {
  backToMap: "На карту",
  back: "Назад",
  chats: "Чаты",
  profile: "Профиль",
  editProfile: "Редактирование профиля",
  settings: "Настройки",
  account: "Аккаунт",
  help: "Помощь",
  notifications: "Уведомления",
  language: "Язык",
  rateApp: "Оценить приложение",
  aboutApp: "О приложении",
  premium: "Премиум",
  wasRecently: "был(а) недавно",
};


const BackToMapButton = () => {
    const router = useRouter();
    const t = useTranslation({ backToMap: originalTexts.backToMap });
    return (
        <Button variant="ghost" size="sm" onClick={() => router.push('/map')} className="text-foreground text-xs absolute left-4">
            <MapIcon className="h-4 w-4 mr-1" />
            {t.backToMap}
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

const HeaderWithBackButton = ({ titleKey, backPath }: { titleKey: keyof typeof originalTexts, backPath?: string }) => {
    const router = useRouter();
    const t = useTranslation({ title: originalTexts[titleKey], back: originalTexts.back });
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
                <span className="sr-only">{t.back}</span>
             </Button>
             <span className="text-xl font-headline text-foreground">{t.title}</span>
         </div>
    );
};


const ChatHeader = ({ chatInfo, showMapButton }: { chatInfo: User, showMapButton: boolean }) => {
    const router = useRouter();
    const t = useTranslation({ backToMap: originalTexts.backToMap, back: originalTexts.back, wasRecently: originalTexts.wasRecently });
    
    return (
        <div className="w-full h-full relative flex items-center justify-center">
            <div className="absolute left-0">
                 {showMapButton ? (
                    <Button variant="ghost" size="icon" onClick={() => router.push('/map')} className="text-foreground">
                        <MapIcon className="h-6 w-6" />
                        <span className="sr-only">{t.backToMap}</span>
                    </Button>
                ) : (
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-foreground">
                        <ArrowLeft className="h-6 w-6" />
                        <span className="sr-only">{t.back}</span>
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
                        data-ai-hint={"person portrait"}
                    />
                    <AvatarFallback>{chatInfo.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                     <span className="text-lg font-bold text-foreground leading-none">{chatInfo.name}</span>
                     <span className="text-xs text-muted-foreground">{t.wasRecently}</span>
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
  const t = useTranslation({ chats: originalTexts.chats, profile: originalTexts.profile, settings: originalTexts.settings });

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    
    const fetchChatInfo = async () => {
        if (pathname.startsWith('/chats/')) {
            const chatId = params.id as string;
            const conversation = await getConversationById(chatId);
            const currentUser = await getCurrentUser();
            if (conversation && currentUser) {
                const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id);
                if (otherParticipant) {
                  setHeaderContent(<ChatHeader chatInfo={otherParticipant} showMapButton={showMapButton} />);
                }
            } else {
                setHeaderContent(defaultHeader); // Fallback
            }
        } else if (pathname.startsWith('/users/')) {
            setHeaderContent(<HeaderWithBackButton titleKey="profile" />);
        } else if (pathname === '/chats') {
            setHeaderContent(
                <div className="w-full h-full relative flex items-center justify-center">
                    {showMapButton && <BackToMapButton />}
                    <span className="text-xl font-headline text-foreground">{t.chats}</span>
                </div>
            );
        } else if (pathname.startsWith('/profile/edit')) {
            setHeaderContent(<HeaderWithBackButton titleKey="editProfile" backPath="/settings" />);
        } else if (pathname === '/settings') {
             setHeaderContent(
                <div className="w-full h-full relative flex items-center justify-center">
                    <span className="text-xl font-headline text-foreground">{t.settings}</span>
                </div>
             );
        } else if (pathname.startsWith('/settings/')) {
            let titleKey: keyof typeof originalTexts = "settings";
            if (pathname.includes('account')) titleKey = "account";
            if (pathname.includes('help')) titleKey = "help";
            if (pathname.includes('notifications')) titleKey = "notifications";
            if (pathname.includes('language')) titleKey = "language";
            if (pathname.includes('rate')) titleKey = "rateApp";
            if (pathname.includes('about')) titleKey = "aboutApp";
            if (pathname.includes('premium')) titleKey = "premium";
            
            setHeaderContent(<HeaderWithBackButton titleKey={titleKey} backPath="/settings" />);

        } else {
            setHeaderContent(defaultHeader);
        }
    };
    
    fetchChatInfo();

  }, [pathname, params, mounted, showMapButton, t.chats, t.settings]);

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
