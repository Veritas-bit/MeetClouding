
import type { WishCategoryKey } from './categories';

const keywordMap: Record<WishCategoryKey, string[]> = {
    food: ['еда', 'кофе', 'ресторан', 'кафе', 'поесть', 'ужин', 'обед', 'завтрак', 'пицца', 'суши', 'бургер', 'выпить', 'бар'],
    walk: ['прогулка', 'гулять', 'парк', 'набережная', 'сквер', 'погулять', 'пройтись'],
    entertainment: ['развлечения', 'кино', 'фильм', 'концерт', 'боулинг', 'квест', 'антикафе', 'настолки'],
    sport: ['спорт', 'велосипед', 'ролики', 'коньки', 'пробежка', 'тренировка', 'футбол', 'баскетбол', 'йога', 'скалолазание'],
    culture: ['культура', 'музей', 'выставка', 'театр', 'галерея', 'экскурсия', 'искусство', 'лекция', 'планетарий'],
    other: [], // 'other' is a fallback, so it doesn't need keywords
};

export function categorizeWishByKeywords(wish: string): WishCategoryKey {
    const lowerCaseWish = wish.toLowerCase();

    for (const [category, keywords] of Object.entries(keywordMap)) {
        if (category === 'other') continue;

        for (const keyword of keywords) {
            if (lowerCaseWish.includes(keyword)) {
                return category as WishCategoryKey;
            }
        }
    }

    return 'other';
}
