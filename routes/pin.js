const router = require("express").Router();
const Pin = require("../models/pin");
const { verifyTokenAndInputs, verifyToken } = require("./validations");

//Add Pin
router.post("/add", verifyTokenAndInputs, async (req, res) => {
  const newPin = new Pin({
    name: req.body.name,
    description: req.body.desc,
    rating: req.body.rating,
    tags: req.body.tags,
    userId: req.body.userId,
    lat: req.body.lat,
    long: req.body.long,
  });
  try {
    const response = await newPin.save();
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//Get All Pins
router.get("/all", async (req, res) => {
  try {
    const response = await Pin.find().populate("userId").sort({ _id: -1 });
    return res.status(200).json(response);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
