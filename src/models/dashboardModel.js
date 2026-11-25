var database = require("../database/config")

// Acertos por santo na última tentativa concluída do usuário (gráficos e histórias)
function acertosPorSanto(idUsuario) {
    var instrucaoSql = `
        SELECT s.id AS santoId,
        SUM(r.acertou) AS acertos,
        COUNT(*) AS maximo
        FROM resposta r
        JOIN santo s ON s.id = r.fk_santo
        WHERE r.fk_quiz = (
        SELECT id FROM quiz
        WHERE fk_usuario = ? AND data_fim IS NOT NULL
        ORDER BY data_fim DESC
        LIMIT 1
        )
        GROUP BY s.id
        ORDER BY s.id;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [idUsuario]);
}

module.exports = {
    acertosPorSanto
};
