const express = require("express");
const router = express.Router();

const controller = require("./fx.controller");

router.get("/", controller.getRate);

module.exports = router;