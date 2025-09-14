'use client';

import {useState, useEffect, useRef, useCallback} from 'react';
import {useParams} from 'next/navigation';
import Image from 'next/image';
import {Calendar, Eye, ArrowLeft, Loader2} from 'lucide-react';
import Link from 'next/link';
import {Article, BackendArticle} from '@/types';
import {apiClient} from '@/lib/api';
import {formatDate, formatReadCount} from '@/lib/utils';
import ArticleContent from '@/components/ArticleContent';

export default function ArticlePage() {
    const params = useParams();
    const articleId = params.id as string;
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Для отслеживания прочтения
    const startTimeRef = useRef<number>(0);
    const hasScrolledToEndRef = useRef<boolean>(false);
    const hasSpentMinuteRef = useRef<boolean>(false);
    const hasIncrementedRef = useRef<boolean>(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Функция для преобразования данных бэкенда в формат фронтенда
    const transformBackendArticle = (backendArticle: BackendArticle): Article => ({
        id: backendArticle.id?.toString() || '',
        title: backendArticle.title || 'No title',
        content: backendArticle.content || '',
        image_url: backendArticle.image_url || '/placeholder-article.jpg',
        published_at: backendArticle.published_at || new Date().toISOString(),
        read_count: backendArticle.read_count || 0,
        tags: backendArticle.tags || [],
        author: backendArticle.author || 'KeykoMI'
    });

    // Проверка условий для инкремента счетчика
    const checkReadingConditions = useCallback(async () => {
        if (hasIncrementedRef.current || !article) return;

        const hasScrolled = hasScrolledToEndRef.current;
        const hasSpentTime = hasSpentMinuteRef.current;

        if (hasScrolled && hasSpentTime) {
            const sessionKey = `read_${articleId}`;

            if (sessionStorage.getItem(sessionKey)) {
                return;
            }

            try {
                const response = await apiClient.incrementReadCount(articleId);
                if (response.success) {
                    // Обновляем локальный счетчик
                    setArticle(prev => prev ? {
                        ...prev,
                        read_count: response.data.readCount // Используем значение из ответа сервера
                    } : null);

                    sessionStorage.setItem(sessionKey, 'true');
                    hasIncrementedRef.current = true;

                    console.log('Read count incremented successfully to:', response.data.readCount);
                }
            } catch (error) {
                console.error('Failed to increment read count:', error);
            }
        }
    }, [articleId, article]);

    // Обработчик скролла
    const handleScroll = useCallback(() => {
        if (hasScrolledToEndRef.current) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Считаем, что пользователь дочитал до конца, если осталось менее 100px
        const scrolledToEnd = scrollTop + windowHeight >= documentHeight - 100;

        if (scrolledToEnd) {
            hasScrolledToEndRef.current = true;
            console.log('User scrolled to end');
            checkReadingConditions();
        }
    }, [checkReadingConditions]);

    // Обработчик времени чтения
    const startReadingTimer = useCallback(() => {
        timeoutRef.current = setTimeout(() => {
            hasSpentMinuteRef.current = true;
            console.log('User spent 1 minute reading');
            checkReadingConditions();
        }, 60000); // 60 секунд = 1 минута
    }, [checkReadingConditions]);

    useEffect(() => {
        if (articleId) {
            loadArticle();
        }
    }, [articleId]);

    useEffect(() => {
        if (article && !loading) {
            // Запускаем отслеживание только после загрузки статьи
            startTimeRef.current = Date.now();

            // Проверяем, не была ли статья уже прочитана в этой сессии
            const sessionKey = `read_${articleId}`;
            if (sessionStorage.getItem(sessionKey)) {
                hasIncrementedRef.current = true;
                return;
            }

            // Добавляем обработчик скролла
            window.addEventListener('scroll', handleScroll, { passive: true });

            // Запускаем таймер
            startReadingTimer();

            return () => {
                window.removeEventListener('scroll', handleScroll);
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
            };
        }
    }, [article, loading, articleId, handleScroll, startReadingTimer]);

    const loadArticle = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await apiClient.getArticle(articleId);
            if (response.success) {
                // Преобразуем данные бэкенда в формат фронтенда
                const transformedArticle = transformBackendArticle(response.data);
                setArticle(transformedArticle);
            } else {
                setError('Article not found');
            }
        } catch (error) {
            console.error('Failed to load article:', error);
            setError('Failed to load article');
            // Моки
            setArticle({
                id: articleId,
                title: 'Зачем вести отдельный сайт для блога если есть Телеграм?',
                content: `# Введение

Текст 

## Блок 2

### Текст 1
Текст

### Текст 2
Текст

### Текст 3
Текст

## Блок 3
Текст
> Текст
> Текст
> Текст

## Блок 4

Конец`,
                image_url: '/placeholder-article.jpg',
                published_at: '2025-08-10T10:00:00Z',
                read_count: 1,
                tags: ['thoughts'],
                author: 'KeykoMI'
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-violet-600"/>
                <span className="ml-2 text-gray-600 dark:text-gray-400">Загрузка статьи...</span>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        Статья не найдена
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Статья, которую вы ищите, не существует или была удалена.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center space-x-2 text-violet-600 hover:text-violet-700 font-medium"
                    >
                        <ArrowLeft className="h-4 w-4"/>
                        <span>Вернуться на Главную</span>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back button */}
            <Link
                href="/"
                className="inline-flex items-center space-x-2 text-violet-600 hover:text-violet-700 font-medium mb-8"
            >
                <ArrowLeft className="h-4 w-4"/>
                <span>Back to Articles</span>
            </Link>

            {/* Article Header */}
            <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                {/* Featured Image */}
                <div className="relative h-64 md:h-80">
                    <Image
                        src={article.image_url || '/placeholder-article.jpg'}
                        alt={article.title}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Article Info */}
                <div className="p-6 md:p-8">
                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                        {article.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-6 mb-6 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4"/>
                            <span>{formatDate(article.published_at)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Eye className="h-4 w-4"/>
                            <span>{formatReadCount(article.read_count)} reads</span>
                        </div>
                        {article.author && (
                            <div className="flex items-center space-x-2">
                                <span>by</span>
                                <span className="font-medium text-violet-600 dark:text-violet-400">
                                    {article.author}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {article.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-3 py-1 bg-violet-100 dark:bg-violet-900 text-violet-800 dark:text-violet-200 text-sm font-medium rounded-full"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {/* Article Content */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                        <ArticleContent content={article.content}/>
                    </div>
                </div>
            </article>
        </div>
    );
}