/** @type {import('next').NextConfig} */
const nextConfig = {
    // Необходимо для Docker standalone build
    output: 'standalone',

    // Настройки для изображений
    images: {
        domains: [
            'localhost',
            'storage.yandexcloud.net' // Добавлен домен Yandex Cloud
        ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'storage.yandexcloud.net',
                pathname: '/**',
            },
        ],
        unoptimized: true, // Для упрощения в Docker
    },

    // Переменные окружения
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        INTERNAL_API_URL: process.env.INTERNAL_API_URL,
    },

    // Для работы в Docker
    experimental: {
        serverComponentsExternalPackages: [],
    },
}

module.exports = nextConfig