
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Send, Settings, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/use-translation";

const navItems = [
  { href: "/main", icon: Cloud, translationKey: "navMain" },
  { href: "/chats", icon: Send, translationKey: "navChats" },
  { href: "/settings", icon: Settings, translationKey: "navSettings" },
];

function BottomNavBarPlaceholder() {
    const t = useTranslation();
    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-background border-t border-border shadow-t-lg z-50">
            <div className="flex justify-around items-center h-full max-w-lg mx-auto px-2">
                {navItems.map((item) => (
                    <div
                        key={item.href}
                        className="flex-1 flex flex-col items-center justify-center gap-1 text-muted-foreground"
                    >
                        <item.icon className="h-6 w-6" />
                        <span className="text-xs font-medium">{t(item.translationKey)}</span>
                    </div>
                ))}
            </div>
        </nav>
    );
}


export function BottomNavBar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const t = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <BottomNavBarPlaceholder />;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-background border-t border-border shadow-t-lg z-50">
      <div className="flex justify-around items-center h-full max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          
          return (
            <Link 
              href={item.href} 
              key={item.href} 
              className="flex-1"
            >
              <div
                className={cn(
                  "flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors duration-200",
                   isActive ? "text-primary" : "active:text-foreground"
                )}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs font-medium">{t(item.translationKey)}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

    