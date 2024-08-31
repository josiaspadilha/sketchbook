'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.carousel');
  const totalSlides = document.querySelectorAll('.carousel-slides').length;
  const slideButtons = document.querySelectorAll('.carousel-nav .slides');
  let index = 0;

  // Função para ir a um slide específico
  function goToSlide(newIndex) {
    index = newIndex;
    carousel.style.transform = `translateX(-${index * 100}%)`;
    slideButtonActive(); // Atualiza a classe ativa dos botões de navegação
  }

  // Atualiza os botões de navegação
  function slideButtonActive() {
    slideButtons.forEach((slide, i) => {
      slide.classList.toggle('current-slide', i === index);
    });
  }

  // Função para ir ao próximo slide
  function nextSlide() {
    index = (index + 1) % totalSlides;
    goToSlide(index);
  }

  // Mudar slide ao clicar nos elementos de paginação
  slideButtons.forEach((slide, i) => {
    slide.addEventListener('click', () => {
      goToSlide(i);
    });
  });

  // Inicializa o carrossel com o slide e botão ativo correto
  slideButtonActive();

  // Inicia a troca automática de slides
  let intervalId = setInterval(nextSlide, 5000);
});

// Botão de exibir mais imagens no final da galeria
document.querySelector('.load-more').addEventListener('click', () => {
  document.querySelector('.load-more-overlay').classList.add('hidden');
});
