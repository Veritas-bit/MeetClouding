
"use client";

import { useState, type KeyboardEvent, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Shuffle, Check, Send } from "lucide-react";
import { SheetClose, SheetHeader, SheetTitle } from "../ui/sheet";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import { useToast } from "@/hooks/use-toast";
import { FullScreenLoader } from "../common/FullScreenLoader";
import { WISHES } from "@/lib/wishes";
import { WISH_CATEGORY_KEYS, type WishCategoryKey } from "@/lib/categories";
import { useTranslation } from "@/hooks/use-translation";
import { GradientBorderCloudIcon } from "../icons/GradientBorderCloudIcon";


export function WantSheet() {
  const [message, setMessage] = useState("");
  const [placeholderWish, setPlaceholderWish] = useState<{key: string, category: WishCategoryKey} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const t = useTranslation();

  const fetchNewWish = () => {
    setIsLoading(true);
    
    const availableCategories = WISH_CATEGORY_KEYS.filter(key => WISHES[key] && WISHES[key].length > 0);
    const randomCategoryKey = availableCategories[Math.floor(Math.random() * availableCategories.length)];
    const wishesForCategory = WISHES[randomCategoryKey];
    
    const randomWishKey = wishesForCategory[Math.floor(Math.random() * wishesForCategory.length)];

    setPlaceholderWish({ key: randomWishKey, category: randomCategoryKey });

    setTimeout(() => setIsLoading(false), 200); 
  };

  useEffect(() => {
    fetchNewWish();
  }, []); 


  const handleNext = () => {
    if (!message) return;
    const finalMessage = message.trim().toLowerCase().startsWith(t('iWant').toLowerCase()) 
      ? message.trim()
      : `${t('iWant')} ${message.trim()}`;
      
    const encodedMessage = encodeURIComponent(finalMessage);
    router.push(`/want/categorize?message=${encodedMessage}`);
  };

  const handleSelectWish = () => {
      if (isLoading || !placeholderWish) return;
      const wishText = t(placeholderWish.key as any);
      const wishToPublish = `${t('iWant')} ${wishText}`;
      const encodedMessage = encodeURIComponent(wishToPublish);
      router.push(`/want/categorize?message=${encodedMessage}&category=${placeholderWish.category}`);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); 
      if (message) {
        handleNext();
      }
    }
  };

  const isSendDisabled = message.trim() === '';

  return (
    <>
      {isLoading && <FullScreenLoader text={t('generatingWish')} />}
      <div className="flex flex-col h-full bg-background">
        <SheetHeader className="p-4 flex-row items-center justify-start">
            <SheetClose asChild>
              <Button variant="outline" size="lg" className="border-primary/50 text-foreground">
                  {t('back')}
              </Button>
            </SheetClose>
            <SheetTitle className="sr-only">{t('formulateWishTitle')}</SheetTitle>
        </SheetHeader>
        <div className="p-4 flex-grow flex flex-col justify-center items-center text-center">
          <h1 className="text-3xl font-bold font-headline text-primary mb-4">
              {t('selectWishTitle')}
          </h1>
          <Card className="bg-muted/50 border-dashed w-full max-w-sm min-h-[6rem] flex items-center justify-center">
              <CardContent className="p-3">
                  {isLoading || !placeholderWish ? (
                      <GradientBorderCloudIcon className="h-8 w-8" />
                  ) : (
                      <p className="text-muted-foreground">{t('iWant')} {t(placeholderWish.key as any)}</p>
                  )}
              </CardContent>
          </Card>
          <div className="mt-2 flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSelectWish} disabled={isLoading}>
                  <Check className="mr-2 h-4 w-4"/>
                  {t('selectButton')}
              </Button>
              <Button variant="ghost" size="sm" onClick={fetchNewWish} className="text-muted-foreground" disabled={isLoading}>
                  <Shuffle className="mr-2 h-4 w-4"/>
                  {t('anotherOptionButton')}
              </Button>
          </div>
        </div>


        <div className="p-4 border-t bg-background mt-auto">
            <div
                className={cn(
                    "relative w-full rounded-lg p-px",
                    "bg-gradient-to-r from-primary/30 to-secondary/30",
                    "transition-all duration-300",
                    "focus-within:from-primary/80 focus-within:to-secondary/80"
                )}
            >
                <div className="relative flex items-center bg-muted/50 rounded-[7px]">
                    <Textarea
                        ref={textareaRef}
                        placeholder={t('writeOwnOptionPlaceholder')}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleNext();
                            }
                        }}
                        rows={1}
                        className="flex-1 max-h-24 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-2"
                    />
                    <Button
                        className="shrink-0 hover:bg-transparent active:bg-transparent"
                        size="icon"
                        variant="ghost"
                        onClick={handleNext}
                        disabled={isSendDisabled}
                        aria-label={t('nextButtonLabel')}
                    >
                        <Send className={cn("h-5 w-5 text-muted-foreground", !isSendDisabled && "text-primary", "transition-colors")} />
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </>
  );
}
