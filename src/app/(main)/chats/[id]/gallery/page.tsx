
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useRef, type ChangeEvent } from 'react';

export default function GalleryPage() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log("Выбран файл:", file.name);
            // Здесь будет логика загрузки и отображения файла
        }
    };

    return (
        <div className="px-[2%] pt-[2%] pb-4 h-full flex flex-col gap-4">
            <div className="flex-grow h-full w-full rounded-lg border-2 border-dashed border-muted-foreground/50 bg-muted/20 p-4 overflow-y-auto hide-scrollbar">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 25 }).map((_, index) => (
                        <div key={index} className="relative aspect-square w-full">
                            <Image
                                src={`https://placehold.co/200x200.png`}
                                alt={`Placeholder image ${index + 1}`}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                className="rounded-md object-cover"
                                data-ai-hint="gallery photo"
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-shrink-0">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,video/*"
                />
                <Button className="w-full" size="lg" onClick={handleUploadClick}>
                    <Upload className="mr-2 h-4 w-4" />
                    Загрузить фотографию
                </Button>
            </div>
        </div>
    );
}
