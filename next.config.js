/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para permitir o carregamento de imagens do YouTube
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/vi/**',
      },
    ],
  },
};

module.exports = nextConfig;
