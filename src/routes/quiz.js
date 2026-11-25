var express = require("express");
var router = express.Router();

var quizController = require("../controllers/quizController");

// Recebe as respostas do quiz.html e grava no banco
router.post("/salvar", function (req, res) {
    quizController.salvar(req, res);
});

module.exports = router;
