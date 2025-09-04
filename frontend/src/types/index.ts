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

// Тип для статьи из бэкенда (может отличаться от фронтенда)
export interface BackendArticle {
    id: number;
    title: string;
    content: string;
    image_url?: string;
    published_at?: string;
    read_count?: number;
    tags?: string[];
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

// Типы для пагинации Spring Boot
export interface Pageable {
    page_number: number;
    page_size: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

export interface PaginatedResponse<T> {
    content: T[];
    pageable: Pageable;
    total_pages: number;
    total_elements: number;
    last: boolean;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    number_of_elements: number;
    first: boolean;
    empty: boolean;
}

export interface LoginRequest {
    login: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    username: string;
    mail: string;
}

export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}

export type Theme = 'light' | 'dark';