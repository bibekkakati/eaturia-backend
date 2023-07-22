const express = require("express");
const restaurantController = require("../controllers/restaurantController");

const router = express.Router();

router.post("/menu", restaurantController.createMenu);
router.put("/menu/:id", restaurantController.updateMenu);
router.put("/menu-live/:id", restaurantController.liveMenu);
router.put("/order-status/:id", restaurantController.updateOrderStatus);
router.delete("/menu/:id", restaurantController.deleteMenu);
router.get("/menu-list", restaurantController.getMenusByRestaurant);
router.get("/menu/:id", restaurantController.getMenuById);
router.get("/", restaurantController.getRestaurantDetails);
router.get("/admin-list", restaurantController.getRestaurantAdminList);
router.get("/order-list", restaurantController.getOrdersByRestaurant);
router.get("/order/:id", restaurantController.getOrderDetails);

module.exports = router;
