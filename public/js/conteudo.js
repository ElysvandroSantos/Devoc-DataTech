// Textos e imagens que aparecem na tela. NÃO ficam no banco.
// A chave (1, 2, 3) é o id do santo na tabela "santo".
var conteudo = {
    1: {
        nomeCurto: "São Bento",
        titulo: "Oração e trabalho",
        descricao: "Conheça sua vida e o legado da Regra beneditina.",
        imagem: "./assets/imgs/sao-bento.jpg",
        link: "./são_bento.html"
    },
    2: {
        nomeCurto: "São Paulo",
        titulo: "Um novo olhar sobre São Paulo",
        descricao: "Reencontre as viagens e as comunidades de sua missão.",
        imagem: "./assets/imgs/slides02.png",
        link: "./são_paulo.html"
    },
    3: {
        nomeCurto: "N. Sra. Aparecida",
        titulo: "Nas águas, o início de uma história",
        descricao: "Conheça o encontro da imagem de Aparecida, em 1717.",
        imagem: "./assets/imgs/images (1).jfif",
        link: "./aparecida.html"
    }
};

module.exports = conteudo;
