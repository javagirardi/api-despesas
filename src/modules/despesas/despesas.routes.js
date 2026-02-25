const express = require("express");
const router = express.Router();

const controller = require("./despesas.controller");
const authMiddleware = require("../../middlewares/auth.middleware");

router.use(authMiddleware);

router.post("/", controller.create);
router.put("/:id", controller.update);
router.post("/:id/enviar", controller.enviar);
router.get("/", controller.findAll);
router.get("/:id", controller.findById);

module.exports = router;