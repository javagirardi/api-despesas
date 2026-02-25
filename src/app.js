const express = require("express");
const authRoutes = require("./modules/auth/auth.routes");
// const despesasRoutes = require("./modules/despesas/despesas.routes");
// const errorMiddleware = require("./middlewares/error.middleware");

const app = express();
app.use(express.json());

app.use("/auth", authRoutes)
// app.use("/despesas", despesasRoutes)
// app.use(errorMiddleware);

module.exports = app;