'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Loader2, X, FileText, Trash2 } from 'lucide-react';
import Link from 'next/link';
import MarkdownEditor from '@/components/MarkdownEditor';
import { apiClient } from '@/lib/api';
import { CreateArticleRequest } from '@/types';
import {DraftManager} from "@/lib/utils";

// Типы для черновика
interface DraftData extends CreateArticleRequest {
    timestamp: number;
}

// Ключ для localStorage
const DRAFT_KEY = 'articleDraft';
const AUTO_SAVE_INTERVAL = 2000; // 2 секунды

export default function NewArticlePage() {
    const [formData, setFormData] = useState<CreateArticleRequest>({
        title: '',
        content: '',
        image_url: '',
        tags: []
    });
    const [tagInput, setTagInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [draftStatus, setDraftStatus] = useState<'saved' | 'saving' | 'none'>('none');
    const [hasDraft, setHasDraft] = useState(false);

    const router = useRouter();

    // Функция для сохранения черновика
    const saveDraft = useCallback(() => {
        // Проверяем, есть ли контент для сохранения
        const hasContent = formData.title.trim() || formData.content.trim() ||
            formData.image_url?.trim() || formData.tags.length > 0;

        if (!hasContent) {
            return;
        }

        const draftData: DraftData = {
            ...formData,
            timestamp: Date.now()
        };

        try {
            localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
            setDraftStatus('saved');
            setHasDraft(true);

            // Убираем индикатор через 2 секунды
            setTimeout(() => {
                setDraftStatus('none');
            }, 2000);
        } catch (error) {
            console.error('Ошибка сохранения черновика:', error);
        }
    }, [formData]);

    // Функция для загрузки черновика
    const loadDraft = useCallback(() => {
        try {
            const savedDraft = localStorage.getItem(DRAFT_KEY);
            if (!savedDraft) return false;

            const draftData: DraftData = JSON.parse(savedDraft);

            // Проверяем, не слишком ли старый черновик (7 дней)
            const maxAge = 7 * 24 * 60 * 60 * 1000;
            if (Date.now() - draftData.timestamp > maxAge) {
                localStorage.removeItem(DRAFT_KEY);
                return false;
            }

            // Загружаем данные
            setFormData({
                title: draftData.title || '',
                content: draftData.content || '',
                image_url: draftData.image_url || '',
                tags: draftData.tags || []
            });

            setHasDraft(true);
            return true;
        } catch (error) {
            console.error('Ошибка загрузки черновика:', error);
            localStorage.removeItem(DRAFT_KEY);
            return false;
        }
    }, []);

    // Функция для очистки черновика
    const clearDraft = useCallback(() => {
        DraftManager.clearDraft();
        setHasDraft(false);
        setDraftStatus('none');
    }, []);

    // Функция для удаления черновика пользователем
    const deleteDraft = useCallback(() => {
        if (confirm('Вы уверены, что хотите удалить сохраненный черновик?')) {
            clearDraft();
            setFormData({
                title: '',
                content: '',
                image_url: '',
                tags: []
            });
            setTagInput('');
        }
    }, [clearDraft]);

    // Проверка аутентификации и загрузка черновика при монтировании
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            router.push('/login');
        } else {
            setIsAuthenticated(true);
            // Загружаем черновик только после проверки аутентификации
            loadDraft();
        }
    }, [router, loadDraft]);

    // Автосохранение черновика
    useEffect(() => {
        if (!isAuthenticated) return;

        const timeoutId = setTimeout(() => {
            if (draftStatus !== 'saving') {
                setDraftStatus('saving');
                saveDraft();
            }
        }, AUTO_SAVE_INTERVAL);

        return () => clearTimeout(timeoutId);
    }, [formData, isAuthenticated, saveDraft, draftStatus]);

    // Сохранение при уходе со страницы
    useEffect(() => {
        const handleBeforeUnload = () => {
            saveDraft();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [saveDraft]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.content.trim()) {
            setError('Название и контент обязательны');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await apiClient.createArticle(formData);

            if (response.success) {
                setSuccess('Статья успешно опубликована!');
                // Очищаем черновик после успешной отправки
                clearDraft();

                setTimeout(() => {
                    router.push(`/article/${response.data.id}`);
                }, 2000);
            } else {
                setError(response.message || 'Не вышло создать статью.');
            }
        } catch (error) {
            setError('Ошибка при создании статьи. Попробуйте ещё раз.');
            console.error('Ошибка при создании статьи:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleContentChange = (content: string) => {
        setFormData(prev => ({
            ...prev,
            content
        }));
        if (error) setError('');
    };

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const tag = tagInput.trim().toLowerCase();

            if (tag && !formData.tags.includes(tag)) {
                setFormData(prev => ({
                    ...prev,
                    tags: [...prev.tags, tag]
                }));
                setTagInput('');
            }
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    if (!isAuthenticated) {
        return null; // Редирект к login
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/"
                        className="inline-flex items-center space-x-2 text-violet-600 hover:text-violet-700 font-medium"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Назад</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Создать новую статью
                    </h1>
                </div>

                {/* Draft status and controls */}
                <div className="flex items-center space-x-3">
                    {/* Draft status indicator */}
                    {draftStatus !== 'none' && (
                        <div className="flex items-center space-x-2 text-sm">
                            {draftStatus === 'saving' ? (
                                <div className="flex items-center space-x-1 text-yellow-600 dark:text-yellow-400">
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                    <span>Сохраняю...</span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                                    <FileText className="h-3 w-3" />
                                    <span>Черновик сохранен</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Delete draft button */}
                    {hasDraft && (
                        <button
                            type="button"
                            onClick={deleteDraft}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded"
                            title="Удалить черновик"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Draft loaded notification */}
            {hasDraft && (
                <div className="mb-6 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                            Загружен сохраненный черновик. Статья автоматически сохраняется во время набора.
                        </p>
                    </div>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Status Messages */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4">
                        <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
                    </div>
                )}

                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Название статьи *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Введите подходящее для статьи название: "
                        className="input-field text-lg font-medium"
                        disabled={loading}
                    />
                </div>

                {/* Image URL */}
                <div>
                    <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        URL Картинки
                    </label>
                    <input
                        type="url"
                        id="image_url"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg (400x200px рекомендуется)"
                        className="input-field"
                        disabled={loading}
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Опционально. Рекомендованный размер картинки: 400x200px. Можно оставить пустым.
                    </p>
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tags
                    </label>
                    <div className="space-y-2">
                        {/* Tag Input */}
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleAddTag}
                            placeholder="Type a tag and press Enter or comma..."
                            className="input-field"
                            disabled={loading}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Использовать Enter или "," для тегов. Например: js, java, tutorial
                        </p>

                        {/* Tag List */}
                        {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {formData.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center px-3 py-1 bg-violet-100 dark:bg-violet-900 text-violet-800 dark:text-violet-200 text-sm font-medium rounded-full"
                                    >
                                        #{tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="ml-2 text-violet-600 hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-200"
                                            disabled={loading}
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Контент статьи *
                    </label>
                    <MarkdownEditor
                        value={formData.content}
                        onChange={handleContentChange}
                        placeholder="Напишите статью в формате Markdown..."
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        * Обязательные поля
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link
                            href="/"
                            className="btn-secondary"
                        >
                            Отмена
                        </Link>
                        <button
                            type="submit"
                            disabled={loading || !formData.title.trim() || !formData.content.trim()}
                            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Отправляю...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    <span>Опубликовать</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}