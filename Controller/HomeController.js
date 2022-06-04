exports.getHomePage = (req, res) => {
  res.render("Home", {
    titlePage: "Home Page",
    path: "/",
    User:req.session.user,
  });
};
