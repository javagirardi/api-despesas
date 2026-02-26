const service = require("./fx.service");

exports.getRate = async (req, res, next) => {
    try {
        const { from, to } = req.query;

        const rate = await service.getRate(from, to);

        return res.json({
            from,
            to,
            rate
        });

    } catch (error) {
        next(error);
    }
};