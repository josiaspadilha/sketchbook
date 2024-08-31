'use strict';

const openModal = document.querySelector('.open-modal');
const closeModal = document.querySelector('.close-modal');
const overlay = document.querySelector('.overlay');
const modal = document.querySelector('.modal');

const openCloseModal = () => {
  overlay.classList.toggle('hidden');
  modal.classList.toggle('hidden');
};

openModal.addEventListener('click', function () {
  openCloseModal();
});

closeModal.addEventListener('click', function () {
  openCloseModal();
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    openCloseModal();
  }
});
