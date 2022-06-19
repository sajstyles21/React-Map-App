const jwt = require("jsonwebtoken");

const verifyTokenAndInputs = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
      if (err) {
        return res.status(403).json("Wrong Token");
      } else {
        if (!req.body.name) {
          return res.status(401).json("Name is required");
        }
        if (!req.body.userId) {
          return res.status(401).json("User ID is required");
        }
        if (!req.body.lat && !req.body.long) {
          return res.status(401).json("Lat and Long is required");
        }
        req.user = user;
        return next();
      }
    });
  } else {
    return res.status(401).json("You are not authenticated");
  }
};

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
      if (err) {
        return res.status(403).json("Wrong Token");
      } else {
        req.user = user;
        return next();
      }
    });
  } else {
    return res.status(401).json("You are not authenticated");
  }
};

module.exports = { verifyTokenAndInputs, verifyToken };
