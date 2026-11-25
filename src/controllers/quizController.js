var quizModel = require("../models/quizModel");

function salvar(req, res) {
    var idUsuario = req.body.idUsuarioServer;
    var respostas = req.body.respostasServer;

    if (idUsuario == undefined) {
        res.status(400).send("O id do usuário está undefined!");
        return;
    }
    if (!Array.isArray(respostas) || respostas.length == 0) {
        res.status(400).send("As respostas estão undefined ou vazias!");
        return;
    }
    for (var i = 0; i < respostas.length; i++) {
        if (respostas[i].santo == undefined || respostas[i].numero == undefined || respostas[i].acertou == undefined) {
            res.status(400).send("A resposta " + (i + 1) + " está incompleta!");
            return;
        }
    }

    // 1) cria o quiz  ->  2) grava as respostas  ->  3) marca como concluído
    quizModel.iniciar(idUsuario)
        .then(function (resultado) {
            var idQuiz = resultado.insertId;   // id que o MySQL gerou para o quiz novo
            return quizModel.registrarRespostas(idQuiz, respostas)
                .then(function () {
                    return quizModel.concluir(idQuiz);
                })
                .then(function () {
                    res.status(200).json({ idQuiz: idQuiz });
                });
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao salvar o quiz! Erro: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    salvar
};
