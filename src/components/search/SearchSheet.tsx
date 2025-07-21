
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WISH_CATEGORIES, WishCategoryKey } from "@/lib/categories";
import { SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { useProfileStore } from "@/lib/profile-store";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";

type Gender = "male" | "female" | "any";

export function SearchSheet() {
  const [category, setCategory] = useState<WishCategoryKey | null>(null);
  const [radius, setRadius] = useState<string>("1");
  const [gender, setGender] = useState<Gender>("any");
  const router = useRouter();
  const { isPremium } = useProfileStore();
  const t = useTranslation();

  const handleSearch = () => {
    const categoryParam = isPremium && category ? `&category=${category}` : '';
    const genderParam = isPremium ? `&gender=${gender}` : '';
    router.push(`/map?search=true&radius=${radius}${categoryParam}${genderParam}`);
  };

  return (
    <div className="flex flex-col h-full bg-background">
       <SheetHeader>
          <SheetTitle className="sr-only">{t('searchTitle')}</SheetTitle>
        </SheetHeader>
       <div className="p-4 flex-grow flex flex-col justify-center items-center text-center">
            <div className="w-full max-w-sm space-y-6">
                <div className="flex flex-col space-y-1.5 text-left">
                    <Label htmlFor="category" className={cn(!isPremium && "text-muted-foreground/70")}>{t('categoryLabel')}</Label>
                    <Select onValueChange={(value) => setCategory(value as WishCategoryKey)} disabled={!isPremium}>
                    <SelectTrigger id="category">
                        <SelectValue placeholder={t('allCategoriesPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent position="popper">
                        {Object.entries(WISH_CATEGORIES).map(([key, cat]) => (
                            <SelectItem key={key} value={key}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col space-y-1.5 text-left">
                    <Label htmlFor="gender" className={cn(!isPremium && "text-muted-foreground/70")}>{t('genderLabel')}</Label>
                    <Select value={gender} onValueChange={(value) => setGender(value as Gender)} disabled={!isPremium}>
                    <SelectTrigger id="gender">
                        <SelectValue placeholder={t('selectGenderPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent position="popper">
                        <SelectItem value="any">{t('anyGender')}</SelectItem>
                        <SelectItem value="male">{t('genderMaleLabel')}</SelectItem>
                        <SelectItem value="female">{t('genderFemaleLabel')}</SelectItem>
                    </SelectContent>
                    </Select>
                </div>

                {!isPremium && (
                  <Link href="/settings/premium" className="w-full">
                      <Button variant="secondary" className="w-full text-xs">
                          {t('filtersWithPremium')}
                      </Button>
                  </Link>
                )}


                <div className="flex flex-col space-y-1.5 text-left">
                    <Label htmlFor="radius">{t('searchRadiusLabel')}</Label>
                    <Select value={radius} onValueChange={setRadius}>
                    <SelectTrigger id="radius">
                        <SelectValue placeholder={t('selectRadiusPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent position="popper">
                        <SelectItem value="0.1">{t('radiusOption1')}</SelectItem>
                        <SelectItem value="0.5">{t('radiusOption2')}</SelectItem>
                        <SelectItem value="1">{t('radiusOption3')}</SelectItem>
                        <SelectItem value="5">{t('radiusOption4')}</SelectItem>
                    </SelectContent>
                    </Select>
                </div>

                <Button className="w-full" size="lg" onClick={handleSearch}>{t('showOnMapButton')}</Button>
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
  );
}
