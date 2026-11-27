var kpisModel = require("../models/kpisModel");

function buscarKpis(req, res) {
    var idUsuario = Number(req.params.idUsuario);

    if (isNaN(idUsuario)) {
        res.status(400).send("O id do usuário é inválido!");
        return;
    }

    // dispara as 3 consultas juntas e só continua quando as 3 terminarem
    Promise.all([
        kpisModel.ultimoResultado(idUsuario),
        kpisModel.quizzesConcluidos(idUsuario),
        kpisModel.mediaGeral(idUsuario)
    ])
        .then(function (resultados) {
            var ultimo = resultados[0];       // lista com 0 ou 1 linha
            var concluidos = resultados[1];   // lista com 1 linha
            var media = resultados[2];        // lista com 1 linha

            res.json({
                // se o usuário nunca concluiu um quiz, "ultimo" vai como null
                ultimo: ultimo.length == 0 ? null : {
                    acertos: Number(ultimo[0].acertos),
                    total: Number(ultimo[0].total),
                    dataFim: ultimo[0].dataFim
                },
                quizzesConcluidos: Number(concluidos[0].quizzesConcluidos),
                media: {
                    respostasCertas: Number(media[0].respostasCertas),   // Number(null) vira 0
                    respostasTotal: Number(media[0].respostasTotal),
                    totalQuizzes: Number(media[0].totalQuizzes)
                }
            });
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao buscar os KPIs! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    buscarKpis
};
