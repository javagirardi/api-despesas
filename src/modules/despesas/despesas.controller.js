const service = require("./despesas.service");

exports.create = async (req, res, next) => {
    try {
        const despesa = await service.create(req.body, req.user.email);
        return res.status(201).json(despesa);
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const despesa = await service.update(req.params.id, req.body);
        return res.json(despesa);
    } catch (error) {
        next(error);
    }
};

exports.enviar = async (req, res, next) => {
    try {
        const despesa = await service.enviar(req.params.id);
        return res.json(despesa);
    } catch (error) {
        next(error);
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const despesas = await service.findAll(req.query);
        return res.json(despesas);
    } catch (error) {
        next(error);
    }
};

exports.findById = async (req, res, next) => {
    try {
        const despesa = await service.findById(req.params.id);
        return res.json(despesa);
    } catch (error) {
        next(error);
    }
};