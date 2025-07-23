
import { LucideIcon, Utensils, Footprints, Dice5, Dumbbell, Landmark, Sparkles } from 'lucide-react';

export const WISH_CATEGORY_KEYS = ['food', 'walk', 'entertainment', 'sport', 'culture', 'other'] as const;

export type WishCategoryKey = typeof WISH_CATEGORY_KEYS[number];

export interface WishCategory {
    name: string;
    icon: LucideIcon;
    color: string;
}

// Using HSL values for easier theme manipulation if needed later
export const WISH_CATEGORIES: Record<WishCategoryKey, WishCategory> = {
    food: { name: 'categoryFood', icon: Utensils, color: 'hsl(45, 100%, 50%)' }, // Acid Yellow
    walk: { name: 'categoryWalk', icon: Footprints, color: 'hsl(90, 100%, 50%)' }, // Lime Green
    entertainment: { name: 'categoryEntertainment', icon: Dice5, color: 'hsl(320, 100%, 55%)' }, // Hot Pink
    sport: { name: 'categorySport', icon: Dumbbell, color: 'hsl(195, 100%, 50%)' }, // Electric Blue
    culture: { name: 'categoryCulture', icon: Landmark, color: 'hsl(270, 100%, 60%)' }, // Vivid Violet
    other: { name: 'categoryOther', icon: Sparkles, color: 'hsl(16, 100%, 60%)' } // Coral
};
