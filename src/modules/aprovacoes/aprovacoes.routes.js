const express = require("express");
const router = express.Router();

const controller = require("./aprovacoes.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

router.use(authMiddleware);

router.post("/:id/aprovar", controller.aprovar);
router.post("/:id/rejeitar", controller.rejeitar);

module.exports = router;