
"use client";

import Link from "next/link";
import { usePathname, useParams, useRouter, useSearchParams } from "next/navigation";
import { GradientCloudIcon } from "@/components/icons/GradientCloudIcon";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";
import type { Conversation, User } from "@/lib/types";
import { getConversationById, getCurrentUser } from "@/lib/mock-data";
import { useTranslation } from "@/hooks/use-translation";
import { useInteractionStore } from "@/lib/interaction-store";
import type { Gender } from "@/lib/profile-store";
import { MaleIcon } from "@/components/icons/gender/MaleIcon";
import { FemaleIcon } from "@/components/icons/gender/FemaleIcon";
import { NeuterIcon } from "@/components/icons/gender/NeuterIcon";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackIcon } from "../icons/BackIcon";

const GenderAvatar = ({ gender }: { gender: Gender }) => {
    const iconProps = { className: "w-full h-full p-1.5" };
    switch (gender) {
        case 'male':
            return <MaleIcon {...iconProps} />;
        case 'female':
            return <FemaleIcon {...iconProps} />;
        default:
            return <NeuterIcon {...iconProps} />;
    }
};

const BackButton = ({ onClick, srText }: { onClick: () => void, srText: string }) => {
    return (
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClick} 
            className="hover:bg-transparent active:bg-transparent group"
        >
            <BackIcon className="h-6 w-6 text-muted-foreground group-active:text-primary" />
            <span className="sr-only">{srText}</span>
        </Button>
    )
}


const BackToMapButton = () => {
    const router = useRouter();
    const t = useTranslation();
    const setHasInteractedWithMap = useInteractionStore((state) => state.setHasInteractedWithMap);
    
    const handleClick = () => {
        setHasInteractedWithMap(false);
        router.push('/map');
    }

    return <BackButton onClick={handleClick} srText={t('backToMap')} />;
};


const defaultHeader = (
    <>
        <Link href="/main" className="flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary bg-clip-text">
           <GradientCloudIcon className="h-8 w-8 text-transparent" />
           <span className="text-3xl font-headline text-transparent">MeetCloud</span>
        </Link>
         <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-1">
                {/* Additional nav items can go here */}
            </nav>
        </div>
    </>
);

const HeaderWithBackButton = ({ titleKey, showMapButton }: { titleKey?: string, showMapButton?: boolean }) => {
    const router = useRouter();
    const t = useTranslation();
    const handleBack = () => {
        router.back();
    }
    return (
         <div className="w-full h-full relative flex items-center justify-center">
             <div className="absolute left-0">
                {showMapButton ? <BackToMapButton /> : (
                    <BackButton onClick={handleBack} srText={t('back')} />
                )}
             </div>
             {titleKey && <span className="text-xl font-headline text-foreground">{t(titleKey as any)}</span>}
         </div>
    );
};


const ChatHeader = ({ chatInfo, showMapButton }: { chatInfo: User, showMapButton: boolean }) => {
    const router = useRouter();
    const t = useTranslation();
    const setHasInteractedWithMap = useInteractionStore((state) => state.setHasInteractedWithMap);
    
    const handleBackToMap = () => {
        setHasInteractedWithMap(false);
        router.push('/map');
    }
    
    return (
        <div className="w-full h-full relative flex items-center justify-center">
            <div className="absolute left-0">
                 {showMapButton ? (
                    <BackButton onClick={handleBackToMap} srText={t('backToMap')} />
                ) : (
                    <BackButton onClick={() => router.back()} srText={t('back')} />
                )}
            </div>
            
            <Link href={`/users/${chatInfo.id}`} className="flex items-center">
                <Avatar className="h-8 w-8 mr-2 bg-muted/50">
                    {chatInfo.avatarUrl ? (
                        <AvatarImage
                            src={chatInfo.avatarUrl}
                            alt={chatInfo.name}
                        />
                    ) : null}
                    <AvatarFallback>
                        <GenderAvatar gender={chatInfo.gender} />
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                     <span className="text-lg font-bold text-foreground leading-none">{chatInfo.name}</span>
                     <span className="text-xs text-muted-foreground">{t('wasRecently')}</span>
                </div>
            </Link>
        </div>
    )
};


export function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const [headerContent, setHeaderContent] = React.useState(defaultHeader);
  const [mounted, setMounted] = React.useState(false);
  const { hasInteractedWithMap, setHasInteractedWithMap } = useInteractionStore();
  const t = useTranslation();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;

    // Reset interaction flag if user navigates to the main page
    if(pathname === '/main') {
        setHasInteractedWithMap(false);
    }
    
    const fetchChatInfo = async () => {
        const shouldShowMapButton = hasInteractedWithMap;
        const fromParam = searchParams.get('from');

        if (pathname.endsWith('/gallery')) {
            const activeTab = searchParams.get('view') === 'camera' ? 'camera' : 'gallery';
            setHeaderContent(
                 <div className="w-full h-full relative flex items-center justify-center">
                    <div className="absolute left-0">
                        <BackButton onClick={() => router.back()} srText={t('back')} />
                    </div>
                    <Tabs 
                        defaultValue={activeTab} 
                        value={activeTab}
                        onValueChange={(value) => {
                            // Logic to switch views will be here
                        }}
                        className="w-auto"
                    >
                        <TabsList className="bg-primary/10">
                            <TabsTrigger value="gallery">Галерея</TabsTrigger>
                            <TabsTrigger value="camera">Камера</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            );
        } else if (pathname.startsWith('/chats/')) {
            const chatId = params.id as string;
            const conversation = await getConversationById(chatId);
            const currentUser = await getCurrentUser();
            if (conversation && currentUser) {
                const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id);
                if (otherParticipant) {
                  setHeaderContent(<ChatHeader chatInfo={otherParticipant} showMapButton={shouldShowMapButton} />);
                }
            } else {
                setHeaderContent(defaultHeader); // Fallback
            }
        } else if (pathname.startsWith('/users/')) {
            setHeaderContent(<HeaderWithBackButton titleKey="profile" showMapButton={shouldShowMapButton} />);
        } else if (pathname === '/chats') {
            const activeTab = searchParams.get('tab') === 'friends' ? 'friends' : 'all';
            setHeaderContent(
                <div className="w-full h-full relative flex items-center justify-end">
                    <div className="absolute left-0">
                        {shouldShowMapButton && <BackToMapButton />}
                    </div>
                    <Tabs 
                        defaultValue={activeTab} 
                        value={activeTab}
                        onValueChange={(value) => {
                            router.push(value === 'friends' ? '/chats?tab=friends' : '/chats');
                        }}
                        className="w-auto"
                    >
                        <TabsList className="bg-primary/10">
                            <TabsTrigger value="all">Чаты</TabsTrigger>
                            <TabsTrigger value="friends">Друзья</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            );
        } else if (pathname.startsWith('/settings')) {
            const isPremiumFromSearch = pathname.includes('/premium') && (fromParam === 'search' || fromParam === 'categorize');
            const showMapButton = shouldShowMapButton && !isPremiumFromSearch;
            
            if (showMapButton || pathname !== '/settings') {
                 let titleKey: string | undefined = undefined;
                if (pathname !== '/settings') {
                    titleKey = "settings";
                    if (pathname.includes('account')) titleKey = "account";
                    if (pathname.includes('blocked')) titleKey = "blockedUsers";
                    if (pathname.includes('help')) titleKey = "help";
                    if (pathname.includes('notifications')) titleKey = "notifications";
                    if (pathname.includes('language')) titleKey = "language";
                    if (pathname.includes('rate')) titleKey = "rateApp";
                    if (pathname.includes('about')) titleKey = "aboutApp";
                    if (pathname.includes('premium')) titleKey = "premium";
                }
                setHeaderContent(<HeaderWithBackButton titleKey={titleKey} showMapButton={showMapButton} />);
            } else {
                setHeaderContent(<div />);
            }
        } else {
            setHeaderContent(defaultHeader);
        }
    };
    
    fetchChatInfo();

  }, [pathname, params, mounted, hasInteractedWithMap, setHasInteractedWithMap, t, router, searchParams]);

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
    <header className={cn("sticky top-0 z-40 w-full border-b bg-background")}>
      <div className={cn("container flex h-16 items-center justify-between space-x-4 px-4 sm:space-x-0")}>
        {headerContent}
      </div>
    </header>
  );
}
