// Este arquivo é para futuras interações, como um comparador de zoom.
document.addEventListener('DOMContentLoaded', () => {
    console.log("Site da Câmera Carregado!");
    
    // Exemplo: Adicionar um efeito de clique ao botão CTA
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            // Rolar suavemente até a seção de demonstração
            e.preventDefault();
            document.querySelector('#demo').scrollIntoView({ behavior: 'smooth' });
        });
    }
});
