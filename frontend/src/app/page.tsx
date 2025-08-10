'use client';

import {useState, useEffect} from 'react';
import SearchInput from '@/components/SearchInput';
import ArticleCard from '@/components/ArticleCard';
import {Article} from '@/types';
import {apiClient} from '@/lib/api';
import {Loader2} from 'lucide-react';

export default function HomePage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadArticles();
    }, []);

    const loadArticles = async () => {
        setLoading(true);
        try {
            const response = await apiClient.getArticles();
            if (response.success) {
                setArticles(response.data);
            }
        } catch (error) {
            console.error('Failed to load articles:', error);
            // Замокал статьи
            setArticles([
                {
                    id: '1',
                    title: 'Зачем вести отдельный сайт для блога если есть Телеграм?',
                    content: 'Контент.',
                    image_url: '/placeholder-article.jpg',
                    published_at: '2025-08-09',
                    read_count: 1,
                    tags: ['thoughts'],
                    author: 'KeykoMI'
                },
                {
                    id: '2',
                    title: 'Путешествие в Корею, август-сентябрь 2025',
                    content: 'Контент статьи',
                    image_url: '/placeholder-article.jpg',
                    published_at: '2025-08-10',
                    read_count: 5,
                    tags: ['travel'],
                    author: 'KeykoMI'
                },
                {
                    id: '3',
                    title: 'Пример статьи',
                    content: 'Контент',
                    image_url: '/placeholder-article.jpg',
                    published_at: '2025-08-05',
                    read_count: 1,
                    tags: ['life'],
                    author: 'KeykoMI'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            loadArticles();
            return;
        }

        setLoading(true);
        setSearchQuery(query);
        try {
            const response = await apiClient.searchArticles(query);
            if (response.success) {
                setArticles(response.data);
            }
        } catch (error) {
            console.error('Search failed:', error);
            // Фильтр моков
            const filtered = articles.filter(article =>
                article.title.toLowerCase().includes(query.toLowerCase()) ||
                article.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
            );
            setArticles(filtered);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    Welcome to KeykoMI Lib
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                    Блог о моей жизни, учебе, карьере...
                </p>

                {/* Search */}
                <SearchInput onSearch={handleSearch}/>
                {searchQuery && (
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        {loading ? 'Searching...' : `Search results for "${searchQuery}"`}
                    </p>
                )}
            </div>

            {/* Articles Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-violet-600"/>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">Loading articles...</span>
                </div>
            ) : articles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map((article) => (
                        <ArticleCard key={article.id} article={article}/>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                        {searchQuery ? 'No articles found matching your search.' : 'No articles available.'}
                    </p>
                    {searchQuery && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                loadArticles();
                            }}
                            className="mt-4 text-violet-600 hover:text-violet-700 font-medium"
                        >
                            Clear search and view all articles
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}