const idUsuario = sessionStorage.ID_USUARIO;


if (!idUsuario) {
  window.location = './login.html';   // sem login, sem acesso
}

function setTexto(id, texto) {
  const el = document.getElementById(id);
  if (!el) {
    console.warn('Elemento #' + id + ' não encontrado no HTML');
    return;
  }
  el.textContent = texto;
}

function setAtributo(id, atributo, valor) {
  const el = document.getElementById(id);
  if (!el) {
    console.warn('Elemento #' + id + ' não encontrado no HTML');
    return;
  }
  el.setAttribute(atributo, valor);
}


const percentual = (valor, total) =>
  ((valor / total || 0) * 100).toFixed(2).replace('.', ',') + '%';

// Transforma os dados que vem do banco
function formatarData(texto) {
  const data = new Date(texto);
  const mes = data.toLocaleDateString('pt-BR', { month: 'short' });
  return data.getDate() + ' ' + mes + ' ' + data.getFullYear();
}






const cores = [
  '#8B6B4A',
  '#7A1F2B',
  '#090333'
];

// KPIs)
function montarCards(dados) {

 
  if (dados.ultimo == null) {
    setTexto('resultado-numero', '—');
    setTexto('resultado-detalhe', 'faça o quiz para ver seu resultado');
    setTexto('data-tentativa', 'Nenhuma tentativa concluída');
  } else {
    const porcentagem = Math.round(dados.ultimo.acertos / dados.ultimo.total * 100);
    setTexto('resultado-numero', dados.ultimo.acertos + ' de ' + dados.ultimo.total);
    setTexto('resultado-detalhe', 'acertos no quiz · ' + porcentagem + '%');
    setTexto('data-tentativa', 'Última tentativa · ' + formatarData(dados.ultimo.dataFim));
  }
 
  // Card 2
  setTexto('quiz-numero', dados.quizzesConcluidos);
  setTexto('quiz-detalhe', dados.quizzesConcluidos === 1 ? 'uma tentativa completa' : 'tentativas completas');

  // Card 3 (todos os usuários)
  const media = dados.media;
  if (media.totalQuizzes == 0) {
    setTexto('media-numero', '0%');
    setTexto('media-detalhe', ' não há nenhum quiz feito');
  } else {
    const mediaPercent = (media.respostasCertas / media.respostasTotal * 100).toFixed(2);
    const mediaPorQuiz = media.respostasCertas / media.totalQuizzes;
    const perguntasPorQuiz = media.respostasTotal / media.totalQuizzes;

    setTexto('media-numero', mediaPercent + '%');
    setTexto('media-detalhe',
      mediaPorQuiz.toFixed(1).replace('.', ',') + '/' + perguntasPorQuiz +
      ' por quiz · ' + media.respostasCertas + '/' + (media.respostasTotal) + ' respostas');
  }
}


// ---------- 5. GRÁFICOS E HISTÓRIAS ----------
// "dados" é o JSON que o servidor devolveu em /dashboard/ID:
// { santos: [ {nomeCurto, acertos, maximo, ...} ], historias: [ ... ] }
function montarGraficos(dados) {
  const temResultados = dados.santos.length > 0;
  document.getElementById('aviso-barras').style.display = temResultados ? 'none' : 'flex';
  document.getElementById('aviso-pizza').style.display = temResultados ? 'none' : 'flex';
  // Usuário que ainda não concluiu nenhum quiz
  if (dados.santos.length == 0) {
    setTexto('nota-grafico', 'Você ainda não concluiu o quiz. Responda ao quiz para ver seus resultados aqui.');
    return;
  }

  // Monta os arrays que os gráficos usam, a partir do que veio do servidor
  const santos = [];
  const acertos = [];
  let totalAcertos = 0;

  for (let i = 0; i < dados.santos.length; i++) {
    santos.push(dados.santos[i].nomeCurto);
    acertos.push(dados.santos[i].acertos);
    totalAcertos = totalAcertos + dados.santos[i].acertos;
  }

  const MAXIMO = dados.santos[0].maximo;            // perguntas por santo
  const totalPerguntas = santos.length * MAXIMO;

  setTexto('nota-grafico',
    'São ' + totalAcertos + ' acertos em ' + totalPerguntas +
    ' perguntas. Este resultado registra conhecimento sobre as histórias, não mede sua fé.');


  // ----- Gráfico de barras -----

  // Escreve o nome (esquerda) e "3/3" (direita) acima de cada barra.
  const textosDasBarras = {
    id: 'textosDasBarras',
    afterDatasetsDraw(grafico) {
      const pincel = grafico.ctx;
      const barras = grafico.getDatasetMeta(1).data;
      const esquerda = grafico.chartArea.left;
      const direita = grafico.chartArea.right;

      pincel.save();
      pincel.fillStyle = '#222222';
      pincel.textBaseline = 'bottom';

      for (let i = 0; i < barras.length; i++) {
        const y = barras[i].y - 13;

        pincel.font = '14px Lato, sans-serif';
        pincel.textAlign = 'left';
        pincel.fillText(santos[i], esquerda, y);

        pincel.font = '700 14px Lato, sans-serif';
        pincel.textAlign = 'right';
        pincel.fillText(acertos[i] + '/' + MAXIMO, direita, y);
      }

      pincel.restore();
    }
  };

  new Chart(document.getElementById('graficojs'), {
    type: 'bar',
    data: {
      labels: santos,
      datasets: [{   
          label: 'Máximo',
          data: [MAXIMO, MAXIMO, MAXIMO],
          backgroundColor: '#E6ECF5',
          grouped: false,
          order: 2,
          barThickness: 14,
          borderRadius: 2
        },
        {
          label: 'Acertos',
          data: acertos,
          backgroundColor: cores,
          grouped: false,
          order: 1,
          barThickness: 14,
          borderRadius: 2
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
          ticks: { stepSize: 1, color: '#6B6B6B' },
          grid: { display: false },
          border: { display: false }
        },
        y: { display: false }
      },
      plugins: {
        legend: { display: false }
      }
    },
    plugins: [textosDasBarras]
  });

  setTexto('eixo-texto', 'Acertos · de 0 a ' + MAXIMO + ' questões por santo');


  // pizza
const legenda = document.getElementById('pizza-legenda');
legenda.innerHTML = '';

for (let i = 0; i < acertos.length; i++) {
  legenda.insertAdjacentHTML('beforeend', `
    <div class="pizza-item">
      <span class="pizza-ponto" style="background-color: ${cores[i]}"></span>
      <div class="pizza-info">
        <div class="pizza-nome">${santos[i]}</div>
        <div class="pizza-detalhe">${acertos[i]} de ${totalAcertos} acertos</div>
        <div class="pizza-percent">${percentual(acertos[i], totalAcertos)}</div>
      </div>
    </div>
  `);
}

  new Chart(document.getElementById('graficoPizza'), {
    type: 'pie',
    data: {
      labels: santos,
      datasets: [{
        data: acertos,
        backgroundColor: cores,
        borderColor: '#FFFFFF',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (item) => item.label + ': ' + item.raw + ' de ' + totalAcertos + ' acertos'
          }
        },
        datalabels: {
          color: '#FFFFFF',
          font: { weight: 'bold', size: 12 },
          formatter: (valor) => percentual(valor, totalAcertos)
        }
      }
    },
    plugins: []
  });


  // histórias
  for (let i = 0; i < dados.historias.length; i++) {
    const historia = dados.historias[i];

    setAtributo('historia-img-' + i, 'src', historia.imagem);
    setAtributo('historia-img-' + i, 'alt', historia.nomeCurto);
    setTexto('historia-meta-' + i, historia.nomeCurto + ' · ' + historia.acertos + ' de ' + historia.maximo + ' acertos');
    setTexto('historia-titulo-' + i, historia.titulo);
    setTexto('historia-desc-' + i, historia.descricao);
    setAtributo('historia-link-' + i, 'href', historia.link);
  }
}


//BUSCAR OS DADOS NO SERVIDOR 
if (idUsuario) {

  fetch('/kpis/' + idUsuario)
    .then(function (resposta) {
      if (!resposta.ok) {
        throw 'Houve um erro ao buscar os cards!';
      }
      return resposta.json();            
    })
    .then(function (dados) {
      montarCards(dados);
    })
    .catch(function (erro) {
      console.log('#ERRO: ' + erro);
    });

  fetch('/dashboard/' + idUsuario)
    .then(function (resposta) {
      if (!resposta.ok) {
        throw 'Houve um erro ao buscar os gráficos!';
      }
      return resposta.json();
    })
    .then(function (dados) {
      montarGraficos(dados);
    })
    .catch(function (erro) {
      console.log('#ERRO: ' + erro);
    });
}