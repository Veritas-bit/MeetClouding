
"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { Upload } from "lucide-react";

interface ChatAttachmentModalProps {
    onClose: () => void;
    onMediaSend: (media: { src: string; type: 'image' | 'video' }, source: 'camera' | 'gallery') => void;
}

export function ChatAttachmentModal({ onClose, onMediaSend }: ChatAttachmentModalProps) {
    // Mock gallery items
    const galleryItems = Array.from({ length: 25 });
    const hasItems = galleryItems.length > 0;

    return (
       <></>
    );
}

