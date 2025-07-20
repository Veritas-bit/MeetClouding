
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { LifeBuoy, Bell, Palette, Languages, Star, Info, Gem, Sun, Moon, Laptop, UserCog, LogOut, Pencil, Bot, Sunrise, Sunset } from "lucide-react";
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


const settingsItems: SettingsButtonProps[] = [
  { icon: UserCog, text: "Управление аккаунтом", href: "/settings/account" },
  { icon: LifeBuoy, text: "Помощь", href: "/settings/help" },
  { icon: Bell, text: "Уведомления", href: "/settings/notifications" },
  { icon: Languages, text: "Язык", href: "/settings/language" },
  { icon: Star, text: "Оценить приложение", href: "/settings/rate" },
  { icon: Info, text: "О приложении", href: "/settings/about" },
];

function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themeOptions = [
    { value: "light", label: "Светлая", icon: Sun },
    { value: "dark", label: "Темная", icon: Moon },
    { value: "early-morning", label: "Дневная", icon: Sunrise },
    { value: "evening", label: "Вечерняя", icon: Sunset },
    { value: "auto", label: "Авто", icon: Bot },
    { value: "system", label: "Системная", icon: Laptop },
  ];

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-start h-10 text-base font-normal">
                <Palette className="mr-4 h-4 w-4 text-foreground" />
                Оформление
            </Button>
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
  )
}

function ProfileSection() {
    const { nickname, about, gender, avatar, isPremium } = useProfileStore();

    const getGenderText = () => {
        switch (gender) {
        case 'male':
            return 'мужской';
        case 'female':
            return 'женский';
        default:
            return 'не выбран';
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto mb-4 relative">
            <Link href="/profile/edit" className="absolute top-2 right-2">
                <Button variant="ghost" size="sm">
                    <Pencil className="mr-2 h-4 w-4" />
                    Изменить
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
                        {nickname || 'Пользователь'}
                        {isPremium && <Gem className="h-4 w-4 text-primary" />}
                    </h1>
                    <p className="text-xs text-muted-foreground">{getGenderText()}</p>
                </div>

                <Card className="bg-card/50 w-full">
                    <CardContent className="px-3 pt-2 pb-3">
                        <h2 className="text-sm font-semibold mt-1">О себе</h2>
                        <p className="text-xs text-muted-foreground mt-1">
                        {about || 'Информация не указана.'}
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

  const handleLogout = () => {
    logout();
    router.replace('/');
  };
  
  return (
    <div className="container mx-auto p-4 pb-24">
      <ProfileSection />
      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col">
            {settingsItems.map((item, index) => (
              <SettingsButton key={index} {...item} />
            ))}
            <div>
              <ThemeSwitcher />
              <Separator />
            </div>
             <div className="pt-4 px-2 pb-2">
                <Link 
                  href="/settings/premium"
                  className={cn(
                    "inline-flex items-center justify-center gap-2 w-full h-10 text-base rounded-lg uppercase bg-[linear-gradient(135deg,var(--tw-gradient-stops))] from-primary to-secondary text-primary-foreground shadow-lg shadow-primary/40 transition-all duration-300 active:shadow-xl active:shadow-primary/60",
                    "font-medium" 
                  )}
                >
                  <Gem className="mr-4 h-5 w-5" />
                  Премиум-аккаунт
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
                  Выйти
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
