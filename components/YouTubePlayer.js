// components/YouTubePlayer.js
import { useEffect, useRef, useState } from 'react';

const YouTubePlayer = ({ videoId }) => {
    // Usamos refs e state para garantir que o player seja carregado corretamente no DOM
    const playerRef = useRef(null);
    const [player, setPlayer] = useState(null);

    // Função para inicializar o player.
    const initializePlayer = () => {
        if (window.YT && playerRef.current) {
            // Cria a div que o player usará se ela não existir
            if (!document.getElementById(`Youtubeer-${videoId}`)) {
                 const div = document.createElement('div');
                 div.setAttribute('id', `Youtubeer-${videoId}`);
                 playerRef.current.appendChild(div);
            }
            
            // Instancia o player
            const newPlayer = new window.YT.Player(`Youtubeer-${videoId}`, {
                height: '390',
                width: '640',
                videoId: videoId,
                playerVars: { autoplay: 1, controls: 1, modestbranding: 1 },
                events: {
                    onReady: (event) => event.target.playVideo(),
                },
            });
            setPlayer(newPlayer);
        }
    };

    // Efeito para carregar o script da API do Player apenas uma vez
    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            window.onYouTubeIframeAPIReady = initializePlayer; 
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else if (videoId) {
            initializePlayer();
        }
    }, []);

    // Efeito para carregar um novo vídeo ID (videoId) quando ele muda
    useEffect(() => {
        if (player && videoId) {
            player.loadVideoById(videoId);
        }
    }, [videoId, player]);


    return (
        <div ref={playerRef} id="player-container" style={{ width: '100%', aspectRatio: '16/9' }}>
            {!videoId && <p>Pesquise um vídeo para começar.</p>}
        </div>
    );
};

export default YouTubePlayer;
