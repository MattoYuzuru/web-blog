import { CreateArticleRequest } from '@/types';

/**
 * Форматирует дату в читаемый вид (русская локаль).
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Форматирует количество просмотров (например, 1.2k, 3.4M).
 */
export function formatReadCount(count: number): string {
    if (count < 1000) {
        return count.toString();
    }
    if (count < 1_000_000) {
        return `${Math.floor(count / 100) / 10}k`;
    }
    return `${Math.floor(count / 100_000) / 10}M`;
}

/**
 * Данные черновика статьи (включает CreateArticleRequest и метку времени).
 */
export interface DraftData extends CreateArticleRequest {
    timestamp: number;
}

/**
 * Менеджер черновиков статьи (сохраняет/загружает в localStorage).
 */
export class DraftManager {
    private static readonly DRAFT_KEY = 'articleDraft';
    private static readonly MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 дней

    /**
     * Сохраняет черновик в localStorage
     */
    static saveDraft(data: CreateArticleRequest): boolean {
        const hasContent =
            data.title.trim() ||
            data.content.trim() ||
            (data.image_url ?? "").trim() ||
            data.tags.length > 0;

        if (!hasContent) {
            return false;
        }

        const draftData: DraftData = {
            ...data,
            timestamp: Date.now()
        };

        try {
            localStorage.setItem(this.DRAFT_KEY, JSON.stringify(draftData));
            return true;
        } catch (error) {
            console.error('Ошибка сохранения черновика:', error);
            return false;
        }
    }

    /**
     * Загружает черновик из localStorage
     */
    static loadDraft(): CreateArticleRequest | null {
        try {
            const savedDraft = localStorage.getItem(this.DRAFT_KEY);
            if (!savedDraft) return null;

            const draftData: DraftData = JSON.parse(savedDraft);

            if (Date.now() - draftData.timestamp > this.MAX_AGE) {
                this.clearDraft();
                return null;
            }

            const { timestamp, ...articleData } = draftData;
            return articleData;
        } catch (error) {
            console.error('Ошибка загрузки черновика:', error);
            this.clearDraft();
            return null;
        }
    }

    /**
     * Проверяет, есть ли сохраненный черновик
     */
    static hasDraft(): boolean {
        return this.loadDraft() !== null;
    }

    /**
     * Очищает сохраненный черновик
     */
    static clearDraft(): void {
        localStorage.removeItem(this.DRAFT_KEY);
    }

    /**
     * Получает информацию о черновике (дата создания, возраст, размер в байтах)
     */
    static getDraftInfo(): { timestamp: number; age: number; size: number } | null {
        try {
            const savedDraft = localStorage.getItem(this.DRAFT_KEY);
            if (!savedDraft) return null;

            const draftData: DraftData = JSON.parse(savedDraft);

            return {
                timestamp: draftData.timestamp,
                age: Date.now() - draftData.timestamp,
                size: new Blob([savedDraft]).size
            };
        } catch {
            return null;
        }
    }

    /**
     * Форматирует возраст черновика для отображения
     */
    static formatDraftAge(timestamp: number): string {
        const age = Date.now() - timestamp;
        const minutes = Math.floor(age / (1000 * 60));
        const hours = Math.floor(age / (1000 * 60 * 60));
        const days = Math.floor(age / (1000 * 60 * 60 * 24));

        if (days > 0) return `${days} д. назад`;
        if (hours > 0) return `${hours} ч. назад`;
        if (minutes > 0) return `${minutes} мин. назад`;
        return 'только что';
    }

    /**
     * Проверяет, заполнены ли обязательные поля для публикации
     */
    static isReadyToPublish(data: CreateArticleRequest): boolean {
        return data.title.trim().length > 0 && data.content.trim().length > 0;
    }
}
