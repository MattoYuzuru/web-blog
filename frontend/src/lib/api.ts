import {Article, BackendArticle, CreateArticleRequest, LoginRequest, LoginResponse, ApiResponse, PaginatedResponse} from '@/types';

class ApiClient {
    private token: string | null = null;
    private baseUrl: string;

    constructor() {
        // Определяем базовый URL в зависимости от окружения
        this.baseUrl = this.getBaseUrl();
        this.initializeToken();
    }

    private getBaseUrl(): string {
        // На клиенте используем NEXT_PUBLIC_API_URL
        if (typeof window !== 'undefined') {
            return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
        }

        // На сервере можем использовать internal URL для SSR (если нужно)
        return process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
    }

    private initializeToken() {
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('auth_token');
        }
    }

    public isAuthenticated(): boolean {
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('auth_token');
        }
        return !!this.token;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        // Используем полный URL к бэкенду
        const url = `${this.baseUrl}${endpoint}`;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };

        // Всегда проверяем актуальный токен перед запросом
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('auth_token');
        }

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            console.log(`Making request to: ${url}`); // Для отладки

            const response = await fetch(url, {
                ...options,
                headers,
                // Добавляем CORS headers если нужно
                mode: 'cors',
            });

            if (!response.ok) {
                if (response.status === 401) {
                    this.logout();
                    throw new Error('Unauthorized - please login again');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Auth methods
    async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        try {
            const response = await this.request<{data: LoginResponse, success: boolean}>('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials),
            });

            if (response.success && response.data?.access_token) {
                this.token = response.data.access_token;
                if (typeof window !== 'undefined') {
                    localStorage.setItem('auth_token', this.token);
                    console.log('Token saved to localStorage:', this.token.substring(0, 20) + '...');
                }
                return {
                    data: response.data,
                    success: true
                };
            } else {
                console.error('Login failed or no token received:', response);
                return {
                    data: {} as LoginResponse,
                    success: false,
                    message: 'Login failed'
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                data: {} as LoginResponse,
                success: false,
                message: error instanceof Error ? error.message : 'Login failed'
            };
        }
    }

    logout() {
        this.token = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
        }
    }

    // Articles methods
    async getArticles(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<BackendArticle>>> {
        try {
            // Бэк возвращает данные напрямую, не в обертке {data: ..., success: ...}
            const response = await this.request<PaginatedResponse<BackendArticle>>(`/api/articles?page=${page}&limit=${limit}`);
            return {
                data: response,
                success: true
            };
        } catch (error) {
            console.error('Failed to get articles:', error);
            return {
                data: {} as PaginatedResponse<BackendArticle>,
                success: false,
                message: error instanceof Error ? error.message : 'Failed to get articles'
            };
        }
    }

    async getArticle(id: string): Promise<ApiResponse<BackendArticle>> {
        try {
            // Бэк возвращает статью напрямую
            const response = await this.request<BackendArticle>(`/api/articles/${id}`);
            return {
                data: response,
                success: true
            };
        } catch (error) {
            console.error('Failed to get article:', error);
            return {
                data: {} as BackendArticle,
                success: false,
                message: error instanceof Error ? error.message : 'Failed to get article'
            };
        }
    }

    async createArticle(article: CreateArticleRequest): Promise<ApiResponse<BackendArticle>> {
        try {
            const response = await this.request<BackendArticle>('/api/articles', {
                method: 'POST',
                body: JSON.stringify(article),
            });
            return {
                data: response,
                success: true
            };
        } catch (error) {
            console.error('Failed to create article:', error);
            return {
                data: {} as BackendArticle,
                success: false,
                message: error instanceof Error ? error.message : 'Failed to create article'
            };
        }
    }

    async searchArticles(query: string): Promise<ApiResponse<PaginatedResponse<BackendArticle>>> {
        try {
            // Предполагаю что у вас есть поиск по статьям
            const response = await this.request<PaginatedResponse<BackendArticle>>(`/api/articles/search?q=${encodeURIComponent(query)}`);
            return {
                data: response,
                success: true
            };
        } catch (error) {
            console.error('Failed to search articles:', error);
            return {
                data: {} as PaginatedResponse<BackendArticle>,
                success: false,
                message: error instanceof Error ? error.message : 'Failed to search articles'
            };
        }
    }
}

export const apiClient = new ApiClient();