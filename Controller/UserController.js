const ProductModel = require("../Model/product");
const ITEMS_PER_PAGE = 3;
exports.userValueDisplay = (req, res) => {
  const page = +req.query.page || 1;
  ProductModel.find()
    .countDocuments()
    .then((numProducts) => {
      totalItems = numProducts;
      return ProductModel.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })

    .then((products) => {
      res.render("User/ViewProduct", {
        titlePage: "User Products",
        path: "/user/products",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        data: products,
      });
    })
    .catch((err) => {
      console.log("error in fetching", err);
    });
};

exports.viewSingleProduct = (req, res) => {
  const product_id = req.params.pid;
  console.log("Collected product id:", product_id);
  ProductModel.findById(product_id)
    .then((product) => {
      console.log("Product found by id:", product);
      res.render("User/ProductDetails", {
        titlePage: "Product Details",
        path: "/productDetails/:pid",
        data: product,
      });
    })
    .catch((err) => {
      console.log("Product not found", err);
    });
};
exports.addToCartProduct = (req, res) => {
  const product_id = req.params.pid;
  console.log("Collected product id:", product_id);
  ProductModel.findById(product_id)
    .then((product) => {
      console.log("Product found by id:", product);
      res.render("User/AddToCart", {
        titlePage: "Cart Section",
        path: "/addToCart/:pid",
        data: product,
      });
    })
    .catch((err) => {
      console.log("Product not found", err);
    });
};
exports.viewSearchedProduct = (req, res) => {
  const search = req.body.search;
  const page = +req.query.page || 1;
  console.log("Collected product title:", search);
  ProductModel.find({ pTitle: search })
    .then((result) => {
      console.log("Product found by id:", result);
      res.render("User/ViewProduct", {
        titlePage: "My Product",
        path: "",
               currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        data: result,
      });
    })
    .catch((err) => {
      console.log("Product not found", err);
    });
};


exports.getProductDisplayWithPprice=(req,res)=>{

  const page = +req.query.page || 1;
  ProductModel.find({},{"pImage":1,"pPrice":1,"pTitle":1,"pDescription":1}).sort({"pPrice":1}).then(allproducts=>{
      res.render('User/viewProduct',{ titlePage: "Price Low->High", data: allproducts, currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      path:'/viewProduct/Pprice'});
  })
  .catch(err=>{
      console.log("error to fetch data",err);
  })
};


exports.getProductDisplayWithPpriceHL=(req,res)=>{
 
  const page = +req.query.page || 1;
  ProductModel.find({},{"pImage":1,"pPrice":1,"pTitle":1,"pDescription":1}).sort({"pPrice":-1}).then(allproducts=>{
      res.render('User/viewProduct',{ titlePage: "Price High->Low", data: allproducts, currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      path:'/viewProduct/PpriceHL'});
  })
  .catch(err=>{
      console.log("error to fetch data",err);
  })
};
