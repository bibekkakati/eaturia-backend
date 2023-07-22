const mongoose = require("mongoose");
const { orderstatus } = require("../constants");

const orderSchema = new mongoose.Schema(
    {
        customerName: {
            type: String,
            required: true,
        },
        customerPhone: {
            type: String,
        },
        restaurantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true,
        },
        items: [
            {
                name: {
                    type: String,
                    required: true,
                },
                description: {
                    type: String,
                },
                price: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: String,
                    required: true,
                },
            },
        ],
        total: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: orderstatus,
            default: orderstatus[0],
        },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
