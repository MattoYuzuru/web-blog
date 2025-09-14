import {
    ApiResponse,
    BackendArticle,
    CreateArticleRequest,
    LoginRequest,
    LoginResponse,
    PaginatedResponse,
    SpringPageResponse
} from '@/types';

class ApiClient {
    private token: string | null = null;
    private baseUrl: string;

    constructor() {
        this.baseUrl = this.getBaseUrl();
        this.initializeToken();
    }

    private getBaseUrl(): string {
        // On client side (browser)
        if (typeof window !== 'undefined') {
            // With nginx proxy, just use the same domain
            return process.env.NEXT_PUBLIC_API_URL || window.location.origin;
        }

        // On server side (SSR) - use internal container URL
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
        const url = `${this.baseUrl}${endpoint}`;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };

        // Always check for fresh token before request
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('auth_token');
        }

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            console.log(`Making request to: ${url}`);

            const response = await fetch(url, {
                ...options,
                headers,
                mode: 'cors',
                credentials: 'omit', // Don't send cookies for CORS requests
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Request failed:', response.status, errorText);

                if (response.status === 401) {
                    this.logout();
                    throw new Error('Unauthorized - please login again');
                }
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Special request method for file uploads (without JSON Content-Type)
    private async uploadRequest<T>(
        endpoint: string,
        formData: FormData
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        // Always check for fresh token before request
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('auth_token');
        }

        const headers: Record<string, string> = {};

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            console.log(`Making upload request to: ${url}`);

            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: formData,
                mode: 'cors',
                credentials: 'omit',
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Upload request failed:', response.status, errorText);

                if (response.status === 401) {
                    this.logout();
                    throw new Error('Unauthorized - please login again');
                }
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Upload request failed:', error);
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
                    console.log('Token saved to localStorage');
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

    // Upload method
    async uploadImage(file: File): Promise<ApiResponse<{url: string}>> {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await this.uploadRequest<{url: string}>('/api/uploads/image', formData);

            return {
                data: response,
                success: true
            };
        } catch (error) {
            console.error('Failed to upload image:', error);
            return {
                data: { url: '' },
                success: false,
                message: error instanceof Error ? error.message : 'Failed to upload image'
            };
        }
    }

    // Articles methods - используем Spring Page response
    async getArticles(page: number = 1, limit: number = 10): Promise<ApiResponse<SpringPageResponse<BackendArticle>>> {
        try {
            const response = await this.request<SpringPageResponse<BackendArticle>>(`/api/articles?page=${page}&limit=${limit}`);
            return {
                data: response,
                success: true
            };
        } catch (error) {
            console.error('Failed to get articles:', error);
            return {
                data: {} as SpringPageResponse<BackendArticle>,
                success: false,
                message: error instanceof Error ? error.message : 'Failed to get articles'
            };
        }
    }

    async getArticle(id: string): Promise<ApiResponse<BackendArticle>> {
        try {
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

    // Метод для инкремента счетчика прочтений
    async incrementReadCount(articleId: string): Promise<ApiResponse<{readCount: number}>> {
        try {
            const response = await this.request<{readCount: number}>(`/api/articles/${articleId}/increment-read`, {
                method: 'POST',
            });
            return {
                data: response,
                success: true
            };
        } catch (error) {
            console.error('Failed to increment read count:', error);
            return {
                data: { readCount: 0 },
                success: false,
                message: error instanceof Error ? error.message : 'Failed to increment read count'
            };
        }
    }

    // Search method - использует ваш новый PaginatedResponse
    async searchArticles(query: string, page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<BackendArticle>>> {
        try {
            // Обратите внимание: ваш SearchController ожидает 0-based page, но мы передаем 1-based
            const response = await this.request<PaginatedResponse<BackendArticle>>(
                `/api/articles/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`
            );
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