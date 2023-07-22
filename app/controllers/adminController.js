const bcrypt = require("bcrypt");
const { usertype } = require("../constants");
const { success, failure } = require("../helpers/responseHelper");
const Restaurant = require("../models/Restaurant");
const User = require("../models/User");

exports.createRestaurant = async (req, res) => {
    try {
        const { name, address, phone, description, logo } = req.body;

        if (!name || !address || !phone) {
            throw new Error(
                "Please provide restaurant name, address and phone number"
            );
        }

        if (phone.toString().length < 10) {
            throw new Error("Phone number should be minimum 10 digits");
        }

        const restaurant = new Restaurant({
            name,
            address,
            phone,
            description,
            logo,
        });

        await restaurant.save();

        return success(res, "Restaurant created successfully", restaurant, 201);
    } catch (error) {
        console.log(error);
        return failure(res, error);
    }
};

exports.updateRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;

        if (payload?.phone.toString().length < 10) {
            throw new Error("Phone number should be minimum 10 digits");
        }

        const update = {};
        Object.keys(payload).forEach((key) => {
            if (payload[key]) {
                update[key] = payload[key];
            }
        });

        const restaurant = await Restaurant.findByIdAndUpdate(id, update, {
            new: true,
        }).lean();

        if (!restaurant) {
            throw new Error("Restaurant not found");
        }

        return success(
            res,
            "Restaurant details updated successfully",
            restaurant,
            201
        );
    } catch (error) {
        console.log(error);
        return failure(res, error);
    }
};

exports.markRestaurantStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        const restaurant = await Restaurant.findByIdAndUpdate(
            id,
            { isActive: Boolean(isActive) },
            { new: true }
        ).lean();

        if (!restaurant) {
            throw new Error("Restaurant not found");
        }

        return success(res, "Restaurant status updated", restaurant, 201);
    } catch (error) {
        console.log(error);
        return failure(res, error);
    }
};

exports.getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find().lean();

        return success(
            res,
            "Restaurant list fetched successfully",
            restaurants,
            201
        );
    } catch (error) {
        console.log(error);
        return failure(res, error);
    }
};

exports.getRestaurantDetails = async (req, res) => {
    try {
        const { id } = req.params;

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
        const { id } = req.params;

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

exports.createRestaurantAdmin = async (req, res) => {
    try {
        const { id, email, password } = req.body;

        if (!email || !password || !id) {
            throw new Error("Please provide restaurant id, email and password");
        }

        const restaurant = await Restaurant.findById(id, { _id: 1 }).lean();

        if (!restaurant) {
            throw new Error("Restaurant not found");
        }

        const existingUser = await User.findOne({ email }, { _id: 1 }).lean();

        if (existingUser) {
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            email,
            password: hashedPassword,
            restaurantId: id,
            type: usertype.RESTAURANT_ADMIN,
        });

        await user.save();

        return success(
            res,
            "Restaurant admin created successfully",
            { id: user._id },
            201
        );
    } catch (error) {
        console.log(error);
        return failure(res, error);
    }
};
