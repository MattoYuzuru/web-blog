/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
            },
        ],
    },
    async rewrites() {
        // Определяем URL backend'а в зависимости от окружения
        const backendUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

        console.log('Backend URL for rewrites:', backendUrl);

        return [
            {
                source: '/api/:path*',
                destination: `${backendUrl}/api/:path*`,
            },
        ];
    },

    // Добавьте обработку статических файлов
    assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',

    // Для разработки
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        INTERNAL_API_URL: process.env.INTERNAL_API_URL,
    },

    // Включите standalone для Docker
    output: 'standalone',
};

module.exports = nextConfig;