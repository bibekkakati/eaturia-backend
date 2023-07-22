const express = require("express");
const publicController = require("../controllers/publicController");

const router = express.Router();

router.post("/order", publicController.createOrder);
router.get("/order/:id", publicController.getOrderDetails);
router.get("/menu/:id", publicController.getRestaurantMenu);

module.exports = router;
