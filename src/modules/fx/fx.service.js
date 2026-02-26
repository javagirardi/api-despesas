const axios = require("axios");
const cache = require("../../utils/cache");
const AppError = require("../../utils/AppError");

exports.getRate = async (from, to) => {
    const cacheKey = `${from}_${to}`;

    const cachedRate = cache.get(cacheKey);
    if (cachedRate) {
        return cachedRate;
    }

    try {
        // API pública PTAX do Banco Central
        const response = await axios.get(
            "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/" +
            "CotacaoDolarDia(dataCotacao=@dataCotacao)" +
            "?@dataCotacao='02-25-2026'&$top=1&$format=json"
        );

        const rate = response.data.value[0].cotacaoCompra;

        cache.set(cacheKey, rate, 600000); // 10 min

        return rate;

    } catch (error) {
        throw new AppError(
            502,
            "Erro ao consultar API do Banco Central",
            error
        );
    }
};