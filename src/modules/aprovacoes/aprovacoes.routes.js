const express = require("express");
const router = express.Router();

const controller = require("./aprovacoes.controller");
const authMiddleware = require("../../middlewares/auth.middleware");



router.post("/:id/aprovar", controller.aprovar);
router.post("/:id/rejeitar", controller.rejeitar);
router.use(authMiddleware);

module.exports = router;