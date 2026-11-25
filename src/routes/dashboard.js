var express = require("express");
var router = express.Router();

var dashboardController = require("../controllers/dashboardController");

// GET /dashboard/7  -> dados dos gráficos e das histórias do usuário 7
router.get("/:idUsuario", function (req, res) {
    dashboardController.buscarDados(req, res);
});

module.exports = router;