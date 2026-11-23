

// mude de var() para o codigo da cor
const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();


function setTexto(id, texto) {
  const el = document.getElementById(id);
  if (!el) {
    console.warn(`Elemento #${id} não encontrado no HTML`);
    return;
  }
  el.textContent = texto;
}

// Trocar dados (depois virão do banco) 

const santos = ['São Bento', 'São Paulo', 'N. Sra. Aparecida'];
const acertos = [3, 2, 2];
const MAXIMO = 3;                       
const quizzesConcluidos = 1;

const respostasCertas = 756;
const respostasTotal = 1080;

const totalAcertos = acertos.reduce((soma, n) => soma + n, 0);   // 7
const totalPerguntas = santos.length * MAXIMO;                     // 9
const porcentagem = Math.round((totalAcertos / totalPerguntas) * 100); // 78

const quizzesFeitos = respostasTotal / totalPerguntas;            // 120
const mediaPorQuiz = respostasCertas / quizzesFeitos;            // 6.3
const mediaPercent = Math.round((respostasCertas / respostasTotal) * 100); // 70

// Kpis 

setTexto('resultado-numero',  `${totalAcertos} de ${totalPerguntas}`);
setTexto('resultado-detalhe', `acertos no quiz · ${porcentagem}%`);

setTexto('quiz-numero',  quizzesConcluidos);
setTexto('quiz-detalhe', quizzesConcluidos === 1 ? 'uma tentativa completa' : 'tentativas completas');

setTexto('media-numero',  `${mediaPercent}%`);
setTexto('media-detalhe',
  `${mediaPorQuiz.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}/${totalPerguntas} por quiz · ${respostasCertas}/${respostasTotal} respostas`);

setTexto('nota-grafico',
  `São ${totalAcertos} acertos em ${totalPerguntas} perguntas. Este resultado registra conhecimento sobre as histórias, não mede sua fé.`);


const cores = [
  css('--Marrom-claro'),     // São Bento
  css('--Vermelho-vinho'),   // São Paulo
  css('--Azul-profundo'),    // Aparecida
];

// texto do grafico
const rotulosAcima = {
  id: 'rotulosAcima',
  afterDatasetsDraw(chart) {
    const { ctx, chartArea: { left, right } } = chart;
    const barras = chart.getDatasetMeta(1).data;   // dataset 1 = barras coloridas
    ctx.save();
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = css('--Cinza-escuro');
    barras.forEach((barra, i) => {
      const y = barra.y - barra.height / 2 - 6;
      ctx.font = '14px Lato, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(santos[i], left, y);
      ctx.font = '700 14px Lato, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${acertos[i]}/${MAXIMO}`, right, y);
    });
    ctx.restore();
  }
};

new Chart(document.getElementById('graficojs'), {
  type: 'bar',
  data: {
    labels: santos,
    datasets: [
      {   // 0: trilha clara de fundo (sempre MAXIMO)
        label: 'Máximo',
        data: santos.map(() => MAXIMO),
        backgroundColor: css('--Azul-claro'),
        grouped: false,
        order: 2,
        barThickness: 14,
        borderRadius: 2,
      },
      {   // 1: acertos reais
        label: 'Acertos',
        data: acertos,
        backgroundColor: cores,
        grouped: false,
        order: 1,
        barThickness: 14,
        borderRadius: 2,
      }
    ]
  },
  options: {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 20 } },
    scales: {
      x: {
        min: 0,
        max: MAXIMO,
        ticks: { stepSize: 1, color: css('--Cinza-medio') },
        grid: { display: false },
        border: { display: false },
        title: {
          display: true,
          text: `Acertos · de 0 a ${MAXIMO} questões por santo`,
          align: 'start',
          color: css('--Cinza-medio'),
          font: { size: 12 }
        }
      },
      y: { display: false }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        filter: (item) => item.datasetIndex === 1,
        callbacks: {
          label: (item) => `${item.raw} de ${MAXIMO} acertos`
        }
      }
    }
  },
  plugins: [rotulosAcima]
});