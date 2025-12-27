/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'api.openweathermap.org',
            },
            {
                protocol: 'https',
                hostname: '**.clerk.com',
            },
        ],
    },
    reactStrictMode: true,
};

module.exports = nextConfig;
