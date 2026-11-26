var dashboardModel = require("../models/dashboardModel");
var conteudo = require("../../public/js/conteudo");

function buscarDados(req, res) {
    var idUsuario = Number(req.params.idUsuario);

    if (isNaN(idUsuario)) {
        res.status(400).send("O id do usuário é inválido!");
        return;
    }

    dashboardModel.acertosPorSanto(idUsuario)
        .then(function (linhas) {

            // junta o que veio do banco (acertos) com o texto de conteudo.js
            var santos = [];
            for (var i = 0; i < linhas.length; i++) {
                var extra = conteudo[linhas[i].santoId];
                santos.push({
                    santoId: linhas[i].santoId,
                    nomeCurto: extra.nomeCurto,
                    acertos: Number(linhas[i].acertos),   // o MySQL devolve SUM como texto, então convertemos
                    maximo: Number(linhas[i].maximo),
                    titulo: extra.titulo,
                    descricao: extra.descricao,
                    imagem: extra.imagem,
                    link: extra.link
                });
            }

            // histórias: cópia da lista, ordenada de quem tem MENOS acertos para quem tem mais
            var historias = santos.slice();
            historias.sort(function (a, b) {
                return a.acertos - b.acertos;
            });

            res.json({ santos: santos, historias: historias });
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao buscar os dados da dashboard! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    buscarDados
};

