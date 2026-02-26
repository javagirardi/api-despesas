const repository = require("./despesas.repository");
const AppError = require("../../utils/AppError");
const fxService = require("../fx/fx.service");

exports.create = async (data, email) => {
    return repository.create({
        ...data,
        solicitante_email: email,
    });
};

exports.update = async (id, data) => {
    const despesa = await repository.findById(id);

    if (!despesa) {
        throw new AppError(404, "Despesa não encontrada");
    }

    if (despesa.status !== "rascunho") {
        //409 - conflito de estado
        throw new AppError(409, "Despesa não pode ser editada");
    }

    return repository.update(id, data);
};

exports.enviar = async (id) => {
    const despesa = await repository.findById(id);

    if (!despesa) {
        throw new AppError(404, "Despesa não encontrada");
    }

    if (despesa.status !== "rascunho") {
        //409 - conflito de estado
        throw new AppError(409, "Despesa já enviada");
    }

    return repository.updateStatus(id, "enviado");
};

exports.findAll = async (filters) => {
    return repository.findAll(filters);
};

exports.findById = async (id) => {
    const despesa = await repository.findById(id);

    if (!despesa) {
        throw new AppError(404, "Despesa não encontrada");
    }

    return despesa;
};

exports.resumo = async (id) => {
    const despesa = await repository.findById(id);

    if (!despesa) {
        throw new AppError(404, "Despesa não encontrada");
    }

    const rate = await fxService.getRate("BRL", "USD");

    const valorConvertido = despesa.valor / rate;

    return {
        ...despesa,
        valor_usd: Number(valorConvertido.toFixed(2))
    };
};