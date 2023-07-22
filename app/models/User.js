const mongoose = require("mongoose");
const { usertype } = require("../constants.js");

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        type: {
            type: String,
            required: true,
            enum: Object.values(usertype),
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
