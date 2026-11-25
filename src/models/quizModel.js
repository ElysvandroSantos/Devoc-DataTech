var database = require("../database/config")

// 1) cria o quiz do usuário (data_fim fica vazia = ainda não concluído)
function iniciar(idUsuario) {
    var instrucaoSql = `
        INSERT INTO quiz (fk_usuario) VALUES (?);
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [idUsuario]);
}

// 2) grava as respostas de uma vez só
function registrarRespostas(idQuiz, respostas) {
    // transforma a lista de objetos em uma lista de linhas: [[quiz, santo, numero, acertou], ...]
    var linhas = [];
    for (var i = 0; i < respostas.length; i++) {
        linhas.push([idQuiz, respostas[i].santo, respostas[i].numero, respostas[i].acertou]);
    }

    var instrucaoSql = `
        INSERT INTO resposta (fk_quiz, fk_santo, numero_pergunta, acertou) VALUES ?;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [linhas]);
}

// 3) marca o quiz como concluído
function concluir(idQuiz) {
    var instrucaoSql = `
        UPDATE quiz SET data_fim = NOW() WHERE id = ?;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [idQuiz]);
}

module.exports = {
    iniciar,
    registrarRespostas,
    concluir
};
