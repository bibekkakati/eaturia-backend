const mongoose = require("mongoose");
const { menutemplates } = require("../constants");

const menuSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true,
        },
        menuItems: {
            type: [
                {
                    name: {
                        type: String,
                        required: true,
                    },
                    price: {
                        type: String,
                        required: true,
                    },
                    description: {
                        type: String,
                    },
                    isActive: {
                        type: Boolean,
                        default: true,
                    },
                },
            ],
            required: true,
        },
        template: {
            type: String,
            enum: menutemplates,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
