
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
import { GradientBorderCloudIcon } from "../icons/GradientBorderCloudIcon";
import { FullScreenLoader } from "../common/FullScreenLoader";
import { WISHES } from "@/lib/wishes";
import { WISH_CATEGORY_KEYS, type WishCategoryKey } from "@/lib/categories";


export function WantSheet() {
  const [message, setMessage] = useState("");
  const [placeholderWish, setPlaceholderWish] = useState<{text: string, category: WishCategoryKey} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const fetchNewWish = () => {
    setIsLoading(true);
    
    // Select a random category that has wishes
    const availableCategories = WISH_CATEGORY_KEYS.filter(key => WISHES[key] && WISHES[key].length > 0);
    const randomCategoryKey = availableCategories[Math.floor(Math.random() * availableCategories.length)];
    const wishesForCategory = WISHES[randomCategoryKey];
    
    // Select a random wish from that category
    const randomWishText = wishesForCategory[Math.floor(Math.random() * wishesForCategory.length)];

    setPlaceholderWish({ text: randomWishText, category: randomCategoryKey });

    // Simulate loading to avoid flash of content
    setTimeout(() => setIsLoading(false), 200); 
  };

  useEffect(() => {
    fetchNewWish();
  }, []); 


  const handleNext = () => {
    if (!message) return;
    // Automatically prepend "Я хочу " if it's not already there
    const finalMessage = message.trim().toLowerCase().startsWith('я хочу') 
      ? message.trim()
      : `Я хочу ${message.trim()}`;
      
    const encodedMessage = encodeURIComponent(finalMessage);
    router.push(`/want/categorize?message=${encodedMessage}`);
  };

  const handleSelectWish = () => {
      if (isLoading || !placeholderWish) return;
      const wishToPublish = `Я хочу ${placeholderWish.text}`;
      const encodedMessage = encodeURIComponent(wishToPublish);
      router.push(`/want/categorize?message=${encodedMessage}&category=${placeholderWish.category}`);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent new line on Enter
      if (message) {
        handleNext();
      }
    }
  };

  const isSendDisabled = message.trim() === '';

  return (
    <>
      {isLoading && <FullScreenLoader text="Придумываем желание..." />}
      <div className="flex flex-col h-full bg-background">
        <SheetHeader>
          <SheetTitle className="sr-only">Сформулируйте ваше желание</SheetTitle>
        </SheetHeader>
        <div className="p-4 flex-grow flex flex-col justify-center items-center text-center">
          <h1 className="text-3xl font-bold font-headline text-primary mb-4">
              Выберите желание
          </h1>
          <Card className="bg-muted/50 border-dashed w-full max-w-sm min-h-[6rem] flex items-center justify-center">
              <CardContent className="p-3">
                  {isLoading || !placeholderWish ? (
                      <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                  ) : (
                      <p className="text-muted-foreground">Я хочу {placeholderWish.text}</p>
                  )}
              </CardContent>
          </Card>
          <div className="mt-2 flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSelectWish} disabled={isLoading}>
                  <Check className="mr-2 h-4 w-4"/>
                  Выбрать
              </Button>
              <Button variant="ghost" size="sm" onClick={fetchNewWish} className="text-muted-foreground" disabled={isLoading}>
                  <Shuffle className="mr-2 h-4 w-4"/>
                  Другой вариант
              </Button>
          </div>
        </div>


        <div className="p-4 border-t bg-background mt-auto">
          <div 
            className={cn(
              "relative rounded-xl p-px",
              "before:absolute before:-z-10 before:inset-0 before:rounded-xl before:bg-[linear-gradient(135deg,var(--tw-gradient-stops))] before:from-primary before:to-secondary",
              "after:absolute after:-z-20 after:inset-0 after:rounded-xl after:bg-[linear-gradient(135deg,var(--tw-gradient-stops))] after:from-primary after:to-secondary after:blur-md after:transition-opacity after:duration-500 after:opacity-0",
              "has-[textarea:focus]:after:opacity-50"
            )}
          >
            <div className="relative flex items-start gap-2 rounded-[11px] bg-muted/90 p-1">
                <div className="p-2.5 pt-3 text-muted-foreground shrink-0">
                    <GradientBorderCloudIcon className="h-5 w-5" />
                </div>
                <Textarea
                    ref={textareaRef}
                    id="message" 
                    placeholder="...или напишите свой вариант" 
                    rows={1}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 pr-2 py-2.5 max-h-24 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <button 
                    className={cn(
                        "p-2.5 transition-colors shrink-0 self-end -mb-0.5",
                        isSendDisabled ? "text-muted-foreground" : "text-primary active:text-accent"
                    )}
                    onClick={handleNext}
                    disabled={isSendDisabled}
                    aria-label="Далее"
                >
                    <Send className="h-5 w-5 -rotate-12" />
                </button>
            </div>
          </div>
        </div>

        <div className="absolute top-6 left-4">
          <SheetClose asChild>
              <Button variant="outline" size="lg" className="border-primary/50 text-foreground">
                  Назад
              </Button>
          </SheetClose>
        </div>
      </div>
    </>
  );
}
