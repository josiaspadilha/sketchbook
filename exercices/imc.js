'strict mode';

/*
O cálculo do IMC é baseado na fórmula:
IMC = _______(peso em kg)_______
      (altura em cm / 100) ** 2

Para crianças e adolescentes entre 5 e 19 anos, a classificação do estado nutricional é baseada no escore Z do IMC. A fórmula usada para chegar a esse índice é baseada no método LMS e foi tirada de um documento de instruções da OMS. Segue o link:

https://cdn.who.int/media/docs/default-source/child-growth/growth-reference-5-19-years/computation.pdf?sfvrsn=c2ff6a95_4
*/
/*
O gráfico suporta IMC de adultos com resultado entre 13 e 45 - 13 é o valor mínimo (0deg) e 45 é o valor máximo (180deg). 
- Para obter a posição da seta, o valor mínimo (13) é subtraído do valor do IMC;
- Então, os 180 graus são divididos em 32 partes iguais (ratio). O ratio representa a área abrangida entre o valor máximo (45) e o valor mínimo (13);
- Isso leva à fórmula: (imc - valMin) * 180 / (ratio);
*/

// O valor de `finalScore` varia entre -4 e 4, dividindo 180 graus em 8 partes iguais. Mas para a fórmula de `calcNeedlePosition` funcionar, o valor mínimo precisa ser positivo. Por isso, `finalZScore` e menor valor são acrescidos de 4.

const form = document.querySelector('.calc-form');
const heightEl = document.querySelector('#height');
const weightEl = document.querySelector('#weight');
const abdomenEl = document.querySelector('#abdomen');
const ageEl = document.querySelector('#age');
const biotypeEl = document.querySelector('#biotype');
const IMC = document.querySelector('#imc-result');
const classificationEl = document.querySelector('#classification');
const dial = document.querySelector('.dial');
const needle = document.querySelector('#needle');
const reset = document.querySelector('button[type="reset"]');

// Container de resultados que estão com visibility hidden
const summaryResults = document.querySelector('.summary-results');
const adultDataLegend = document.querySelector('.adults-info-legend');
const adultDataCarousel = document.querySelector('.adults-info-carousel');
const childrenDataLegend = document.querySelector('.children-info-legend');
const childrenDataCarousel = document.querySelector('.children-info-carousel');

// Tabela LMS para meninos de 5 a 19 anos
const lmsBoys = {
  5: [-0.7387, 15.2641, 0.0839],
  6: [-0.9921, 15.3062, 0.08682],
  7: [-1.246, 15.4832, 0.09068],
  8: [-1.4629, 15.7368, 0.09526],
  9: [-1.6318, 16.049, 0.10038],
  10: [-1.7407, 16.4433, 0.10566],
  11: [-1.7862, 16.9392, 0.1107],
  12: [-1.7751, 17.5334, 0.11522],
  13: [-1.7168, 18.233, 0.11898],
  14: [-1.6211, 19.005, 0.12191],
  15: [-1.4961, 19.7744, 0.12412],
  16: [-1.3529, 20.4951, 0.12579],
  17: [-1.1962, 21.1423, 0.12715],
  18: [-1.026, 21.7077, 0.12836],
  19: [-0.8419, 22.1883, 0.12948],
};

// Tabela LMS para meninas de 5 a 19 anos
const lmsGirls = {
  5: [-0.8886, 15.2441, 0.09692],
  6: [-1.0794, 15.2697, 0.10195],
  7: [-1.2565, 15.4036, 0.10746],
  8: [-1.388, 15.681, 0.11291],
  9: [-1.465, 16.0964, 0.11816],
  10: [-1.4864, 16.6133, 0.12307],
  11: [-1.4606, 17.2459, 0.12748],
  12: [-1.4006, 17.9966, 0.13129],
  13: [-1.3195, 18.8012, 0.13445],
  14: [-1.2266, 19.5647, 0.137],
  15: [-1.1311, 20.2125, 0.13904],
  16: [-1.0368, 20.7008, 0.1407],
  17: [-0.9423, 21.0367, 0.14208],
  18: [-0.8462, 21.2603, 0.1433],
  19: [-0.7496, 21.4269, 0.14441],
};

// Reset
reset.addEventListener('click', () => {
  needle.style.transform = 'translate(-100%, 0) rotate(0deg)';
  classificationEl.textContent = '';
  classificationEl.style.backgroundColor = '';
  IMC.textContent = '';
});

// Revela container escondido com os resultados ao submeter dados
function revealResults(show1, show2, hide1, hide2) {
  summaryResults.classList.add('show');
  show1.classList.add('show');
  show2.classList.add('show');
  hide1.classList.remove('show');
  hide2.classList.remove('show');
}

// Exibir classificação de acordo com resultado do IMC
function displayIMC(imc, isAdult, imcValue, needlePosition) {
  // Mapeamento das faixas de IMC e suas respectivas classificações e cores
  const classAdult = [
    { max: 17, text: 'Muito abaixo do peso', color: 'var(--orange)' },
    { max: 18.5, text: 'Abaixo do peso', color: 'var(--yellow)' },
    { max: 25, text: 'Peso desejável', color: 'var(--green)' },
    { max: 30, text: 'Sobrepeso', color: 'var(--yellow)' },
    { max: 35, text: 'Obesidade grau I', color: 'var(--orange)' },
    { max: 40, text: 'Obesidade grau II (severa)', color: 'var(--light-red)' },
    {
      max: Infinity,
      text: 'Obesidade grau III (mórbida)',
      color: 'var(--dark-red)',
    },
  ];

  const classChild = [
    { max: -3, text: 'Muito abaixo do peso', color: 'var(--light-red)' },
    { max: -2, text: 'Abaixo do peso', color: 'var(--yellow)' },
    { max: 1, text: 'Peso desejável', color: 'var(--green)' },
    { max: 2, text: 'Sobrepeso', color: 'var(--yellow)' },
    { max: Infinity, text: 'Obesidade', color: 'var(--light-red)' },
  ];

  let classification;

  if (isAdult) {
    classification = classAdult.find(c => imc < c.max);
  } else {
    classification = classChild.find(c => imc < c.max);
  }

  // Atualiza as informações do gráfico
  if (classification) {
    classificationEl.textContent = classification.text;
    classificationEl.style.backgroundColor = classification.color;
    IMC.textContent = imcValue;
    needle.style.transform = needlePosition;
  }
}

// Calcula a direção da seta no gráfico
function calcNeedlePosition(imc, valMin, ratio) {
  const needlePosition = ((imc - valMin) * 180) / ratio;

  if (needlePosition > 180) {
    return 180;
  } else if (needlePosition < 0) {
    return 0;
  } else {
    return needlePosition;
  }
}

// Validação dos dados inseridos no formulário
function validateNumbers(value, element, minValue) {
  if (value < minValue || isNaN(value)) {
    element.style.border = '1.5px solid var(--error-color)';
    return false;
  } else {
    element.style.border = '';
    return true;
  }
}

// Detecta quando o botão submit é pressionado no formulário
form.addEventListener('submit', e => {
  e.preventDefault();

  const height = parseInt(heightEl.value);
  const weight = parseFloat(weightEl.value.replace(',', '.'));
  const abdomen = parseFloat(abdomenEl.value.replace(',', '.'));
  const age = parseInt(ageEl.value);
  const maleOrFemale = biotypeEl.checked;

  let isValid = true;

  // Chama a função de validação dos dados
  isValid = validateNumbers(height, heightEl, 1);
  isValid = validateNumbers(weight, weightEl, 1);
  isValid = validateNumbers(abdomen, abdomenEl, 1);
  isValid = validateNumbers(age, ageEl, 5);

  if (isValid) {
    // Cálculo do IMC
    const calcIMC = weight / (height / 100) ** 2;

    if (age > 19) {
      // Gira o gráfico para exibir o mostrador para adultos
      dial.style.transform = 'rotate(-90deg)';

      // Chama função que converte o resultado em um ângulo entre 0 e 180 graus
      const needlePosition = calcNeedlePosition(calcIMC, 13, 45 - 13);

      displayIMC(
        calcIMC,
        true,
        `Seu IMC é: ${calcIMC.replace('.', ',')}`,
        `translate(-100%, 0) rotate(${needlePosition}deg)`
      );

      revealResults(
        adultDataLegend,
        adultDataCarousel,
        childrenDataLegend,
        childrenDataCarousel
      );
    } else {
      // Gira o gráfico para exibir o mostrador para crianças e adolescentes
      dial.style.transform = 'rotate(90deg)';
      revealResults(
        childrenDataLegend,
        childrenDataCarousel,
        adultDataLegend,
        adultDataCarousel
      );

      // Cálculo do escore Z para 19 anos ou menos
      function finalScoreAndBiotype(lms) {
        const [l, m, s] = lms[age];

        // Escore Z inicial
        const zScore = ((calcIMC / m) ** l - 1) / (s * l);

        // Ajuste do desvio padrão em valores < -3 ou > 3
        function zScoreAdjustment(x, y) {
          const sd3 = m * (1 + l * s * x) ** (1 / l);

          const sd2 = m * (1 + l * s * y) ** (1 / l);

          if (x > 0) {
            const sd23 = sd3 - sd2;
            return (x + (calcIMC - sd3)) / sd23;
          } else {
            const sd23 = sd2 - sd3;
            return (x + (calcIMC - sd3)) / sd23;
          }
        }

        // Escore Z final
        const finalZScore = () => {
          if (zScore > 3) {
            return zScoreAdjustment(3, 2);
          } else if (zScore < -3) {
            return zScoreAdjustment(-3, -2);
          } else {
            return zScore;
          }
        };

        // Chama função que converte o resultado em um ângulo entre 0 e 180 graus
        const needlePosition = calcNeedlePosition(finalZScore() + 4, 0, 8);

        displayIMC(
          finalZScore(),
          false,
          `Seu escore Z é: ${finalZScore().toFixed(2).replace('.', ',')}`,
          `translate(-100%, 0) rotate(${needlePosition}deg)`
        );
      }

      // Identifica o sexo da criança para extrair os dados corretos
      if (maleOrFemale) {
        finalScoreAndBiotype(lmsGirls);
      } else {
        finalScoreAndBiotype(lmsBoys);
      }
    }
  }
});

// Carrossel com cards informativos sobre cada índice IMC
const carouselContainer = document.querySelector('.cards-container');
const cards = document.querySelectorAll('.info-cards');
const cardsNav = document.querySelectorAll('.legend-list');
const cardHeight = 20.5;

// Adiciona ouvinte de evento a cada item de navegação
cardsNav.forEach((navLink, i) => {
  navLink.addEventListener('click', () => {
    // Cria o movimento do carrosel para o card clicado
    carouselContainer.style.transform = `translateY(${i * -cardHeight}rem)`;
    carouselContainer.style.transition = `transform 1s ease`;

    // Aplica estilos para destacar o card selecionado
    cards.forEach(function (card, index) {
      if (i === index) {
        card.style.transform = `scale(1)`;
        card.style.opacity = 1;
      } else {
        card.style.transform = `scale(0.5)`;
        card.style.opacity = 0;
      }
    });
  });
});
