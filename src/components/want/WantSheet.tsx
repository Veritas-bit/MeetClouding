
"use client";

import { useState, type KeyboardEvent, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Shuffle, Check, LoaderCircle, Send } from "lucide-react";
import { SheetClose, SheetHeader, SheetTitle } from "../ui/sheet";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import { useToast } from "@/hooks/use-toast";
import { GradientCloudIcon } from "../icons/GradientCloudIcon";
import { FullScreenLoader } from "../common/FullScreenLoader";
import { WISHES } from "@/lib/wishes";
import { WISH_CATEGORY_KEYS, type WishCategoryKey } from "@/lib/categories";
import { useTranslation } from "@/hooks/use-translation";


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
        <SheetHeader>
          <SheetTitle className="sr-only">{t('formulateWishTitle')}</SheetTitle>
        </SheetHeader>
        <div className="p-4 flex-grow flex flex-col justify-center items-center text-center">
          <h1 className="text-3xl font-bold font-headline text-primary mb-4">
              {t('selectWishTitle')}
          </h1>
          <Card className="bg-muted/50 border-dashed w-full max-w-sm min-h-[6rem] flex items-center justify-center">
              <CardContent className="p-3">
                  {isLoading || !placeholderWish ? (
                      <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
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
          <div className="relative flex items-end gap-2">
              <div className="p-2.5 pb-3 text-muted-foreground shrink-0 hidden sm:block">
                  <GradientCloudIcon className="h-6 w-6" />
              </div>
              <Textarea
                  ref={textareaRef}
                  id="message" 
                  placeholder={t('writeOwnOptionPlaceholder')} 
                  rows={1}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 pr-2 py-2.5 max-h-24"
              />
              <Button
                  className="shrink-0"
                  size="icon"
                  onClick={handleNext}
                  disabled={isSendDisabled}
                  aria-label={t('nextButtonLabel')}
              >
                  <Send className="h-5 w-5" />
              </Button>
          </div>
        </div>

        <div className="absolute top-6 left-4">
          <SheetClose asChild>
              <Button variant="outline" size="lg" className="border-primary/50 text-foreground">
                  {t('back')}
              </Button>
          </SheetClose>
        </div>
      </div>
    </>
  );
}
