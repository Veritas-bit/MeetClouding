
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useLanguageStore, type Language } from "@/lib/language-store";
import { cn } from "@/lib/utils";

const availableLanguages: { code: Language; name: string }[] = [
  { code: 'Russian', name: 'Русский' },
  { code: 'English', name: 'Английский' },
  { code: 'Spanish', name: 'Испанский' },
];

export default function LanguagePage() {
  const { language, setLanguage } = useLanguageStore();

  return (
    <div className="container mx-auto p-8 sm:p-12 lg:p-16 pt-8 pb-24 flex flex-col items-center">
      <div className="w-full max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>Язык приложения</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-4">
            <p className="text-muted-foreground pb-2">Выберите язык, на который будут переводиться сообщения в чатах.</p>
            {availableLanguages.map((lang) => (
              <Button
                key={lang.code}
                variant={language === lang.code ? "secondary" : "ghost"}
                className="w-full justify-start text-base h-12"
                onClick={() => setLanguage(lang.code)}
              >
                <Check className={cn("mr-4 h-5 w-5", language === lang.code ? "opacity-100" : "opacity-0")} />
                {lang.name}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
