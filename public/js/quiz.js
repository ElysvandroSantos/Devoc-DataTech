const idUsuario = sessionStorage.getItem('ID_USUARIO');
    
  if (!idUsuario) {
  window.location = './login.html';   // sem login, sem acesso
}

// DADOS: 
  const santos = [
    { nome: "São Bento", img: "./assets/imgs/sao-bento.jpg" },
    { nome: "São Paulo", img: "./assets/imgs/slides02.png" },
    { nome: "Nossa Senhora Aparecida", img: "./assets/imgs/images (1).jfif" }
  ];
  const perguntas = [
    /* são bento = 0, sao paulo = 1, aparecida = 2 */
 {
/*santo*/    s: 0,
/*tema*/ t: "Origem",
/*questão*/q: "Qual é o nome da principal obra escrita por São Bento?",
/*opções*/ o: ["A Regra", "A Suma", "As Confissões", "O Cântico"],
/*alternativa*/ a: 0,
/*explicação*/ e: "A Regra de São Bento orienta a vida monástica até hoje."
    },

    {
      s: 0,
      t: "Origem",
      q: "Quem era a irmã gêmea de São Bento?",
      o: ["Santa Clara", "Santa Escolástica", "Santa Teresa", "Santa Mônica"],
      a: 1,
      e: "Santa Escolástica também seguiu a vida religiosa."
    },

    {
      s: 0,
      t: "Origem",
      q: "Qual lema resume a vida beneditina?",
      o: ["Ad maiorem Dei gloriam", "Pax et bonum", "Ora et labora", "Soli Deo gloria"],
      a: 2,
      e: "“Ora et labora” quer dizer “reza e trabalha”."
    },

    {
      s: 1,
      t: "Encontro e conversão",
      q: "Em qual caminho aconteceu a conversão de São Paulo?",
      o: ["No caminho de Damasco", "No caminho de Jerusalém", "No caminho de Roma", "No caminho de Belém"],
      a: 0,
      e: "Saulo seguia para Damasco quando se converteu."
    },

    {
      s: 1,
      t: "Nome",
      q: "Qual era o nome de São Paulo antes da conversão?",
      o: ["Simão", "Saulo", "Barnabé", "Silas"],
      a: 1,
      e: "Saulo de Tarso é o nome pelo qual era conhecido."
    },

    {
      s: 1,
      t: "Escritos",
      q: "Como são chamados os textos que Paulo enviou às comunidades?",
      o: ["Evangelhos", "Salmos", "Epístolas", "Profecias"],
      a: 2,
      e: "As epístolas ou cartas formam grande parte do Novo Testamento."
    },

    {
      s: 2,
      t: "Origem",
      q: "Em que rio a imagem foi encontrada, em 1717?",
      o: ["Rio Tietê", "Rio Paraíba do Sul", "Rio São Francisco", "Rio Paraná"],
      a: 1,
      e: "Pescadores encontraram a imagem no Paraíba do Sul."
    },

    {
      s: 2,
      t: "Devoção",
      q: "Em que dia se celebra Nossa Senhora Aparecida?",
      o: ["8 de dezembro", "15 de agosto", "12 de outubro", "1º de novembro"],
      a: 2,
      e: "Em 12 de outubro, feriado nacional no Brasil."
    },

    {
      s: 2,
      t: "Devoção",
      q: "Em qual cidade fica o santuário nacional?",
      o: ["Aparecida (SP)", "Salvador (BA)", "Belo Horizonte (MG)", "Rio de Janeiro (RJ)"],
      a: 0,
      e: "O santuário nacional fica em Aparecida, no interior de São Paulo."
    }
  ];
    console.log('Recebendo Dados');

  // 2) ESTADO: o que o quiz "lembra" a cada momento
  let atual = 0;          // pergunta atual
  let alter_marcada = null;        // alternativa marcada (ainda não confirmada)
  const answers = [];       // answers[i] = índice escolhido e confirmado

  const $ = id => document.getElementById(id);

  // 3) RENDER: desenha a tela a partir do estado
  function quiz() {
    if (atual >= perguntas.length) return quizResult();
    const q = perguntas[atual], done = answers[atual] !== undefined;
    const sel = done ? answers[atual] : alter_marcada;

    $("main").innerHTML = `
    <div class="top"><span>Pergunta ${atual + 1} de ${perguntas.length}</span>
      <button onclick="reinicio()">Sair do quiz</button></div>
    <div class="steps">${perguntas.map((_, i) => `
      <i class="${answers[i] !== undefined ? 'done' : i === atual ? 'now' : ''}"></i>`).join("")}</div>
    <div class="tag">${santos[q.s].nome.toUpperCase()} · ${q.t.toUpperCase()}</div>

    <h1>${q.q}</h1>

    <p class="hint">${done ? "Resposta confirmada." : "Selecione uma alternativa e confirme para continuar."}</p>
    <div class="opts" role="radiogroup" aria-label="Alternativas">
      ${q.o.map((t, i) => {
      let c = "opt";
      if (done) c += i === q.a ? " right" : i === sel ? " wrong" : "";
      else if (i === sel) c += " sel";
      return `<button class="${c}" role="radio" aria-checked="${i === sel}" ${done ? "disabled" : ""} onclick="ponto(${i})"><span class="dot"></span>${t}</button>`;
    }).join("")}
    </div>
    <div class="feedback" aria-live="polite">${done ? (sel === q.a ? `<b class="ok">Correto.</b> ` : `<b class="bad">Não foi dessa vez.</b> `) + q.e : ""}</div>
    <div class="actions">
      <button class="btn ghost" onclick="voltar()" ${atual === 0 ? "disabled" : ""}>Voltar</button>
      <button class="btn main" onclick="${done ? 'proximo()' : 'confirmar()'}" ${!done && alter_marcada === null ? "disabled" : ""}>
        ${done ? (atual === perguntas.length - 1 ? "Ver resultado" : "Próxima pergunta") : "Confirmar resposta"}</button>
    </div>
    <p class="foot">Este quiz é sobre conhecimento, não mede sua fé.</p>`;
    quizPath();
  };
  console.log('criação e configuração do quiz realizada');
  // 4) BARRA LATERAL: conta respondidas por história
  function quizPath() {
    $("path").innerHTML = santos.map((santo, si) => {
      const idx = perguntas.map((q, i) => q.s === si ? i : -1).filter(i => i >= 0);
      const n = idx.filter(i => answers[i] !== undefined).length;
      const active = atual < perguntas.length && perguntas[atual].s === si;
      const status = n === idx.length ? `Concluído · ${n} de ${idx.length} respondidas`
        : active ? `Em andamento · ${n} de ${idx.length} confirmadas` : `A seguir · ${n} de ${idx.length} respondidas`;
      return `<div class="story ${active ? 'now' : ''}"> <img class="qimagem" src="${santo.img}" alt="">
      <div class="info"> <b>${santo.nome}</b><span>${status}</span><span>Perguntas ${idx[0] + 1}–${idx[idx.length - 1] + 1}</span></div></div>`;
    }).join("");
  };
    console.log('estilização do quiz');

  // 5) AÇÕES
  function ponto(i) { alter_marcada = i; quiz(); }
  function confirmar() { answers[atual] = alter_marcada; alter_marcada = null; quiz(); }
  function proximo() { atual++; alter_marcada = null; quiz(); }
  function voltar() { if (atual > 0) { atual--; alter_marcada = null; quiz(); } }
  function reinicio() { atual = 0; alter_marcada = null; answers.length = 0; quiz(); }
  console.log('Recebendo funções do quiz');

  function quizResult() {
    
  if (idUsuario) {
    
  const respostasServer = answers.map((resposta, i) => ({
    santo: perguntas[i].s + 1,
    numero: i + 1,
    acertou: resposta === perguntas[i].a ? 1 : 0
  }));

  fetch('/quiz/salvar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      idUsuarioServer: Number(idUsuario),
      respostasServer
    })
  })
    .then(function (resposta) {
      if (!resposta.ok) {
        throw new Error('Falha ao salvar o quiz. HTTP ' + resposta.status);
      }
      return resposta.json();
    })
    .then(function (dados) {
      console.log('Quiz salvo:', dados.idQuiz);
    })
    .catch(function (erro) {
      console.error(erro);
    });
} else {
  console.error('Não há usuário logado; o resultado não foi salvo.');
}

    const hits = answers.filter((a, i) => a === perguntas[i].a).length;
    $("main").innerHTML = `<div class="result"> 
    <div class="tag">RESULTADO</div><h1>Você concluiu o percurso</h1>
    <div class="big">${hits} de ${perguntas.length}</div>
    ${santos.map((santo, si) => {
      const ids = perguntas.map((q, i) => q.s === si ? i : -1).filter(i => i >= 0);
      return `<div class="rline"><span>${santo.nome}</span><b>${ids.filter(i => answers[i] === perguntas[i].a).length} de ${ids.length}</b></div>`
    }).join("")}
    <p class="foot">Este quiz é sobre conhecimento, não mede sua fé.</p>
    <div class="actions" style="border:0;padding-top:12px"><span></span><button class="btn main" onclick="reinicio()">Refazer o quiz</button></div></div>`;
    quizPath();
    
    
  

   
  };



  console.log('Resultado do quiz mostrado');
  quiz();