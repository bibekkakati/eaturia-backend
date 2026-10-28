const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { usertype } = require("../constants");

const privateKey = fs.readFileSync("./keys/private.key");
const publicKey = fs.readFileSync("./keys/public.key");

const options = {
    algorithm: process.env.JWT_ALGORITHM,
    expiresIn: process.env.EXPIRES_IN,
    issuer: process.env.ISSUER,
    allowInsecureKeySizes: true,
};

// Generate a signed JWT token for the given payload
exports.getAuthToken = (payload) => {
    return jwt.sign(payload, privateKey, options);
};

// Verify a JWT token using the public key
exports.verifyToken = (token) => {
    const payload = jwt.verify(token, publicKey, options);
    return payload;
};

// (Optional) Helper to programmatically create a Super Admin account
exports.createSuperAdminAccount = async (email, password) => {
    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return { success: false, message: "User already exists" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            email,
            password: hashedPassword,
            type: usertype.SUPER_ADMIN,
        });

        await user.save();

        return { success: true, message: "User created successfully" };
    } catch (error) {
        console.log(error);
        return { success: false, message: "Internal server error" };
    }
};
