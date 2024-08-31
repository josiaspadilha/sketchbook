'strict mode';

const form = document.querySelector('.calc-form');
const height = document.querySelector('#height');
const weight = document.querySelector('#weight');
const calcResult = document.querySelector('#imc-result');
const needleGauge = document.querySelector('#needle');
const classification = document.querySelector('#classification');
const reset = document.querySelector('button[type="reset"]');

const imcZBoys = {
  5: [12.1, 13.0, 14.1, 15.3, 16.6, 18.3, 20.2],
  6: [12.1, 13.0, 14.1, 15.3, 16.8, 18.5, 20.7],
  7: [12.3, 13.1, 14.2, 15.5, 17.0, 19.0, 21.6],
  8: [12.4, 13.3, 14.4, 15.7, 17.4, 19.7, 22.8],
  9: [12.6, 13.5, 14.6, 16.0, 17.9, 20.5, 24.3],
  10: [12.8, 13.7, 14.9, 16.4, 18.5, 21.4, 26.1],
  11: [13.1, 14.1, 15.3, 16.9, 19.2, 22.5, 28.0],
  12: [13.4, 14.5, 15.8, 17.5, 19.9, 23.6, 30.0],
  13: [13.8, 14.9, 16.4, 18.2, 20.8, 24.8, 31.7],
  14: [14.3, 15.5, 17.0, 19.0, 21.8, 25.9, 33.1],
  15: [14.7, 16.0, 17.6, 19.8, 22.7, 27.0, 34.1],
  16: [15.1, 16.5, 18.2, 20.5, 23.5, 27.9, 34.8],
  17: [15.3, 16.8, 18.6, 20.9, 24.0, 28.3, 35.0],
  18: [15.7, 17.3, 19.2, 21.7, 24.9, 29.2, 35.4],
  19: [15.9, 17.6, 19.6, 22.2, 25.4, 29.7, 35.5],
};
const imcZGirls = {
  5: [11.8, 12.7, 13.9, 15.2, 16.9, 18.9, 21.3],
  6: [11.7, 12.7, 13.9, 15.3, 17.0, 19.2, 22.1],
  7: [11.8, 12.7, 13.9, 15.4, 17.3, 19.8, 23.3],
  8: [11.9, 12.9, 14.1, 15.7, 17.7, 20.6, 24.8],
  9: [12.1, 13.1, 14.4, 16.1, 18.3, 21.5, 26.5],
  10: [12.4, 13.5, 14.8, 16.6, 19.0, 22.6, 28.4],
  11: [12.7, 13.9, 15.3, 17.2, 19.9, 23.7, 30.2],
  12: [13.2, 14.4, 16.0, 18.0, 20.8, 25.0, 31.9],
  13: [13.6, 14.9, 16.6, 18.8, 21.8, 26.2, 33.4],
  14: [14.0, 15.4, 17.2, 19.6, 22.7, 27.3, 34.7],
  15: [14.4, 15.9, 17.8, 20.2, 23.5, 28.2, 35.5],
  16: [14.6, 16.2, 18.2, 20.7, 24.1, 28.9, 36.1],
  17: [14.7, 16.4, 18.4, 21.0, 24.5, 29.3, 36.3],
  18: [14.7, 16.4, 18.6, 21.3, 24.8, 29.5, 36.3],
  19: [14.7, 16.5, 18.7, 21.4, 25.0, 29.7, 36.2],
};

// Reset
reset.addEventListener('click', () => {
  needleGauge.style.transform = 'translate(-100%, 0) rotate(0deg)';
  classification.textContent = '';
  classification.style.backgroundColor = '';
});

// Função para calcular IMC
const calc = (height, weight) => {
  const h = parseFloat(height.value / 100);
  console.log(h);
  const w = parseFloat(weight.value.replace(',', '.'));
  return (w / (h * h)).toFixed(2);
};

// Representação gráfica do resultado

/*
O diagrama suporta IMC com resultados entre 13 e 45. Então, 13 é o valor mínimo (0deg) e 45 é o valor máximo (180deg). 
- Para obter um índice, subtraia o valor mínimo (13) do valor do IMC;
- Esse valor deve ser representado num gráfico de 0 a 180 graus. Para isso, divida 180 por 32, que é a diferença entre o valor máximo (45) e o valor mínimo (13);
- Chegamos a fórmula: (imc - 13) * 180 / (45 - 13)
- Ou, simplificando: (imc - 13) * 5.625
*/

function diagram(imc) {
  return (imc - 13) * 5.625;
}

// Exibir classificação de acordo com resultado do IMC
function imcCategory(imc) {
  if (imc < 17) {
    classification.textContent = 'Muito abaixo do peso';
    classification.style.backgroundColor = '#f4a261';
  } else if (imc < 18.5) {
    classification.textContent = 'Abaixo do peso';
    classification.style.backgroundColor = '#e9c46a';
  } else if (imc < 25) {
    classification.textContent = 'Peso desejável';
    classification.style.color = '#2a9d8f';
  } else if (imc < 30) {
    classification.textContent = 'Sobrepeso';
    classification.style.backgroundColor = '#e9c46a';
  } else if (imc < 35) {
    classification.textContent = 'Obesidade grau I';
    classification.style.backgroundColor = '#f4a261';
  } else if (imc < 40) {
    classification.textContent = 'Obesidade grau II (severa)';
    classification.style.backgroundColor = '#e76f51';
  } else {
    classification.textContent = 'Obesidade grau III (mórbida)';
    classification.style.backgroundColor = '#bc4749';
  }
}

function displayCalcResult(result, style, needle, category, background) {
  calcResult.textContent = result;
  calcResult.style.fontStyle = style;
  needleGauge.style.transform = needle;
}

// Detecta quando botão submit é pressionado
form.addEventListener('submit', e => {
  e.preventDefault();

  const calcResult = calc(height, weight);
  imcCategory(calcResult);

  if (isNaN(calcResult)) {
    displayCalcResult(
      `Dados incorretos`,
      'italic',
      'translate(-100%, 0) rotate(0deg)'
    );
  } else {
    displayCalcResult(
      `IMC igual a ${calcResult.replace('.', ',')}`,
      '',
      `translate(-100%, 0) rotate(${diagram(calcResult)}deg)`
    );
  }
});
