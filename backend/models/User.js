const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    skills: {
        type: [String],
        default: []
    },

    careerGoal: {
        type: String,
        default: ""
    },

    experienceLevel: {
        type: String,
        default: "Beginner"
    },

    interests: {
        type: [String],
        default: []
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);