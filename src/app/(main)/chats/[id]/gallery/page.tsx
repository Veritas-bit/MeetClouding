
import Image from 'next/image';

export default function GalleryPage() {
    return (
        <div className="px-[2%] pt-[2%] pb-[10%] h-full">
            <div className="h-full w-full rounded-lg border-2 border-dashed border-muted-foreground/50 bg-muted/20 p-4 overflow-y-auto">
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
        </div>
    );
}
