
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


function autenticar() {

    var emailVar = ipt_email.value;
    var senha_hashVar = ipt_senha_hash.value;


    // Verificando se há algum campo em branco
    if (
        emailVar == "" ||
        senha_hashVar == ""
    ) {


        return false;
    }


    // Enviando o valor da nova input
    fetch("/usuarios/autenticar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({

            emailServer: emailVar,
            senha_hashServer: senha_hashVar,

        }),
    })
        .then(function (resposta) {
            console.log("resposta: ", resposta);

            if (resposta.ok) {
                resposta.json().then(json => {
                    sessionStorage.ID_USUARIO = json.id;
                    sessionStorage.NOME_USUARIO = json.nome;

                    setTimeout(() => {
                        window.location = "./index.html";
                    }, "2000");

                });

            } else {
                alert('Email ou senha incorretos!')
                throw "Houve um erro ao tentar realizar o cadastro!";

            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);

        });


    
    return false;
}

