

"use client";

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { useLocationStore } from "@/lib/location-store";
import { WISH_CATEGORIES, WishCategoryKey } from '@/lib/categories';
import { categorizeWishByKeywords } from '@/lib/categorize';
import { cn } from "@/lib/utils";
import { useToast } from '@/hooks/use-toast';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';
import { useProfileStore } from '@/lib/profile-store';
import { useTranslation } from '@/hooks/use-translation';
import { GradientBorderCloudIcon } from '@/components/icons/GradientBorderCloudIcon';

function CategorizeWishForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { location, error, requestLocation } = useLocationStore();
    const { toast } = useToast();
    const { isPremium } = useProfileStore();
    const t = useTranslation();

    const [message, setMessage] = useState('');
    const [isPublishing, setIsPublishing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<WishCategoryKey | null>(null);

    useEffect(() => {
        // Ensure location is requested when component mounts
        requestLocation();
    }, [requestLocation]);
    
    useEffect(() => {
        const messageParam = searchParams.get('message');
        if (!messageParam) {
            return;
        }

        const decodedMessage = decodeURIComponent(messageParam);
        setMessage(decodedMessage);
        
        let categoryToSet: WishCategoryKey;

        if (isPremium) {
            const categoryParam = searchParams.get('category') as WishCategoryKey | null;
            // If premium, use passed category or categorize custom wish
            if (categoryParam && WISH_CATEGORIES[categoryParam]) {
                categoryToSet = categoryParam;
            } else {
                categoryToSet = categorizeWishByKeywords(decodedMessage);
            }
        } else {
            // If not premium, always default to 'other'
            categoryToSet = 'other';
        }

        setSelectedCategory(categoryToSet);

    }, [searchParams, isPremium]);

    const handlePublish = async () => {
        if (!message || !selectedCategory) return;
        setIsPublishing(true);

        const locationPromise = new Promise<Coordinates>((resolve, reject) => {
            if (location) {
                resolve({latitude: location.latitude, longitude: location.longitude});
                return;
            }

            const timeout = 10000; // 10 seconds timeout
            const interval = 200; // check every 200ms
            let elapsedTime = 0;

            const intervalId = setInterval(() => {
                const currentLoc = useLocationStore.getState().location;
                const currentError = useLocationStore.getState().error;
                
                if (currentLoc) {
                    clearInterval(intervalId);
                    resolve({latitude: currentLoc.latitude, longitude: currentLoc.longitude});
                } else if (currentError) {
                    clearInterval(intervalId);
                    reject(currentError);
                } else if (elapsedTime >= timeout) {
                    clearInterval(intervalId);
                    reject(new Error("Location request timed out."));
                }
                elapsedTime += interval;
            }, interval);
        });

        try {
            const coords = await locationPromise;
            const categoryInfo = WISH_CATEGORIES[selectedCategory!];
            const encodedMessage = encodeURIComponent(message);
            const encodedCategoryName = encodeURIComponent(t(categoryInfo.name as any));
            const color = categoryInfo.color;
            const categoryKey = selectedCategory;
            
            router.push(`/map?published=true&message=${encodedMessage}&lat=${coords.latitude}&lon=${coords.longitude}&categoryName=${encodedCategoryName}&color=${color}&categoryKey=${categoryKey}`);

        } catch (err) {
            toast({
                variant: "destructive",
                title: t('locationErrorTitle'),
                description: t('locationErrorDescription'),
            });
        } finally {
            setIsPublishing(false);
        }
    };
    
    // Helper type
    type Coordinates = { latitude: number; longitude: number };


    if (!message) {
         return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <p className="text-muted-foreground">{t('noWishFound')}</p>
            </div>
        );
    }
    
    return (
        <div className="flex-grow flex flex-col items-center p-4 py-2">
            <div className="w-full max-w-lg">
                <Card>
                    <CardContent className="p-3">
                        <div className="grid w-full gap-3">
                            <div className="p-3 border rounded-lg bg-muted/50">
                                <Label>{t('yourWishLabel')}:</Label>
                                <p className="text-sm text-muted-foreground italic mt-1">"{message}"</p>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {Object.entries(WISH_CATEGORIES).map(([key, cat]) => {
                                    const isSelected = selectedCategory === key;
                                    const isDisabled = !isPremium;

                                    return (
                                        <Button
                                            key={key}
                                            variant={isSelected ? 'default' : 'outline'}
                                            onClick={() => setSelectedCategory(key as WishCategoryKey)}
                                            className={cn(
                                                "h-16 flex flex-col gap-1 relative transition-all",
                                                isDisabled && !isSelected && "blur-sm pointer-events-none"
                                            )}
                                            disabled={isDisabled && !isSelected}
                                            style={{
                                                '--category-color': cat.color,
                                                borderColor: isSelected ? cat.color : 'hsl(var(--border))',
                                                color: isSelected ? 'hsl(var(--primary-foreground))' : cat.color,
                                                backgroundColor: isSelected ? cat.color : 'transparent',
                                            } as React.CSSProperties}
                                        >
                                            <cat.icon className="h-5 w-5" />
                                            <span className="text-xs">{t(cat.name as any)}</span>
                                        </Button>
                                    )
                                })}
                            </div>
                            {!isPremium && (
                                <Link href="/settings/premium?from=categorize" className="w-full">
                                    <Button variant="secondary" className="w-full">
                                        {t('unlockWithPremium')}
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="p-3">
                        <Button className="w-full" onClick={handlePublish} disabled={isPublishing || !selectedCategory}>
                            {isPublishing && <GradientBorderCloudIcon className="mr-2 h-4 w-4" />}
                            {isPublishing ? t('publishingWish') : t('publishOnMap')}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}


export default function CategorizePage() {
    return (
        <Suspense fallback={<FullScreenLoader text="Загрузка..." />}>
            <CategorizeWishForm />
        </Suspense>
    )
}
