const { menutemplates } = require("../constants");
const { success, failure } = require("../helpers/responseHelper");
const Menu = require("../models/Menu");
const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");
const User = require("../models/User");

exports.createMenu = async (req, res) => {
    try {
        let { name, template } = req.body;
        const restaurantId = req.user.rid;

        if (!name) {
            throw new Error("Menu name is mandatory");
        }

        const existingMenus =
            (await Menu.find(
                { restaurantId },
                { name: 1, isActive: 1 }
            ).lean()) || [];

        const hasAnyActiveMenu = existingMenus.some((v) => v.isActive == true);
        const isMenuNameExists = existingMenus.some((v) => v.name == name);

        if (isMenuNameExists) {
            throw new Error("Menu already exists");
        }

        const menu = new Menu({
            name,
            restaurantId,
            menuItems: [],
            isActive: !hasAnyActiveMenu,
            template: template || menutemplates[0],
        });

        await menu.save();

        return success(res, "Menu created successfully", menu, 201);
    } catch (error) {
        console.log(error);
        return failure(res, error);
    }
};

exports.updateMenu = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, menuItems } = req.body;
        const restaurantId = req.user.rid;

        // Menu items validation
        for (let i = 0; i < menuItems?.length; i++) {
            const item = menuItems[i];

            if (!item.name) {
                throw new Error("Item name is mandatory");
            }

            if (!item.price) {
                throw new Error("Item price is mandatory");
            }

            if (item.price <= 0) {
                throw new Error(
                    "Item price should be a positive & non-zero number"
                );
            }

            item.price = Number(item.price).toFixed(2);
            item.isActive = Boolean(item.isActive);
        }

        const update = {};

        if (name) {
            update.name = name;
        }

        if (menuItems) {
            update.menuItems = menuItems;
        }

        const menu = await Menu.findOneAndUpdate(
            { _id: id, restaurantId },
            update,
            { new: true }
        ).lean();

        if (!menu) {
            throw new Error("Menu not found");
        }

        return success(res, "Menu updated successfully", menu);
    } catch (error) {
        console.log(error);
        return failure(res, error);
    }
};

exports.liveMenu = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurantId = req.user.rid;

        // If trying to activate a new menu, de-activate all other menus
        await Menu.updateMany({ restaurantId }, { isActive: false }).lean();

        const menu = await Menu.findOneAndUpdate(
            { _id: id, restaurantId },
            { isActive: true },
            { new: true, fields: { _id: 1 } }
        ).lean();

        if (!menu) {
            throw new Error("Menu not found");
        }

        return success(res, "Menu status changed to active");
    } catch (error) {
        console.log(error);
        return failure(res, error);
    }
};

exports.deleteMenu = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurantId = req.user.rid;

        const menu = await Menu.findOneAndDelete({
            _id: id,
            restaurantId,
        }).lean();

        if (!menu) {
            throw new Error("Menu not found");
        }

        return success(res, "Menu deleted successfully");
    } catch (error) {
        console.log(error);
        return failure(res, error);
    }
};

exports.getMenusByRestaurant = async (req, res) => {
    try {
        const restaurantId = req.user.rid;

        const menus = await Menu.find(
            { restaurantId },
            { name: 1, isActive: 1 }
        ).lean();

        return success(res, "Restaurant menu list fetched", menus);
    } catch (error) {
        console.log(error);
        return failure(res, error);
    }
};

exports.getMenuById = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurantId = req.user.rid;

        const menu = await Menu.findOne({ _id: id, restaurantId }).lean();

        if (!menu) {
            throw new Error("Menu not found");
        }

        return success(res, "Menu fetched successfully", menu);
    } catch (error) {
        console.log(error);
        return failure(res, error);
    }
};

exports.getRestaurantDetails = async (req, res) => {
    try {
        const id = req.user.rid;

        const restaurant = await Restaurant.findById(id).lean();

        if (!restaurant) {
            throw new Error("Restaurant not found");
        }

        return success(
            res,
            "Restaurant details fetched successfully",
            restaurant,
            201
        );
    } catch (error) {
        console.log(error);
        return failure(res, error);
    }
};

exports.getRestaurantAdminList = async (req, res) => {
    try {
        const id = req.user.rid;

        const restaurant = await Restaurant.findById(id).lean();

        if (!restaurant) {
            throw new Error("Restaurant not found");
        }

        const users = await User.find(
            { restaurantId: id },
            { email: 1, isActive: 1 }
        ).lean();

        return success(
            res,
            "Restaurant admin list fetched successfully",
            users,
            201
        );
    } catch (error) {
        console.log(error);
        return failure(res, error);
    }
};

exports.getOrdersByRestaurant = async (req, res) => {
    try {
        const restaurantId = req.user.rid;

        const orders = await Order.find({ restaurantId }, { items: 0 }).lean();

        return success(res, "Order list fetched", orders);
    } catch (error) {
        console.log(error);
        return failure(res, error);
    }
};

exports.getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const restaurantId = req.user.rid;

        const order = await Order.findOne({ _id: id, restaurantId }).lean();

        if (!order) {
            throw new Error("No order found");
        }

        return success(res, "Order details fetched", order);
    } catch (error) {
        console.log(error);
        return failure(res, error);
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true, fields: { _id: 1 } }
        );

        if (!order) {
            throw new Error("Order not found");
        }

        return success(res, "Order updated successfully");
    } catch (error) {
        console.log(error);
        return failure(res, error);
    }
};
