// pages/index.js
import { useState } from 'react';
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
        setCurrentVideo(null); // Limpa o vídeo atual

        try {
            // Chama a sua função proxy no Vercel
            const response = await fetch(`/api/search-vreden?q=${encodeURIComponent(searchTerm)}`);
            const data = await response.json();

            if (data.error) {
                setError(data.error);
            } else if (data.videoId) {
                // Define o vídeo encontrado como o vídeo atual
                setCurrentVideo(data);
            } else {
                setError('Nenhum resultado de vídeo encontrado.');
            }

        } catch (err) {
            console.error(err);
            setError('Erro ao conectar com o serviço de busca.');
        } finally {
            setLoading(false);
        }
    };

    // Função auxiliar para formatar visualizações (ex: 2.2M)
    const formatViews = (views) => {
        if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
        if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
        return views;
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>🎥 YouTube Clone Interface</h1>
            
            <form onSubmit={handleSearch} style={{ marginBottom: '30px' }}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Pesquisar vídeos..."
                    style={{ padding: '10px', width: '80%', marginRight: '10px' }}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Buscando...' : 'Buscar'}
                </button>
            </form>

            {error && <p style={{ color: 'red' }}>Erro: {error}</p>}

            {/* Módulo Player */}
            <div className="main-player" style={{ marginBottom: '20px' }}>
                <YouTubePlayer videoId={currentVideo?.videoId} />
            </div>

            {/* Metadados do Vídeo */}
            {currentVideo && (
                <div className="video-metadata">
                    <h2>{currentVideo.title}</h2>
                    <p>
                        **Canal:** {currentVideo.channel} | **Visualizações:** {formatViews(currentVideo.views)}
                    </p>
                    {/* Exibe o link de download, se existir, com o devido aviso */}
                    {currentVideo.downloadUrl && (
                        <p style={{ color: '#888', fontSize: '0.9em' }}>
                            * Link de Download direto: <a href={currentVideo.downloadUrl} target="_blank" rel="noopener noreferrer">MP4</a> (Use com cautela e sob sua responsabilidade, devido a direitos autorais).
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
