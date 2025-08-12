import {Article, CreateArticleRequest, LoginRequest, LoginResponse, ApiResponse} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
    private readonly baseURL: string;
    private token: string | null = null;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('auth_token');
        }
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseURL}${endpoint}`;
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            if (!response.ok) {
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

export const apiClient = new ApiClient(API_BASE_URL);