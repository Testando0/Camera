// pages/api/search-vreden.js
const VREDEN_API_BASE = 'https://api.vreden.my.id/api/v1/download/play/video';

// Usamos o 'fetch' nativo do Node.js (disponível no Next.js)
export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).send({ message: 'Method Not Allowed' });
    }
    const { q: query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Missing search query' });
    }

    try {
        const apiUrl = `${VREDEN_API_BASE}?query=${encodeURIComponent(query)}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Tratamento de resposta: verifica se a estrutura de dados é válida
        if (data.status === true && data.resultado && data.resultado.metadados) {
            const metadados = data.resultado.metadados;

            return res.status(200).json({
                videoId: metadados.videoId,
                title: metadados.título,
                channel: metadados.autor.nome,
                views: metadados.visualizações,
                thumbnail: metadados.imagem,
                downloadUrl: data.resultado.download ? data.resultado.download.url : null
            });
        }
        
        return res.status(404).json({ error: 'Nenhum resultado de vídeo encontrado na API de terceiros.' });

    } catch (error) {
        console.error("API Fetch Error:", error);
        res.status(500).json({ error: 'Erro de conexão com o servidor de busca.' });
    }
}
