
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useRef, type ChangeEvent, useState } from 'react';

interface GalleryImage {
    id: string;
    src: string;
    alt: string;
    hint: string;
}

export default function GalleryPage() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [images, setImages] = useState<GalleryImage[]>(
        Array.from({ length: 25 }).map((_, index) => ({
            id: `placeholder-${index}`,
            src: `https://placehold.co/200x200.png`,
            alt: `Placeholder image ${index + 1}`,
            hint: "gallery photo"
        }))
    );

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    const newImage: GalleryImage = {
                        id: `uploaded-${Date.now()}`,
                        src: e.target.result as string,
                        alt: file.name,
                        hint: 'uploaded photo'
                    };
                    setImages(prevImages => [newImage, ...prevImages]);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="px-[2%] pt-[2%] pb-4 h-full flex flex-col gap-4">
            <div className="flex-grow h-full w-full rounded-lg border-2 border-dashed border-muted-foreground/50 bg-muted/20 p-4 overflow-y-auto hide-scrollbar">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {images.map((image) => (
                        <div key={image.id} className="relative aspect-square w-full">
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                className="rounded-md object-cover"
                                data-ai-hint={image.hint}
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
                    accept="image/*"
                />
                <Button className="w-full" size="lg" onClick={handleUploadClick}>
                    <Upload className="mr-2 h-4 w-4" />
                    Загрузить фотографию
                </Button>
            </div>
        </div>
    );
}
