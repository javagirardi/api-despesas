const axios = require("axios");
const cache = require("../../utils/cache");
const AppError = require("../../utils/AppError");

exports.getRate = async (from, to) => {

    // Se a consulta se der antes das 10h, ou em fins de semana e feriados, estourará o erro tratado (502)
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, "0");
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const ano = hoje.getFullYear();

    const dataFormatada = `${mes}-${dia}-${ano}`;

    const cacheKey = `${from}_${to}`;
    const cachedRate = cache.get(cacheKey);

    if (cachedRate) {
        return cachedRate;
    }

    try {
        //tentei deixar uma data fixa, mas também estoura erro se consultar antes de abrir o pregão
        const response = await axios.get(
            `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/` +
            `CotacaoDolarDia(dataCotacao=@dataCotacao)` +
            `?@dataCotacao='${dataFormatada}'&$top=1&$format=json`
        );

        if (!response.data.value || response.data.value.length === 0) {
            throw new AppError(502, "Cotação indisponível para a data informada");
        }

        const rate = response.data.value[0].cotacaoCompra;

        cache.set(cacheKey, rate, 600000);

        return rate;

    } catch (error) {
        //Erro real no caso comentado acima: Cotação indisponível para a data informada
        throw new AppError(
            502,
            "Erro ao consultar API do Banco Central",
            error
        );
    }
};