
"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import dynamic from "next/dynamic";
import { LoaderCircle } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

// Lazy load the sheet components
const WantSheet = dynamic(() => import('@/components/want/WantSheet').then(mod => mod.WantSheet), {
  loading: () => <div className="h-full flex justify-center items-center"><LoaderCircle className="animate-spin" /></div>,
  ssr: false
});
const SearchSheet = dynamic(() => import('@/components/search/SearchSheet').then(mod => mod.SearchSheet), {
  loading: () => <div className="h-full flex justify-center items-center"><LoaderCircle className="animate-spin" /></div>,
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
        <Sheet>
            <SheetTrigger asChild>
                <Button className="w-72 h-12 text-xl font-bold rounded-lg uppercase bg-[linear-gradient(135deg,var(--tw-gradient-stops))] from-primary to-secondary text-primary-foreground">
                {t('findCompanyButton')}
                </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-svh p-0" hideCloseButton>
                <SheetHeader>
                    <SheetTitle className="sr-only">{t('createWishTitle')}</SheetTitle>
                </SheetHeader>
                <WantSheet />
            </SheetContent>
        </Sheet>
        <Sheet>
            <SheetTrigger asChild>
            <button className="text-xl uppercase font-bold text-primary active:text-accent transition-colors">
                {t('searchWishesButton')}
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
