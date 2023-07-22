exports.usertype = {
    SUPER_ADMIN: "SUPER_ADMIN",
    RESTAURANT_ADMIN: "RESTAURANT_ADMIN",
};

exports.userrouteaccess = {
    SUPER_ADMIN: {
        public: 1,
        auth: 0,
        admin: 1,
        restaurant: 0,
    },
    RESTAURANT_ADMIN: {
        public: 1,
        auth: 0,
        admin: 0,
        restaurant: 1,
    },
};

exports.publicroutes = {
    public: 1,
    auth: 1,
    admin: 0,
    restaurant: 0,
};

exports.menutemplates = ["BASIC"];

exports.orderstatus = ["PENDING", "PROCESSING", "DELIVERED", "CANCELLED"];
