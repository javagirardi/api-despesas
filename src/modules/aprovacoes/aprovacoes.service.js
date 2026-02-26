const despesasRepository = require("../despesas/despesas.repository");
const aprovacoesRepository = require("./aprovacoes.repository");
const AppError = require("../../utils/AppError");

exports.aprovar = async (id, aprovadorEmail, comentario) => {
    const despesa = await despesasRepository.findById(id);

    if (!despesa) {
        throw new AppError(404, "Despesa não encontrada");
    }

    // Regra 1: só pode aprovar se status == enviado
    if (despesa.status !== "enviado") {
        throw new AppError(409, "Despesa não está enviada para aprovação");
    }

    // Regra 2: se valor > 5000, comentário obrigatório
    if (despesa.valor > 5000 && (!comentario || comentario.trim() === "")) {
        throw new AppError(400, "Comentário obrigatório para valores acima de 5000");
    }

    // Atualizar status
    await despesasRepository.updateStatus(id, "aprovado");

    // Criar registro de aprovação
    await aprovacoesRepository.create({
        despesa_id: id,
        aprovador_email: aprovadorEmail,
        acao: "aprovado",
        comentario
    });

    return { message: "Despesa aprovada com sucesso" };
};

exports.rejeitar = async (id, aprovadorEmail, comentario) => {
    const despesa = await despesasRepository.findById(id);

    if (!despesa) {
        throw new AppError(404, "Despesa não encontrada");
    }

    if (despesa.status !== "enviado") {
        throw new AppError(409, "Despesa não está enviada para aprovação");
    }

    if (despesa.valor > 5000 && !comentario) {
        throw new AppError(400, "Comentário obrigatório para valores acima de 5000");
    }

    await despesasRepository.updateStatus(id, "rejeitado");

    await aprovacoesRepository.create({
        despesa_id: id,
        aprovador_email: aprovadorEmail,
        acao: "rejeitado",
        comentario
    });

    return { message: "Despesa rejeitada com sucesso" };
};