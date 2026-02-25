const pool = require("../../config/db");

exports.create = async (data) => {
    const query = `
    INSERT INTO aprovacoes
    (despesa_id, aprovador_email, acao, comentario)
    VALUES ($1, $2, $3, $4)
`;

    const values = [
        data.despesa_id,
        data.aprovador_email,
        data.acao,
        data.comentario || null
    ];

    await pool.query(query, values);
};