const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
    city_id: { type: String, unique: true },
    city_name: { type: String, required: true },
    city_status: { type: String, default: "0" },
    city_state: { type: mongoose.Schema.Types.ObjectId, ref: "states", required: true }, 
});

module.exports = mongoose.model("cities", citySchema);
