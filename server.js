const express = require("express");
const webServer = express();
const { urlencoded } = require("express");

const UserModel = require("./Model/user");

const session = require("express-session");
const mongodb_session = require("connect-mongodb-session")(session);
const cookieParser = require("cookie-parser");
const csurf = require("csurf");
const multer = require("multer");
const flash = require("connect-flash");
// Multer is a node js middleware for handaling multipart/formdata
//which is primarily used for uploading files.

const mongoose = require("mongoose");
const dbDriver =
"mongodb+srv://chandan9051:chandan1234@cluster0.413hj.mongodb.net/FinalProject?retryWrites=true&w=majority";
const storeValue = new mongodb_session({
  uri:'mongodb+srv://chandan9051:chandan1234@cluster0.413hj.mongodb.net/FinalProject',
  collection: "my-session",
});
const shopController = require("./Controller/ShopController");
const Admin_Router = require("./Router/AdminRouter");
const User_Router = require("./Router/UserRouter");
const Home_Router = require("./Router/HomeRouter");
const Auth_Router = require("./Router/AuthRouter");
const Shop_Router = require("./Router/ShopRouter");



const path = require("path");
const csurfProtection = csurf();

webServer.use(urlencoded());
webServer.use(cookieParser());

// webServer.get("/setcookie", (req, res) => {
//   res.send("Cookie have been saved successfully");
// });
// webServer.get("/getcookie", (req, res) => {
//   //show the saved cookies
//   console.log(req.cookies);
//   res.send(req.cookies);
// });

webServer.use(flash());
webServer.set("view engine", "ejs");
webServer.set("views", "View");

webServer.use(express.static(path.join(__dirname, "Public")));

webServer.use(
  "/Uploaded_Images",
  express.static(path.join(__dirname, "Uploaded_Images")) // to store images
);

// to use the images folder after adding it to Database
const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "Uploaded_Images");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});
const fileFilter = (req, file, callback) => {
  if(file.mimetype.includes("png")||
  file.mimetype.includes("jpg")||
  file.mimetype.includes("jpeg")||
  file.mimetype.includes("avif")||
  file.mimetype.includes("webp")) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};
webServer.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
    limits: { fieldSize: 1024 * 1024 * 5 },
  }).single("p_img")
);
webServer.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    store: storeValue,
  })
);

webServer.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  UserModel.findById(req.session.user._id)
    .then((userValue) => {
      req.user = userValue;
      console.log("User Details:", req.user);
      next();
    })
    .catch((err) => {
      console.log("Error:", err);
    });
});
// Stripe deals with all security issues itself
// Therefore, that route is placed before csrf protection
// No need for csrf protection for that POST request
webServer.post("/create-order", shopController.postOrder);

webServer.use(csurfProtection);

webServer.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrf_token = req.csrfToken();
  next();
});

webServer.use(Admin_Router);
webServer.use(User_Router);
webServer.use(Home_Router);
webServer.use(Auth_Router);
webServer.use(Shop_Router);

mongoose
  .connect(dbDriver, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("Database is connected successfully");
    webServer.listen(4005, () => {
      console.log("Server is connected at localhost:4005");
    });
  })
  .catch((err) => {
    console.log("Database is not connected", err);
  });
