
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LifeBuoy, Bell, Palette, Languages, Star, Info, Gem, Sun, Moon, Laptop, UserCog, LogOut, Pencil, Sunrise, Sunset, Orbit } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SettingsButton, type SettingsButtonProps } from "@/components/settings/SettingsButton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useProfileStore } from "@/lib/profile-store";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { ScrollArea } from "@/components/ui/scroll-area";


function ProfileSection() {
    const { nickname, about, gender, avatar, isPremium } = useProfileStore();
    const t = useTranslation();


    const getGenderText = () => {
        switch (gender) {
        case 'male':
            return t('genderMale');
        case 'female':
            return t('genderFemale');
        default:
            return t('genderUnselected');
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto mb-4 relative">
            <Link href="/profile/edit" className="absolute top-2 right-2">
                <Button variant="ghost" size="sm">
                    <Pencil className="mr-2 h-4 w-4" />
                    {t('edit')}
                </Button>
            </Link>
            <CardContent className="p-4 flex flex-col items-center">
                 <div className="relative mt-8">
                    <Image
                    src={avatar || "https://placehold.co/64x64.png"}
                    alt={nickname || "User Avatar"}
                    width={64}
                    height={64}
                    className="rounded-full border-2 border-background object-cover aspect-square"
                    data-ai-hint="person portrait"
                    />
                </div>

                <div className="text-center mt-2 mb-2">
                    <h1 className="text-md font-bold text-foreground flex items-center gap-2">
                        {nickname || t('user')}
                        {isPremium && <Gem className="h-4 w-4 text-primary" />}
                    </h1>
                    <p className="text-xs text-muted-foreground">{getGenderText()}</p>
                </div>

                <Card className="bg-card/50 w-full">
                    <CardContent className="px-3 pt-2 pb-3">
                        <h2 className="text-sm font-semibold mt-1">{t('aboutSelf')}</h2>
                        <p className="text-xs text-muted-foreground mt-1">
                        {about || t('infoNotProvided')}
                        </p>
                    </CardContent>
                </Card>
            </CardContent>
        </Card>
    );
}

export default function SettingsPage() {
  const router = useRouter();
  const logout = useProfileStore((state) => state.logout);
  const t = useTranslation();

  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  const settingsItems: SettingsButtonProps[] = [
    { icon: UserCog, text: t('accountManagement'), href: "/settings/account" },
    { icon: LifeBuoy, text: t('help'), href: "/settings/help" },
    { icon: Bell, text: t('notifications'), href: "/settings/notifications" },
    { icon: Languages, text: t('language'), href: "/settings/language" },
    { icon: Star, text: t('rateApp'), href: "/settings/rate" },
    { icon: Info, text: t('aboutApp'), href: "/settings/about" },
  ];

  const themeOptions = [
    { value: "light", label: t('themeMorning'), icon: Sun },
    { value: "early-morning", label: t('themeDay'), icon: Sunrise },
    { value: "evening", label: t('themeEvening'), icon: Sunset },
    { value: "dark", label: t('themeNight'), icon: Moon },
    { value: "auto", label: t('themeAuto'), icon: Orbit },
    { value: "system", label: t('themeSystem'), icon: Laptop },
  ];
  
  return (
    <ScrollArea className="flex-1">
        <div className="container mx-auto p-4 pb-24">
        <ProfileSection />
        <Card className="w-full max-w-md mx-auto">
            <CardContent className="p-0">
            <div className="flex flex-col">
                {settingsItems.map((item, index) => (
                <SettingsButton key={index} {...item} />
                ))}
                <div>
                <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                    <CollapsibleTrigger asChild>
                        <button className="flex w-full items-center justify-start h-10 px-4 text-base font-normal text-foreground bg-transparent">
                            <Palette className="mr-4 h-4 w-4 text-foreground" />
                            {t('theme')}
                        </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className="p-2 pt-0">
                            <Card className="bg-muted/50">
                                <CardContent className="p-1 space-y-1">
                                    {themeOptions.map((option) => (
                                        <Button 
                                            key={option.value}
                                            variant={theme === option.value ? "secondary" : "ghost"} 
                                            className="w-full justify-start h-10 font-normal" 
                                            onClick={() => { setTheme(option.value); setIsOpen(false); }}>
                                            <option.icon className="mr-4 h-4 w-4" />
                                            {option.label}
                                        </Button>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>
                    </CollapsibleContent>
                </Collapsible>
                <Separator />
                </div>
                <div className="pt-4 px-2 pb-2">
                    <Link 
                    href="/settings/premium"
                    className={cn(
                        "inline-flex items-center justify-center gap-2 w-full h-10 text-base rounded-lg uppercase bg-[linear-gradient(135deg,var(--tw-gradient-stops))] from-primary to-secondary text-primary-foreground",
                        "font-medium" 
                    )}
                    >
                    <Gem className="mr-4 h-5 w-5" />
                    {t('premium')}
                    </Link>
                </div>
                <Separator />
                <div className="flex justify-center px-2 py-4">
                <Button 
                    variant="destructive" 
                    className="w-auto px-8"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2 h-5 w-5" />
                    {t('logout')}
                </Button>
                </div>
            </div>
            </CardContent>
        </Card>
        </div>
    </ScrollArea>
  );
}
