const mongoose = require("mongoose");

const pinSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    rating: { type: Number },
    tags: { type: String },
    lat: { type: Number, required: true },
    long: { type: Number, required: true },
    userId: { type: String, required: true, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pin", pinSchema);
