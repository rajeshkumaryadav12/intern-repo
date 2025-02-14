const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    gender: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },  // ✅ Make sure it's "dateOfBirth"
    country: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
