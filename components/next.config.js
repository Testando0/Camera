/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para permitir o carregamento de imagens de domínios externos (YouTube)
  images: {
    // Adicione os domínios de onde virão as miniaturas dos vídeos (ex: i.ytimg.com)
    // Isso é essencial para carregar o 'thumbnail' (metadados.imagem) de forma otimizada.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/vi/**',
      },
      // Adicione aqui outros domínios de imagens se necessário (como o da API de terceiros)
    ],
  },
  // Permite que a API Serverless use módulos do Node.js
  experimental: {
    serverComponentsExternalPackages: ['node-fetch'],
  },
};

module.exports = nextConfig;
