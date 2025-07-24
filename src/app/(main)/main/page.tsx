
"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import dynamic from "next/dynamic";
import { useTranslation } from "@/hooks/use-translation";
import { FullScreenLoader } from "@/components/common/FullScreenLoader";

// Lazy load the sheet components
const WantSheet = dynamic(() => import('@/components/want/WantSheet').then(mod => mod.WantSheet), {
  loading: () => <FullScreenLoader />,
  ssr: false
});
const SearchSheet = dynamic(() => import('@/components/search/SearchSheet').then(mod => mod.SearchSheet), {
  loading: () => <FullScreenLoader />,
  ssr: false
});


export default function MainPage() {
  const t = useTranslation();

  return (
    <div className="h-full flex flex-col justify-center items-center p-4">
      <div className="relative flex flex-col items-center justify-center text-center text-foreground">
        
        <p className="text-[1.1rem] font-headline mb-4 max-w-md text-foreground">
            {t('mainPageSlogan')}
        </p>

        <div className="flex flex-col gap-6 items-center">
            <div className="p-1 rounded-lg bg-[linear-gradient(135deg,var(--tw-gradient-stops))] from-primary to-secondary">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button className="w-72 h-12 text-xl font-bold rounded-md uppercase bg-background text-foreground hover:bg-background/90">
                        СОЗДАТЬ ОБЛАЧКО
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-svh p-0" hideCloseButton>
                        <SheetHeader>
                            <SheetTitle className="sr-only">{t('createWishTitle')}</SheetTitle>
                        </SheetHeader>
                        <WantSheet />
                    </SheetContent>
                </Sheet>
            </div>
            <Sheet>
                <SheetTrigger asChild>
                <button className="text-xl uppercase font-bold bg-clip-text text-transparent bg-[linear-gradient(135deg,var(--tw-gradient-stops))] from-primary to-secondary active:opacity-80 transition-opacity">
                    НАЙТИ ОБЛАЧКО
                </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-svh p-0" hideCloseButton>
                    <SheetHeader>
                        <SheetTitle className="sr-only">{t('searchTitle')}</SheetTitle>
                    </SheetHeader>
                    <SearchSheet />
                </SheetContent>
            </Sheet>
        </div>
        
    </div>
    </div>
  );
}
