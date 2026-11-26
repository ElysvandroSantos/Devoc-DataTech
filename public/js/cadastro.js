
const fila = document.getElementById('fila');
const total = fila.children.length;
const largura = 456;
let atual = 0;

setInterval(() => {
    atual = (atual + 1) % total;
    fila.style.transition = 'transform 0.8s ease-in-out'
    fila.style.transform = `translatex(-${atual * largura}px)`;


    if (atual === total - 1) {
        setTimeout(() => {
            fila.style.transition = 'none'
            fila.style.transform = `translatex(0)`;
            atual = 0;
        }, 800);
    }
}, 2500);


// VALIDAÇÃO CADASTRO


function mostrarErro(idCampo, idMsg, texto) {
    const campo = document.getElementById(idCampo);
    const msg = document.getElementById(idMsg);

    msg.textContent = texto;
    campo.classList.toggle('invalido', texto !== '');
}

// NOME
function validarNome() {
    const nome = document.getElementById('ipt_nome').value.trim();   // trim() tira espaços das pontas
    const ok = nome.length >= 3;

    mostrarErro('ipt_nome', 'msg_nome', ok ? '' : 'O nome deve ter pelo menos 3 caracteres.');
    return ok;
}

//E-MAIL
function validarEmail() {
    const email = document.getElementById('ipt_email').value.trim();
    const arroba = email.indexOf('@');        // posição do primeiro @ (-1 se não tiver)
    const ponto = email.lastIndexOf('.');     // posição do último ponto (-1 se não tiver)

    const ok =
        arroba > 0 &&                           // tem texto antes do @
        arroba === email.lastIndexOf('@') &&    // existe um @ só
        ponto > arroba + 1 &&                   // tem um ponto depois do @, com texto no meio
        ponto < email.length - 1 &&             // e tem texto depois do ponto
        !email.includes(' ');                   // sem espaços

    mostrarErro('ipt_email', 'msg_email', ok ? '' : 'Digite um e-mail válido, como nome@dominio.com.');
    return ok;
}

// SENHA
function validarSenha(aoEnviar) {
    const campo = document.getElementById('ipt_senha_hash');
    const aviso = document.getElementById('aviso_senha');
    const texto = document.getElementById('texto_senha');
    const senha = campo.value;

    //criterio 
    const tamanho = senha.length >= 8 && senha.length <= 25;
    const maiuscula = /\p{Lu}/u.test(senha);              // alguma letra maiúscula (aceita acento)
    const numero = /\d/.test(senha);                      // algum número de 0 a 9
    const simbolo = /[^\p{L}\p{N}\s]/u.test(senha);       // algo que NÃO é letra, número nem espaço

    // critério cumprido recebe ok (verde e riscado)
    document.getElementById('crit_tamanho').classList.toggle('ok', tamanho);
    document.getElementById('crit_maiuscula').classList.toggle('ok', maiuscula);
    document.getElementById('crit_numero').classList.toggle('ok', numero);
    document.getElementById('crit_simbolo').classList.toggle('ok', simbolo);

    // 3) Escolhe o estado da frase abaixo do campo: neutro, vermelho ou verde
    const forte = tamanho && maiuscula && numero && simbolo;

    aviso.classList.remove('erro', 'forte');              // limpa o estado anterior
    campo.classList.remove('invalido');
    texto.textContent = 'Use uma senha FORTE';

    if (forte) {
        aviso.classList.add('forte');
        texto.textContent = 'Senha forte';
    } else if (senha !== '' || aoEnviar) {                // só fica vermelho depois que a pessoa digita
        aviso.classList.add('erro');
        campo.classList.add('invalido');
    }

    return forte;
}

// ---------- CONFIRMAR SENHA: igual à senha ----------
function validarConfirmacao(aoEnviar) {
    const senha = document.getElementById('ipt_senha_hash').value;
    const confirmacao = document.getElementById('ipt_senha_confirm').value;
    let erro = '';

    if (confirmacao === '') {
        if (aoEnviar) {
            erro = 'Confirme sua senha.';
        }
    } else if (confirmacao !== senha) {
        erro = 'As senhas não coincidem.';
    }

    mostrarErro('ipt_senha_confirm', 'msg_confirm', erro);
    return confirmacao !== '' && confirmacao === senha;
}


function cadastrar() {

    // Chama as 4 validações e guarda os resultados, para as frases vermelhas
    // aparecerem todas de uma vez (se parasse no primeiro erro, só uma apareceria)
    const nomeOk = validarNome();
    const emailOk = validarEmail();
    const senhaOk = validarSenha(true);
    const confirmacaoOk = validarConfirmacao(true);

    // Se tem erro, não é enviado
    if (!nomeOk || !emailOk || !senhaOk || !confirmacaoOk) {
        return;
    }

    const nome = document.getElementById('ipt_nome').value.trim();
    const email = document.getElementById('ipt_email').value.trim();
    const senha_hash = document.getElementById('ipt_senha_hash').value;



    fetch("/usuarios/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({

            nomeServer: nome,
            emailServer: email,
            senha_hashServer: senha_hash
        }),

    })
        .then(function (resposta) {
            console.log("resposta: ", resposta);
            if (resposta.ok) {

                setTimeout(() => {
                    window.location = "./login.html";
                }, "2000");

                limparFormulario();
            } else {
                throw "Houve um erro ao tentar realizar o cadastro!";
            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);

        });
}

