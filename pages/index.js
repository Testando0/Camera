// pages/index.js
import { useState } from 'react';
// Caminho correto: sobe um nível (..) e entra na pasta components
import YouTubePlayer from '../components/YouTubePlayer';

export default function YouTubeClone() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentVideo, setCurrentVideo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm) return;

        setLoading(true);
        setError(null);
        setCurrentVideo(null);

        try {
            // Chamada para o Proxy API Route no Vercel
            const response = await fetch(`/api/search-vreden?q=${encodeURIComponent(searchTerm)}`);
            const data = await response.json();

            if (data.error) {
                setError(data.error);
            } else if (data.videoId) {
                setCurrentVideo(data);
            } else {
                setError('Nenhum resultado de vídeo encontrado.');
            }

        } catch (err) {
            setError('Erro fatal ao processar a busca.');
        } finally {
            setLoading(false);
        }
    };

    const formatViews = (views) => {
        if (!views) return 'N/A';
        if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
        if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
        return views;
    };

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
            <h1>🎥 YouTube Clone Interface</h1>
            
            <form onSubmit={handleSearch} style={{ marginBottom: '30px', display: 'flex', gap: '10px' }}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Pesquisar vídeos, ex: Happy Nation"
                    style={{ padding: '10px', flexGrow: 1, border: '1px solid #ccc' }}
                />
                <button type="submit" disabled={loading} style={{ padding: '10px 20px', backgroundColor: '#FF0000', color: 'white', border: 'none', cursor: 'pointer' }}>
                    {loading ? 'Buscando...' : 'Buscar'}
                </button>
            </form>

            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>⚠️ Erro: {error}</p>}

            {/* Módulo Player e Metadados */}
            {currentVideo && (
                <div className="video-content">
                    {/* Player */}
                    <div className="main-player" style={{ marginBottom: '15px' }}>
                        <YouTubePlayer videoId={currentVideo.videoId} />
                    </div>

                    {/* Metadados */}
                    <div className="video-metadata">
                        <h2>{currentVideo.title}</h2>
                        <p style={{ color: '#555' }}>
                            **Canal:** {currentVideo.channel} | **Visualizações:** {formatViews(currentVideo.views)}
                        </p>
                        <p style={{ fontSize: '0.8em', color: 'orange' }}>
                            * Aviso: Este site usa uma API de terceiros. A qualidade dos dados pode variar.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
