import { WISH_CATEGORIES, WishCategoryKey } from './categories';

// This is a simple keyword-based categorization.
// In a real app, this could be replaced with a more sophisticated NLP model or a Genkit flow.
const categoryKeywords: Record<WishCategoryKey, string[]> = {
    food: ['ресторан', 'кафе', 'поесть', 'суши', 'пицца', 'бургер'],
    cinema: ['кино', 'фильм', 'сеанс', 'кинотеатр'],
    event: ['концерт', 'фестиваль', 'шоу', 'выставка', 'стендап'],
    travel: ['поездка', 'путешествие', 'в другой город', 'за границу'],
    shopping: ['шопинг', 'по магазинам', 'купить', 'торговый центр'],
    bar: ['бар', 'паб', 'пиво', 'коктейли', 'выпить'],
    coffee: ['кофе', 'кофейня', 'эспрессо', 'капучино'],
    sport: ['спорт', 'тренировка', 'пробежка', 'футбол', 'баскетбол', 'йога'],
    art: ['рисовать', 'творчество', 'выставка', 'галерея', 'музей'],
    music: ['музыка', 'инструмент', 'играть', 'петь'],
    books: ['книга', 'читать', 'библиотека', 'книжный'],
    other: [],
};

export function categorizeWishByKeywords(message: string): WishCategoryKey {
    const lowerCaseMessage = message.toLowerCase();
    for (const key in categoryKeywords) {
        const categoryKey = key as Wish-CategoryKey;
        const keywords = categoryKeywords[categoryKey];
        if (keywords.some(keyword => lowerCaseMessage.includes(keyword))) {
            return categoryKey;
        }
    }
    return 'other';
}
