var database = require("../database/config")

// Card 1 e data: acertos, total de perguntas e data da última tentativa concluída
function ultimoResultado(idUsuario) {
    var instrucaoSql = `
        SELECT SUM(r.acertou) AS acertos,
        COUNT(*) AS total,
        q.data_fim AS dataFim
        FROM quiz q
        JOIN resposta r ON r.fk_quiz = q.id
        WHERE q.id = (
        SELECT id FROM quiz
        WHERE fk_usuario = ? AND data_fim IS NOT NULL
        ORDER BY data_fim DESC
        LIMIT 1
        )
        GROUP BY q.id, q.data_fim;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [idUsuario]);
}

// Card 2: quantos quizzes o usuário concluiu
function quizzesConcluidos(idUsuario) {
    var instrucaoSql = `
        SELECT COUNT(*) AS quizzesConcluidos
        FROM quiz
        WHERE fk_usuario = ? AND data_fim IS NOT NULL;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [idUsuario]);
}

// Card 3: acertos e respostas de TODOS os usuários
function mediaGeral(idUsuario) {
    var instrucaoSql = `
        SELECT SUM(r.acertou) AS respostasCertas,
        COUNT(*) AS respostasTotal,
        COUNT(DISTINCT r.fk_quiz) AS totalQuizzes
        FROM resposta r
        JOIN quiz q ON q.id = r.fk_quiz
        WHERE q.data_fim IS NOT NULL AND q.fk_usuario = ?;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [idUsuario]);
}

module.exports = {
    ultimoResultado,
    quizzesConcluidos,
    mediaGeral
};
