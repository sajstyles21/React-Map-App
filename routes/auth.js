const User = require("../models/User");
const router = require("express").Router();
const cryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//Register
router.post("/register", async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: cryptoJS.AES.encrypt(
      req.body.password,
      process.env.SECRET_KEY
    ).toString(),
  });
  try {
    if (!req.body.name) {
      return res.status(401).json("Name is required");
    }
    if (!req.body.email) {
      return res.status(401).json("Email is required");
    }
    if (!req.body.password) {
      return res.status(401).json("Password is required");
    }
    const response = await user.save();
    res.status(200).json(response);
  } catch (err) {
    let newErr;
    if (err.code === 11000) {
      err.code === 11000 && err.keyPattern.email === 1
        ? (newErr = "Email already exists")
        : "";
      res.status(400).json(newErr);
    } else {
      res.status(500).json(err);
    }
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    if (!req.body.email) {
      return res.status(401).json("Email is required");
    }
    if (!req.body.password) {
      return res.status(401).json("Password is required");
    }
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).json("User not found");
    } else {
      const decryptedPassword = cryptoJS.AES.decrypt(
        user.password,
        process.env.SECRET_KEY
      ).toString(cryptoJS.enc.Utf8);

      if (decryptedPassword !== req.body.password) {
        res.status(401).json("Wrong password");
      } else {
        const accessToken = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_KEY,
          { expiresIn: "10h" }
        );
        const refreshToken = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_KEY
        );
        refreshTokens.push(refreshToken);
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken, refreshToken });
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

let refreshTokens = [];
//Refresh
router.post("/refresh", (req, res) => {
  const refreshToken = req.body.token;
  try {
    if (!refreshToken) {
      return res.status(401).json("Token is required");
    }
    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json("Invalid Token");
    }
    jwt.verify(refreshToken, process.env.JWT_KEY, (err, user) => {
      if (err) {
        return res.status(403).json("Wrong Token");
      } else {
        const accessToken = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_KEY,
          { expiresIn: "10s" }
        );
        const newRefreshToken = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_KEY
        );
        refreshTokens = refreshTokens.filter(
          (oldToken) => oldToken !== refreshToken
        );
        refreshTokens.push(newRefreshToken);
        res.status(200).json({ accessToken, refreshToken: newRefreshToken });
      }
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//Logout
module.exports = router;
