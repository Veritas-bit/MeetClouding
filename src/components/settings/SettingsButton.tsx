
"use client";

import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

export interface SettingsButtonProps {
  icon: LucideIcon;
  text: string;
  href: string;
}

export function SettingsButton({ icon: Icon, text, href }: SettingsButtonProps) {
  return (
    <div>
        <Link 
            href={href} 
            className={cn(
                buttonVariants({ variant: "ghost" }), 
                "w-full justify-start h-10 text-base font-normal hover:bg-transparent"
            )}
        >
        <Icon className="mr-4 h-4 w-4 text-foreground" />
        {text}
        </Link>
        <Separator />
    </div>
  );
}
