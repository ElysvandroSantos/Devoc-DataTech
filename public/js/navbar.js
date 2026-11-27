function usuarioLogado() {
  return Boolean(
    sessionStorage.ID_USUARIO ||
    sessionStorage.EMAIL_USUARIO ||
    sessionStorage.NOME_USUARIO
  );
}

function sair() {
  sessionStorage.clear();
  window.location.replace('/index.html');
}

// Mostra ou esconde os botões do navbar 
function atualizarNavbar() {
  const entrar = document.getElementById('get_entrar');
  const cadastro = document.getElementById('get_cadastro');
  const botaoSair = document.getElementById('btn_sair');

  //validação dos elementos
  if (!entrar || !cadastro || !botaoSair) {
    console.warn('Navbar: faltam os ids get_entrar, get_cadastro ou btn_sair no HTML');
    return;
  }

  const logado = usuarioLogado();

  // 'none' esconde; '' (vazio) devolve o visual normal definido pelo CSS
  entrar.style.display = logado ? 'none' : '';
  cadastro.style.display = logado ? 'none' : '';
  botaoSair.style.display = logado ? '' : 'none';
}

atualizarNavbar();
