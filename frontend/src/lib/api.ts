import {Article, CreateArticleRequest, LoginRequest, LoginResponse, ApiResponse} from '@/types';

class ApiClient {
    private token: string | null = null;

    constructor() {
        // Инициализируем токен только на клиенте
        this.initializeToken();
    }

    private initializeToken() {
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('auth_token');
        }
    }

    // Метод для проверки авторизации
    public isAuthenticated(): boolean {
        if (typeof window !== 'undefined') {
            // Всегда получаем актуальный токен из localStorage
            this.token = localStorage.getItem('auth_token');
        }
        return !!this.token;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        // Используем относительные пути - Next.js rewrites обработает их
        const url = endpoint;
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
            const response = await fetch(url, {
                ...options,
                headers,
            });

            if (!response.ok) {
                // Если 401 - токен истек или недействителен
                if (response.status === 401) {
                    this.logout();
                    throw new Error('Unauthorized - please login again');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return {data, success: true};
        } catch (error) {
            console.error('API request failed:', error);
            return {
                data: {} as T,
                success: false,
                message: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    // Auth methods
    async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        const response = await this.request<LoginResponse>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        if (response.success && response.data.access_token) {
            this.token = response.data.access_token;
            if (typeof window !== 'undefined') {
                localStorage.setItem('auth_token', this.token);
            }
        }

        return response;
    }

    logout() {
        this.token = null;
        if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
        }
    }

    // Articles methods
    async getArticles(page: number = 1, limit: number = 10): Promise<ApiResponse<Article[]>> {
        return this.request<Article[]>(`/api/articles?page=${page}&limit=${limit}`);
    }

    async getArticle(id: string): Promise<ApiResponse<Article>> {
        return this.request<Article>(`/api/articles/${id}`);
    }

    async createArticle(article: CreateArticleRequest): Promise<ApiResponse<Article>> {
        return this.request<Article>('/api/articles', {
            method: 'POST',
            body: JSON.stringify(article),
        });
    }

    async searchArticles(query: string): Promise<ApiResponse<Article[]>> {
        return this.request<Article[]>(`/api/articles/search?q=${encodeURIComponent(query)}`);
    }
}

export const apiClient = new ApiClient();