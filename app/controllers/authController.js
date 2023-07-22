const bcrypt = require("bcrypt");
const User = require("../models/User");
const { getAuthToken } = require("../helpers/authHelper");
const { success, failure } = require("../helpers/responseHelper");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).lean();

        if (!user) {
            throw new Error("User not found");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            throw new Error("Invalid credentials");
        }

        const token = getAuthToken({
            uid: user._id,
            rid: user.restaurantId,
            type: user.type,
        });

        return success(res, "Login success", { token }, 201);
    } catch (error) {
        console.log(error);
        return failure(res, error);
    }
};
