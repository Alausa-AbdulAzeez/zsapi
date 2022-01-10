const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeder = req.headers.token;
  if (authHeder) {
    const token = authHeder.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      err && res.status(403).json("Invalid token");
      req.user = user;
      next();
    });
  } else {
    res.status(403).json("You are not authorized");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin || req.user.isAttendant) {
      next();
    } else {
      res.status(403).json("You are not authorized");
    }
  });
};
const verifyTokenAndIsAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not authorized");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndIsAdmin,
};
