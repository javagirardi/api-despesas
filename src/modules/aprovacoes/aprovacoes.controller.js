const service = require("./aprovacoes.service");

exports.aprovar = async (req, res, next) => {
    try {
        const result = await service.aprovar(
            req.params.id,
            req.user.email,
            req.body.comentario
        );

        return res.json(result);
    } catch (error) {
        next(error);
    }
};

exports.rejeitar = async (req, res, next) => {
    try {
        const result = await service.rejeitar(
            req.params.id,
            req.user.email,
            req.body.comentario
        );

        return res.json(result);
    } catch (error) {
        next(error);
    }
};