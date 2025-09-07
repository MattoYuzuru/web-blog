import {Article, BackendArticle} from '@/types';

/**
 * Преобразует статью из формата бэкенда в формат фронтенда
 */
export const transformBackendArticle = (backendArticle: BackendArticle): Article => ({
    id: backendArticle.id?.toString() || '',
    title: backendArticle.title || 'No title',
    content: backendArticle.content || '',
    image_url: backendArticle.imageUrl || '/placeholder-article.jpg',
    published_at: backendArticle.publishedAt || new Date().toISOString().split('T')[0],
    read_count: backendArticle.readCount || 0,
    tags: backendArticle.tags || [],
    author: backendArticle.author || 'KeykoMI'
});

/**
 * Преобразует массив статей из формата бэкенда в формат фронтенда
 */
export const transformBackendArticles = (backendArticles: BackendArticle[]): Article[] => {
    return backendArticles.map(transformBackendArticle);
};