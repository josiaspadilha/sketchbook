'use strict';

const form = document.querySelector('#form');
const cpf = document.querySelector('#cpf');
const fullName = document.querySelector('#full-name');
const fone = document.querySelector('#fone');
const email = document.querySelector('#email');
const emailConfirm = document.querySelector('#email-confirm');
const checkbox = document.querySelector('#agreement');
const submitBtn = document.querySelector('.btn-submit');

// Função para adicionar ou remover mensagem de input inválido
function invalidInput(isValid, messageElement) {
  if (isValid) {
    messageElement.classList.remove('invalid-input');
  } else {
    messageElement.classList.add('invalid-input');
  }
}

// Valida se nome completo contém pelo menos duas palavras
function validateName() {
  const arrFullName = fullName.value.trim().split(' ');
  const invalidMessage = document.querySelector('#invalid-full-name');
  const isValid = arrFullName.length >= 2;

  invalidInput(isValid, invalidMessage);
  return isValid;
}

// Valida se o telefone contém apenas números
function validateFone() {
  const input = fone.value.trim();
  const invalidMessage = document.querySelector('#invalid-fone');
  const isValid = /^\d+$/.test(input); // Regex para verificar se o input contém apenas dígitos

  invalidInput(isValid, invalidMessage);
  return isValid;
}

// Valida se os emails coincidem
function validateEmail() {
  const isValid = email.value.trim() === emailConfirm.value.trim();
  const invalidMessage = document.querySelector('#invalid-email');

  invalidInput(isValid, invalidMessage);
  return isValid;
}

// Função para limpar formulário após enviado
function clearForm() {
  cpf.value = '';
  fullName.value = '';
  fone.value = '';
  email.value = '';
  emailConfirm.value = '';
  checkbox.checked = false;
}

// Adicionando ouvintes de eventos
fullName.addEventListener('change', validateName);
fone.addEventListener('change', validateFone);
emailConfirm.addEventListener('change', validateEmail);

// Validação ao submeter o formulário também
form.addEventListener('submit', event => {
  const nameValid = validateName();
  const foneValid = validateFone();
  const emailValid = validateEmail();

  if (!nameValid || !foneValid || !emailValid || !checkbox.checked) {
    event.preventDefault(); // Impede o envio do formulário se a validação falhar
    console.log('O formulário não foi enviado devido a erros de validação.');
  } else {
    console.log('O formulário foi enviado com sucesso.');
    clearForm();
  }
});
