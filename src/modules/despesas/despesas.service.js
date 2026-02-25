const repository = require("./despesas.repository");
const AppError = require("../urtils/AppError");

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
        throw new AppError(409, "Despesa já enviada");
    }

    return repository.updateStatus(id, "enviado");
};

exports.findAll = async (filters) => {
    return repository.findAll(filters);
};