const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    //Bearer TOKEN_AQUI
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        //sem autenticação
        return res.status(401).json({ error: "Token não informado" });
    }

    //aqui pode quebrar se o header vier mal formatado
    const token = authHeader.split(" ")[1];

    try {
        //verifica assinatura, expiracao e integridade
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //armazena token na requisição
        req.user = decoded;
        next();
        //nao usar 403, pois é para Sem Autorização
    } catch (error) {
        return res.status(401).json({ error: "Token inválido ou expirado" });
    }
};