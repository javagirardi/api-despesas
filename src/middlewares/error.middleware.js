module.exports = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Erro interno do servidor";

    if (status >= 500) {
        console.error("Erro interno:", err);
    }

    return res.status(status).json({
        error: message
    });
};