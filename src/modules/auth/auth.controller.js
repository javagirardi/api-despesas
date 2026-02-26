const jwt = require("jsonwebtoken");

exports.login = async (req, res, next) => {
    try {
        const { email, senha } = req.body;

        // Credenciais mockadas
        if (email !== "admin@email.com" || senha !== "123456") {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }

        // Criar payload
        const payload = {
            email
        };

        // Gerar token, utiliza o .env
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        //retorna o token
        return res.json({
            access_token: token
        });
        //Se ocorrer erro inesperado, envia para o middleware global de erros    
    } catch (error) {
        next(error);
    }
};