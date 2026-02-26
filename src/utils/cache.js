const cache = {};

exports.set = (key, value, ttl) => {
    cache[key] = {
        value,
        expiresAt: Date.now() + ttl
    };
};

exports.get = (key) => {
    const item = cache[key];

    if (!item) return null;

    if (Date.now() > item.expiresAt) {
        delete cache[key];
        return null;
    }

    return item.value;
};