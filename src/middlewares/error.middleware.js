module.exports = (err, req, res, next) => {

    console.error("Erro:", err);

    const status = err.status || 500;
    const message = err.message || "Erro interno do servidor";

    return res.status(status).json({
        error: message
    });
};