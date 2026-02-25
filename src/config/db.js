const { Pool } = require("pg");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
    console.log("Conectado ao PostgreSQL");
});

pool.on("error", (err) => {
    console.error("Erro inesperado no banco", err);
});

pool.query("SELECT NOW()")
    .then(res => console.log("🕒 Hora do banco:", res.rows[0]))
    .catch(err => console.error("Erro ao testar banco", err));

module.exports = pool;