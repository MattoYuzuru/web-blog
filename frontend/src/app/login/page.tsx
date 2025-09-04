'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { apiClient } from '@/lib/api';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.username.trim() || !formData.password.trim()) {
            setError('Заполните все поля');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            console.log('Attempting login with:', { login: formData.username });

            const response = await apiClient.login({
                login: formData.username,
                password: formData.password
            });

            console.log('Login response:', response);

            if (response.success && response.data?.access_token) {
                console.log('Login successful, redirecting to homepage');
                setSuccess(true);

                // Показываем успешное сообщение перед редиректом
                setTimeout(() => {
                    router.push('/');
                    router.refresh(); // Обновляем страницу для применения нового состояния авторизации
                }, 1000);
            } else {
                setError(response.message || 'Ошибка логина. Проверь введенные данные.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Ошибка логина. Попробуй ещё раз.');
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

    // Показываем сообщение об успехе
    if (success) {
        return (
            <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 text-center">
                    <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-6">
                        <CheckCircle className="mx-auto h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                            Вход выполнен успешно!
                        </h2>
                        <p className="text-sm text-green-600 dark:text-green-400">
                            Перенаправляем на главную страницу...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <LogIn className="mx-auto h-12 w-12 text-violet-600" />
                    <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Войти в аккаунт
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Доступ к дешборду KeykoMI Lib
                    </p>
                </div>

                {/* Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={formData.username}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-gray-100"
                                placeholder="Enter your username"
                                disabled={loading}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 dark:bg-gray-700 dark:text-gray-100"
                                    placeholder="Enter your password"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    disabled={loading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Signing in...
                            </>
                        ) : (
                            <>
                                <LogIn className="h-4 w-4 mr-2" />
                                Sign in
                            </>
                        )}
                    </button>

                    {/* Help text */}
                    <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Свяжитесь со мной если хотите поучаствовать в создании контента :)
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}