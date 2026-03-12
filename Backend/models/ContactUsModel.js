const { Schema, model } = require("mongoose");

const contactUsSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = model("contactus", contactUsSchema);