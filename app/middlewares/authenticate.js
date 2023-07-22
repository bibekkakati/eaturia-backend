const { verifyToken } = require("../helpers/authHelper");
const { userrouteaccess, usertype, publicroutes } = require("../constants.js");
const { failure } = require("../helpers/responseHelper");

const authenticate = (req, res, next) => {
    try {
        const route = req.path.split("/")[3];
        if (publicroutes[route]) {
            return next();
        }

        const token = req.header("Authorization").replace("Bearer ", "");
        req.user = verifyToken(token);

        const ut = req.user.type;

        // Check for user type mismatch
        if (!usertype[ut]) {
            throw new Error("User type not valid");
        }

        // Check if user type has access to this route
        if (!userrouteaccess[ut][route]) {
            throw new Error("Route access denied");
        }

        return next();
    } catch (error) {
        console.log(error);
        return failure(res, { message: "Authentication failed" }, 401);
    }
};

module.exports = authenticate;
