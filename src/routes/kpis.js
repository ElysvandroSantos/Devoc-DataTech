var express = require("express");
var router = express.Router();

var kpisController = require("../controllers/kpisController");

// GET /kpis/7  -> dados dos cards do usuário 7
router.get("/:idUsuario", function (req, res) {
    kpisController.buscarKpis(req, res);
});

module.exports = router;