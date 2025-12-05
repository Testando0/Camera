// components/YouTubePlayer.js
import { useEffect, useRef, useState } from 'react';

const YouTubePlayer = ({ videoId }) => {
    const playerRef = useRef(null);
    const [player, setPlayer] = useState(null);

    // 1. Função para inicializar o player após o script do YouTube carregar
    const initializePlayer = () => {
        if (window.YT && playerRef.current) {
            const newPlayer = new window.YT.Player(playerRef.current, {
                videoId: videoId,
                playerVars: {
                    autoplay: 1, // Inicia automaticamente
                    controls: 1, // Mostra os controles
                    modestbranding: 1, // Oculta o logo do YouTube na barra de controle
                },
                events: {
                    onReady: (event) => event.target.playVideo(),
                },
            });
            setPlayer(newPlayer);
        }
    };

    // 2. Carrega o script da API do IFrame do YouTube uma única vez
    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            // O nome desta função é obrigatório pela API do YouTube
            window.onYouTubeIframeAPIReady = initializePlayer; 
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
            // Se o script já estiver carregado, apenas inicializa
            initializePlayer();
        }
        
        // Limpeza (opcional, mas boa prática)
        return () => {
            if (player) {
                player.destroy();
            }
        };
    }, []); // Array de dependência vazio garante que só executa uma vez

    // 3. Atualiza o player quando a videoId muda
    useEffect(() => {
        if (player && videoId) {
            // Se o player existir, apenas carrega o novo vídeo
            player.loadVideoById(videoId);
        }
    }, [videoId, player]);


    return (
        // O ref é usado para injetar a div de visualização do player
        <div 
            ref={playerRef} 
            id="youtube-player" 
            className="youtube-player-container"
            style={{ width: '100%', aspectRatio: '16/9' }} 
        >
            {!videoId && <p>Pesquise e selecione um vídeo.</p>}
        </div>
    );
};

export default YouTubePlayer;
