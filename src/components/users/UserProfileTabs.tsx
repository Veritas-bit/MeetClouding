
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface Photo {
    src: string;
    alt: string;
    hint: string;
}

interface UserProfileTabsProps {
    photos: Photo[];
}

export function UserProfileTabs({ photos }: UserProfileTabsProps) {
    return (
        <Card className="bg-card/50">
            <CardHeader className="px-3 pt-2 pb-2">
                <CardTitle className="text-sm font-semibold">Медиатека</CardTitle>
            </CardHeader>
            <CardContent className="px-1 pb-1">
                <Tabs defaultValue="photos" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 h-auto">
                        <TabsTrigger value="photos" className="text-xs">Фото</TabsTrigger>
                        <TabsTrigger value="videos" className="text-xs">Видео</TabsTrigger>
                        <TabsTrigger value="audio" className="text-xs">Голосовые</TabsTrigger>
                        <TabsTrigger value="links" className="text-xs">Ссылки</TabsTrigger>
                    </TabsList>
                    <TabsContent value="photos" className="mt-2">
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2 p-2">
                            {photos.map((photo, index) => (
                                <div key={index} className="relative aspect-square w-full">
                                    <Image 
                                        src={photo.src} 
                                        alt={photo.alt} 
                                        fill
                                        sizes="(max-width: 768px) 50vw, 33vw"
                                        className="rounded-md object-cover" 
                                        data-ai-hint={photo.hint} 
                                    />
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="videos">
                        <div className="text-center p-8 text-muted-foreground text-sm">
                            Здесь будут видео из чата.
                        </div>
                    </TabsContent>
                    <TabsContent value="audio">
                        <div className="text-center p-8 text-muted-foreground text-sm">
                            Здесь будут голосовые сообщения из чата.
                        </div>
                    </TabsContent>
                    <TabsContent value="links">
                        <div className="text-center p-8 text-muted-foreground text-sm">
                            Здесь будут ссылки из чата.
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
