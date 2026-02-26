module.exports = (err, req, res, next) => {
    const isOperational = err.isOperational || false;

    console.error("Erro capturado:");
    console.error("Status:", err.status || 500);
    console.error("Mensagem:", err.message);

    if (err.cause) {
        console.error("Causa original:", err.cause);
    }

    if (!isOperational) {
        console.error("Stack:", err.stack);
    }

    const status = err.status || 500;

    return res.status(status).json({
        error: err.message || "Erro rnterno do servidor"
    });
};