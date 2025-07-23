
"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function GalleryPage() {
    const params = useParams();
    const chatId = params.id;

    // Mock gallery items
    const galleryItems = Array.from({ length: 25 });
    const hasItems = galleryItems.length > 0;

    return (
        <div className="flex flex-col h-full bg-background p-4 pt-0">
            {/* Gallery Container */}
            <div className="flex-grow relative rounded-lg p-px bg-gradient-to-r from-primary/20 to-secondary/20">
                <div className="relative bg-black/50 rounded-[7px] h-full p-2">
                    {/* Upload Button */}
                    <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-4 left-4 z-10 h-10 w-10 rounded-full shadow-lg"
                    >
                        <Upload className="h-5 w-5" />
                        <span className="sr-only">Upload</span>
                    </Button>

                    <ScrollArea className="h-full">
                        {hasItems ? (
                             <div className="p-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                                {galleryItems.map((_, index) => (
                                    <div key={index} className="relative aspect-square w-full">
                                        <Image
                                            src={`https://placehold.co/200x200.png?text=img_${index}`}
                                            alt={`Gallery item ${index + 1}`}
                                            fill
                                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                            className="rounded-md object-cover"
                                            data-ai-hint="placeholder image"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full">
                                <p>Ваша галерея пуста.</p>
                                <p className="text-sm">Загрузите фото или видео, чтобы они появились здесь.</p>
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </div>

            {/* Bottom Action Bar */}
             <div className="flex-shrink-0 pt-4">
                <Button className="w-full" size="lg" disabled={!hasItems}>
                    Отправить выбранное
                </Button>
            </div>
        </div>
    );
}
