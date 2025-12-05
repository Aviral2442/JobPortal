const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  remember: { type: Boolean, default: false }
});

module.exports = mongoose.model("logins", loginSchema);
