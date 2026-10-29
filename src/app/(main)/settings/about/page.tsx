"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Github, Info } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

export default function AboutPage() {
  const t = useTranslation();

  return (
    <ScrollArea className="h-full">
      <div className="container mx-auto p-4 pt-8 pb-24 flex flex-col items-center">
        <div className="w-full max-w-lg">
          <Card className="bg-card/50">
            <CardHeader className="flex flex-row items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              <CardTitle>{t('aboutApp')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <p className="text-sm text-muted-foreground leading-relaxed">
                MeetCloud — это социальное приложение нового поколения, помогающее людям находить компанию для реализации своих желаний здесь и сейчас.
              </p>
              
              <div className="pt-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('githubRepo')}
                </p>
                <Button variant="outline" className="w-full justify-start h-12" asChild>
                  <a href="https://github.com/Veritas-bit/MeetClouding" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-3 h-5 w-5" />
                    <span>github.com/Veritas-bit/MeetClouding</span>
                  </a>
                </Button>
              </div>

              <div className="pt-8 border-t flex justify-between items-center text-[10px] text-muted-foreground">
                <span>© 2025 MeetCloud Team</span>
                <span>v1.0.0</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ScrollArea>
  );
}
