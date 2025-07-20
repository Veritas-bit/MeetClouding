import type { LucideIcon } from 'lucide-react';
import { ToyBrick, Utensils, Film, Ticket, Plane, ShoppingCart, Beer, Coffee, Dumbbell, Palette, Music, BookOpen, HelpingHand } from 'lucide-react';

export type WishCategory = {
    name: string;
    icon: LucideIcon;
    color: string;
};

export const WISH_CATEGORIES = {
    food: { name: 'Поесть', icon: Utensils, color: '#ff6347' },
    cinema: { name: 'В кино', icon: Film, color: '#4682b4' },
    event: { name: 'На концерт', icon: Ticket, color: '#32cd32' },
    travel: { name: 'В поездку', icon: Plane, color: '#1e90ff' },
    shopping: { name: 'Шопинг', icon: ShoppingCart, color: '#ff69b4' },
    bar: { name: 'В бар', icon: Beer, color: '#ffd700' },
    coffee: { name: 'На кофе', icon: Coffee, color: '#a0522d' },
    sport: { name: 'Спорт', icon: Dumbbell, color: '#ff4500' },
    art: { name: 'Творчество', icon: Palette, color: '#9932cc' },
    music: { name: 'Музыка', icon: Music, color: '#da70d6' },
    books: { name: 'Книги', icon: BookOpen, color: '#8b4513' },
    other: { name: 'Другое', icon: HelpingHand, color: '#708090' },
};

export type WishCategoryKey = keyof typeof WISH_CATEGORIES;
