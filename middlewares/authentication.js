exports.authenticateUser = (req, res, next) => {
    if (req.session && req.session.username) {
      // User is logged in, allow access
      next();
    } else {
      // User is not logged in, deny access
      res.redirect('/game'); // Redirect to the login page
    }
  };
  