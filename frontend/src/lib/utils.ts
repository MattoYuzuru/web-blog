export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export function formatReadCount(count: number): string {
    if (count < 1000) {
        return count.toString();
    }
    if (count < 1000000) {
        return `${Math.floor(count / 100) / 10}k`;
    }
    return `${Math.floor(count / 100000) / 10}M`;
}

export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}