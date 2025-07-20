
"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export interface SettingsButtonProps {
    icon: LucideIcon;
    text: string;
    href: string;
}

export function SettingsButton({ icon: Icon, text, href }: SettingsButtonProps) {
    return (
        <div>
            <Link href={href}>
                <Button variant="ghost" className="w-full justify-start h-10 text-base font-normal">
                    <Icon className="mr-4 h-4 w-4 text-foreground" />
                    {text}
                </Button>
            </Link>
            <Separator />
        </div>
    );
}
