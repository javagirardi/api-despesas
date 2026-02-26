const pool = require("../../config/db");

exports.create = async (data) => {
    const query = `
    INSERT INTO despesas
    (solicitante_email, centro_custo, descricao, valor)
    VALUES ($1, $2, $3, $4)
    RETURNING *
`;

    const values = [
        data.solicitante_email,
        data.centro_custo,
        data.descricao,
        data.valor,
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
};

exports.findById = async (id) => {
    const { rows } = await pool.query(
        "SELECT * FROM despesas WHERE id = $1",
        [id]
    );

    return rows[0];
};

exports.update = async (id, data) => {
    const query = `
    UPDATE despesas
    SET centro_custo = $1,
        descricao = $2,
        valor = $3,
        atualizado_em = NOW()
    WHERE id = $4
    RETURNING *
`;

    const values = [
        data.centro_custo,
        data.descricao,
        data.valor,
        id,
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
};

exports.updateStatus = async (id, status) => {
    const { rows } = await pool.query(
        `UPDATE despesas
        SET status = $1,
        atualizado_em = NOW()
        WHERE id = $2
        RETURNING *`,
        [status, id]
    );

    return rows[0];
};

exports.findAll = async (filters) => {
    let query = "SELECT * FROM despesas WHERE 1=1";
    const values = [];
    let index = 1;

    if (filters.status) {
        query += ` AND status = $${index++}`;
        values.push(filters.status);
    }

    if (filters.centro_custo) {
        query += ` AND centro_custo = $${index++}`;
        values.push(filters.centro_custo);
    }

    if (filters.min_valor) {
        query += ` AND valor >= $${index++}`;
        values.push(filters.min_valor);
    }

    if (filters.max_valor) {
        query += ` AND valor <= $${index++}`;
        values.push(filters.max_valor);
    }

    if (filters.q) {
        query += ` AND (
        descricao ILIKE $${index}
        OR centro_custo ILIKE $${index}
    )`;
        values.push(`%${filters.q}%`);
        index++;
    }

    const { rows } = await pool.query(query, values);
    return rows;
};
