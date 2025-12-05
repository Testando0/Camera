// pages/api/search-vreden.js
import fetch from 'node-fetch';

const VREDEN_API_BASE = 'https://api.vreden.my.id/api/v1/download/play/video';

export default async function handler(req, res) {
    const { q: query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Missing search query' });
    }

    try {
        // Constrói a URL da API de terceiros
        const apiUrl = `${VREDEN_API_BASE}?query=${encodeURIComponent(query)}`;
        
        // Faz a requisição
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Verifica a resposta da API (conforme o JSON que você forneceu)
        if (data.status === true && data.resultado && data.resultado.metadados) {
            const metadados = data.resultado.metadados;

            // Retorna os dados necessários para o frontend
            return res.status(200).json({
                videoId: metadados.videoId,
                title: metadados.título,
                channel: metadados.autor.nome,
                views: metadados.visualizações,
                thumbnail: metadados.imagem,
                // Opcional: url para download
                downloadUrl: data.resultado.download ? data.resultado.download.url : null
            });
        }
        
        return res.status(404).json({ error: 'Nenhum resultado encontrado na API.' });

    } catch (error) {
        console.error("API Vreden Error:", error);
        res.status(500).json({ error: 'Failed to communicate with Vreden API' });
    }
}
