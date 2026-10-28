const { success, failure } = require("../helpers/responseHelper");
const Menu = require("../models/Menu");
const Order = require("../models/Order");

// Fetch the active menu for a specific restaurant
exports.getRestaurantMenu = async (req, res) => {
    try {
        const { id } = req.params;

        const menu = await Menu.findOne({
            restaurantId: id,
            isActive: true,
        }).lean();

        if (!menu) {
            throw new Error("Restaurant menu not available");
        }

        return success(res, "Restaurant menu fetched", menu);
    } catch (error) {
        console.log(error);
        return failure(res, error);
    }
};

// Process and create a new customer order
exports.createOrder = async (req, res) => {
    try {
        const { customerName, customerPhone, tableNumber, restaurantId, cart, menuId } =
            req.body;

        if (!customerName) {
            throw new Error("Please enter customer name");
        }

        if (customerPhone && customerPhone.toString().length < 10) {
            throw new Error("Phone number should be of minimum 10 digits");
        }

        if (!restaurantId || !menuId) {
            throw new Error("Restaurant and menu id is required");
        }

        // Ensure the cart contains at least one item
        if (!cart || !Object.keys(cart).length) {
            throw new Error("Please select items to order");
        }

        // Fetch menu items and map cart ids to create items array
        const items = [];

        const menu = await Menu.findOne(
            { _id: menuId, restaurantId },
            { menuItems: 1 }
        ).lean();

        if (!menu) {
            throw new Error("Menu not found");
        }

        let total = 0;

        // Iterate through menu items and match with items in the customer's cart
        menu.menuItems.forEach((item) => {
            const { _id, name, description, price } = item;
            const quantity = cart[_id];

            // Item present in cart
            if (quantity) {
                items.push({
                    name,
                    price,
                    description,
                    quantity,
                });

                total += price * quantity;
            }
        });

        if (!items.length) {
            throw new Error("Order processing failed");
        }

        const order = new Order({
            customerName,
            customerPhone,
            tableNumber,
            restaurantId,
            items,
            total,
            status: "PENDING",
        });

        await order.save();

        return success(res, "Order placed successfully", order);
    } catch (error) {
        console.log(error);
        return failure(res, error);
    }
};

// Fetch detailed information for a specific order by ID
exports.getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findOne({ _id: id }).lean();

        if (!order) {
            throw new Error("No order found");
        }

        return success(res, "Order details fetched", order);
    } catch (error) {
        console.log(error);
        return failure(res, error);
    }
};
