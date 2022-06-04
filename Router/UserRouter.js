const express = require("express");
const auth_check = require("../middle-ware/auth");

const UserController = require("../Controller/UserController");
const User_Router = express.Router();
User_Router.get("/user/products", UserController.userValueDisplay);
User_Router.get("/productDetails/:pid", UserController.viewSingleProduct);
User_Router.get("/addToCart/:pid",auth_check, UserController.addToCartProduct);
User_Router.get('/viewProduct/Pprice',UserController.getProductDisplayWithPprice);
User_Router.get('/viewProduct/PpriceHL',UserController.getProductDisplayWithPpriceHL);

User_Router.post("/searchData", UserController.viewSearchedProduct);

module.exports = User_Router;
