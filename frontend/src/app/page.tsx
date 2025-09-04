'use client';

import {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import SearchInput from '@/components/SearchInput';
import ArticleCard from '@/components/ArticleCard';
import {Article, BackendArticle} from '@/types';
import {apiClient} from '@/lib/api';
import {Loader2, AlertCircle, LogIn, LogOut} from 'lucide-react';

export default function HomePage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const [needsAuth, setNeedsAuth] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    // Функция для преобразования данных бэкенда в формат фронтенда
    const transformBackendArticle = (backendArticle: BackendArticle): Article => ({
        id: backendArticle.id?.toString() || '',
        title: backendArticle.title || 'No title',
        content: backendArticle.content || '',
        image_url: backendArticle.image_url || '/placeholder-article.jpg',
        published_at: backendArticle.published_at || new Date().toISOString().split('T')[0],
        read_count: backendArticle.read_count || 0,
        tags: backendArticle.tags || [],
        author: backendArticle.author || 'KeykoMI'
    });

    useEffect(() => {
        // Проверяем авторизацию при загрузке
        setIsAuthenticated(apiClient.isAuthenticated());
        loadArticles();
    }, []);

    const loadArticles = async () => {
        setLoading(true);
        setError('');
        setNeedsAuth(false);

        try {
            console.log('Loading articles...');
            const response = await apiClient.getArticles();

            if (response.success) {
                console.log('Articles loaded successfully:', response.data);

                // Исправлено: данные статей находятся в response.data.content
                const articlesData = response.data.content || [];

                // Преобразуем данные из бэкенда в формат фронтенда
                const transformedArticles = articlesData.map(transformBackendArticle);

                setArticles(transformedArticles);
            } else {
                console.error('Failed to load articles:', response.message);

                // Проверяем, нужна ли авторизация
                if (response.message?.includes('Unauthorized') || response.message?.includes('401')) {
                    setNeedsAuth(true);
                    setIsAuthenticated(false);
                    setError('Authorization required to view articles');
                } else {
                    setError(response.message || 'Failed to load articles');
                    // Показываем моковые данные в случае ошибки
                    setArticles(getMockArticles());
                }
            }
        } catch (error) {
            console.error('Failed to load articles:', error);
            setError('Failed to connect to server');
            // Показываем моковые данные в случае ошибки
            setArticles(getMockArticles());
        } finally {
            setLoading(false);
        }
    };

    const getMockArticles = (): Article[] => [
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
    ];

    const handleSearch = async (query: string) => {
        if (!query.trim()) {
            loadArticles();
            return;
        }

        setLoading(true);
        setSearchQuery(query);
        setError('');

        try {
            const response = await apiClient.searchArticles(query);
            if (response.success) {
                const articlesData = response.data.content || [];
                const transformedArticles = articlesData.map(transformBackendArticle);
                setArticles(transformedArticles);
            } else {
                if (response.message?.includes('Unauthorized') || response.message?.includes('401')) {
                    setNeedsAuth(true);
                    setIsAuthenticated(false);
                    setError('Authorization required to search articles');
                } else {
                    setError(response.message || 'Search failed');
                    // Фильтр моков при ошибке
                    const filtered = getMockArticles().filter(article =>
                        article.title.toLowerCase().includes(query.toLowerCase()) ||
                        article.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
                    );
                    setArticles(filtered);
                }
            }
        } catch (error) {
            console.error('Search failed:', error);
            setError('Search failed');
            // Фильтр моков при ошибке
            const filtered = getMockArticles().filter(article =>
                article.title.toLowerCase().includes(query.toLowerCase()) ||
                article.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
            );
            setArticles(filtered);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = () => {
        router.push('/login');
    };

    const handleLogout = () => {
        apiClient.logout();
        setIsAuthenticated(false);
        // Перезагружаем статьи после выхода
        loadArticles();
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                            Welcome to KeykoMI Lib
                        </h1>
                    </div>

                    {/* Auth Button */}
                    <div className="ml-4">
                        {isAuthenticated ? (
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200 dark:text-red-200 dark:bg-red-800 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </button>
                        ) : (
                            <button
                                onClick={handleLogin}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-violet-600 bg-violet-100 hover:bg-violet-200 dark:text-violet-200 dark:bg-violet-800 dark:hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                            >
                                <LogIn className="h-4 w-4 mr-2" />
                                Login
                            </button>
                        )}
                    </div>
                </div>

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

            {/* Error Message */}
            {error && (
                <div className="mb-8">
                    <div className={`rounded-lg p-4 ${needsAuth ? 'bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700' : 'bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700'}`}>
                        <div className="flex items-center">
                            <AlertCircle className={`h-5 w-5 ${needsAuth ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'} mr-3`} />
                            <p className={`text-sm ${needsAuth ? 'text-yellow-700 dark:text-yellow-300' : 'text-red-700 dark:text-red-300'}`}>
                                {error}
                            </p>
                        </div>
                        {needsAuth && (
                            <div className="mt-3">
                                <button
                                    onClick={handleLogin}
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 dark:text-yellow-200 dark:bg-yellow-800 dark:hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                >
                                    <LogIn className="h-4 w-4 mr-2" />
                                    Go to Login
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

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