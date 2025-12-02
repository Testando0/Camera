// --- CONFIGURAÇÕES GLOBAIS ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameSpeed = 4; // Velocidade base de movimento

let keys = {};
let score = 0;

// --- OBJETOS DO JOGO ---

// O Jogador (Personagem)
const player = {
    x: 50,
    y: 50,
    size: 20,
    color: 'blue',
    isInCar: false
};

// O Carro (Objeto Roubável)
const car = {
    x: 300,
    y: 300,
    width: 60,
    height: 30,
    color: 'red',
    speed: 6 // Carro é mais rápido
};

// --- FUNÇÕES DE CONTROLE ---

// 1. Entrada do Usuário (Teclas W, A, S, D e E)
document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

// 2. Lógica de Atualização (Movimento e Interações)
function updateGame() {
    // --- Movimento do Personagem/Carro ---
    let currentSpeed = player.isInCar ? car.speed : gameSpeed;
    let target = player.isInCar ? car : player;

    if (keys['w']) target.y -= currentSpeed;
    if (keys['s']) target.y += currentSpeed;
    if (keys['a']) target.x -= currentSpeed;
    if (keys['d']) target.x += currentSpeed;

    // --- Interação com o Carro (Tecla E) ---
    if (keys['e']) {
        // Verifica se o personagem está perto do carro
        const distance = Math.hypot(player.x - car.x, player.y - car.y);
        
        if (distance < 50) {
            // Entrar/Sair do carro
            player.isInCar = !player.isInCar;
            
            if (player.isInCar) {
                // Ao entrar, o jogador fica "escondido" no centro do carro
                player.x = car.x + car.width / 2;
                player.y = car.y + car.height / 2;
            } else {
                // Ao sair, o jogador fica ao lado do carro
                player.x = car.x + car.width; 
                player.y = car.y;
            }
            // Impede o loop da tecla E
            keys['e'] = false; 
        }
    }
    
    // Atualiza a posição do personagem quando está no carro
    if(player.isInCar) {
        player.x = car.x + car.width / 2;
        player.y = car.y + car.height / 2;
    }

    // --- Exemplo de Pontuação (Simples) ---
    // Ganha pontos por movimento quando está no carro (simulando caos)
    if (player.isInCar && (keys['w'] || keys['s'] || keys['a'] || keys['d'])) {
        score += 1;
        scoreDisplay.innerText = score;
    }
}

// 3. Função de Desenho (Renderização do Canvas)
function drawGame() {
    // Limpa o canvas a cada frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha o Carro
    ctx.fillStyle = car.color;
    ctx.fillRect(car.x, car.y, car.width, car.height);
    
    // Desenha as rodas (melhora o visual)
    ctx.fillStyle = '#111';
    ctx.fillRect(car.x + 5, car.y - 3, 5, 3);
    ctx.fillRect(car.x + car.width - 10, car.y - 3, 5, 3);
    ctx.fillRect(car.x + 5, car.y + car.height, 5, 3);
    ctx.fillRect(car.x + car.width - 10, car.y + car.height, 5, 3);


    // Desenha o Personagem
    if (!player.isInCar) {
        ctx.fillStyle = player.color;
        ctx.beginPath();
        // Desenha um círculo para representar o personagem
        ctx.arc(player.x, player.y, player.size / 2, 0, Math.PI * 2); 
        ctx.fill();
    } else {
        // Se estiver no carro, desenha a cabeça ou sinal de controle
        ctx.fillStyle = 'yellow';
        ctx.fillText('🚗', car.x + car.width / 2 - 5, car.y + car.height / 2 + 5);
    }
}

// 4. O Loop Principal do Jogo
function gameLoop() {
    updateGame(); // Atualiza a lógica (movimento, colisões, etc.)
    drawGame();   // Desenha os objetos no Canvas
    requestAnimationFrame(gameLoop); // Pede o próximo frame
}

// --- INICIALIZAÇÃO ---
gameLoop(); // Inicia o motor do jogo
