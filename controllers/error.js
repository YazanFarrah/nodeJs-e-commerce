exports.get404 = (req, res, next) => {
  // res.status(404).send('<h1>Page not found Error 404</h1>');
  // res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
  res.status(404).render("404", {
    pageTitle: "Page not found",
    path: "/404",
    isAuthenticated: req.isLoggedIn,
  });
};
