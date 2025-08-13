export interface Article {
    id: string;
    title: string;
    content: string;
    image_url: string;
    published_at: string;
    read_count: number;
    tags: string[];
    author?: string;
}

export interface CreateArticleRequest {
    title: string;
    content: string;
    image_url?: string;
    tags: string[];
}

export interface SearchParams {
    query?: string;
    page?: number;
    limit?: number;
}

export interface LoginRequest {
    login: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
    user_id: string;
}

export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}

export type Theme = 'light' | 'dark';