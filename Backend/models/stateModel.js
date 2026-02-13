const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema({
    state_id: { type: String},
    state_name: { type: String },
});

module.exports = mongoose.model("states", stateSchema);
