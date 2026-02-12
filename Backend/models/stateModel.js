const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema({
    state_name: { type: String, required: true },
    state_status: { type: String, default: "0" },
});

module.exports = mongoose.model("states", stateSchema);
