import {Article, BackendArticle} from '@/types';

/**
 * Преобразует статью из формата бэкенда в формат фронтенда
 */
export const transformBackendArticle = (backendArticle: BackendArticle): Article => {
    // Функция для конвертации LocalDateTime в строку ISO
    const formatDate = (dateString?: string): string => {
        if (!dateString) {
            return new Date().toISOString();
        }

        // Если дата уже в правильном формате ISO, возвращаем как есть
        if (dateString.includes('T')) {
            return dateString;
        }

        // Если дата в формате yyyy-MM-dd, добавляем время
        return `${dateString}T00:00:00Z`;
    };

    return {
        id: backendArticle.id?.toString() || '',
        title: backendArticle.title || 'No title',
        content: backendArticle.content || '',
        // Теперь используем правильные поля из бэкенда (snake_case)
        image_url: backendArticle.image_url || '/placeholder-article.jpg',
        published_at: formatDate(backendArticle.published_at),
        read_count: backendArticle.read_count || 0,
        tags: backendArticle.tags || [],
        author: backendArticle.author || 'KeykoMI'
    };
};

/**
 * Преобразует массив статей из формата бэкенда в формат фронтенда
 */
export const transformBackendArticles = (backendArticles: BackendArticle[]): Article[] => {
    return backendArticles.map(transformBackendArticle);
};