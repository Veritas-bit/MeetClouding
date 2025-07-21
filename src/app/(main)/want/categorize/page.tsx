
"use client";

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, LoaderCircle, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { useLocationStore } from "@/lib/location-store";
import { WISH_CATEGORIES, WishCategoryKey } from '@/lib/categories';
import { categorizeWishByKeywords } from '@/lib/categorize';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';
import { useProfileStore } from '@/lib/profile-store';

function CategorizeWishForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { latitude, longitude, error, requestLocation } = useLocationStore();
    const { toast } = useToast();
    const { isPremium } = useProfileStore();

    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isPublishing, setIsPublishing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<WishCategoryKey | null>(null);

    useEffect(() => {
        // Ensure location is requested when component mounts
        requestLocation();
    }, [requestLocation]);
    
    useEffect(() => {
        const messageParam = searchParams.get('message');
        if (!messageParam) {
            setIsLoading(false);
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
        setIsLoading(false);

    }, [searchParams, isPremium]);

    const handlePublish = () => {
        setIsPublishing(true);
        // Retry logic to wait for location
        const waitForLocation = (retries = 5, delay = 500) => {
            if (latitude !== null && longitude !== null) {
                const categoryInfo = WISH_CATEGORIES[selectedCategory!];
                const encodedMessage = encodeURIComponent(message);
                const encodedCategoryName = encodeURIComponent(categoryInfo.name);
                const color = categoryInfo.color;

                router.push(`/map?published=true&message=${encodedMessage}&lat=${latitude}&lon=${longitude}&categoryName=${encodedCategoryName}&color=${color}`);
                return;
            }

            if (retries > 0) {
                setTimeout(() => waitForLocation(retries - 1, delay), delay);
            } else {
                toast({
                    variant: "destructive",
                    title: "Не удалось определить местоположение",
                    description: "Пожалуйста, проверьте настройки геолокации и попробуйте снова.",
                });
                setIsPublishing(false);
            }
        };

        if (!message || !selectedCategory) return;
        
        waitForLocation();
    };

    if (isLoading) {
      return <FullScreenLoader text="Подбираем категорию..." />;
    }

    if (!message) {
         return (
            <div className="flex h-screen w-full items-center justify-center bg-background">
                <p className="text-muted-foreground">Не найдено сообщение для категоризации.</p>
            </div>
        );
    }
    
    return (
        <div className="flex-grow flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-lg">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline">
                            <LayoutGrid className="h-6 w-6 text-primary" />
                            Выберите категорию
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid w-full gap-4">
                            <div className="p-4 border rounded-lg bg-muted/50">
                                <Label>Ваше желание:</Label>
                                <p className="text-sm text-muted-foreground italic mt-1">"{message}"</p>
                            </div>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                                                borderColor: isSelected ? 'hsl(var(--primary))' : cat.color,
                                                color: isSelected ? 'hsl(var(--primary-foreground))' : cat.color,
                                                backgroundColor: isSelected ? 'hsl(var(--primary))' : 'transparent',
                                            } as React.CSSProperties}
                                        >
                                            <cat.icon className="h-5 w-5" />
                                            <span className="text-xs">{cat.name}</span>
                                        </Button>
                                    )
                                })}
                            </div>
                            {!isPremium && (
                                <Link href="/settings/premium" className="w-full">
                                    <Button variant="secondary" className="w-full">
                                        Разблокировать с Премиум
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={handlePublish} disabled={isPublishing || !selectedCategory}>
                            {isPublishing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            {isPublishing ? 'Определяем место...' : 'Опубликовать на карте'}
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
