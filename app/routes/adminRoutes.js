const express = require("express");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.post("/restaurant", adminController.createRestaurant);
router.post("/restaurant-admin", adminController.createRestaurantAdmin);
router.put("/restaurant/:id", adminController.updateRestaurant);
router.put("/restaurant-status/:id", adminController.markRestaurantStatus);
router.get("/restaurant-list", adminController.getRestaurants);
router.get("/restaurant/:id", adminController.getRestaurantDetails);
router.get("/restaurant-admin/:id", adminController.getRestaurantAdminList);

module.exports = router;
