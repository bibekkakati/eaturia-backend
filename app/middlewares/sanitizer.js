const { failure } = require("../helpers/responseHelper");

const trimRequestBody = (payload) => {
    const trimValue = (value) => {
        if (typeof value === "string") {
            value = value.trim();

            // Regex to check for potential XSS (Cross-site Scripting) script/tag injection
            const regex = /<([A-Za-z_{}()/]+(\s|=)*)+>(.*<[A-Za-z/>]+)*/gi;
            if (regex.test(value)) {
                throw new Error("Special characters (HTML tags) are not allowed");
            }
            return value;
        } else if (Array.isArray(value)) {
            // Recursively sanitize all elements in an array
            return value.map(trimValue);
        } else if (typeof value === "object" && value !== null) {
            // Recursively sanitize all properties in an object
            const trimmedObject = {};
            for (let key in value) {
                trimmedObject[key] = trimValue(value[key]);
            }
            return trimmedObject;
        }
        return value;
    };

    return trimValue(payload);
};

const sanitizer = (req, res, next) => {
    try {
        req.body = trimRequestBody(req.body);
        next();
    } catch (error) {
        console.log(error);
        return failure(res, error);
    }
};

module.exports = sanitizer;
