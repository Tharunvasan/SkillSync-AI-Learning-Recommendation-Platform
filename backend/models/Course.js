const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    skills: {
        type: [String],
        default: []
    },

    level: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
        default: "Beginner"
    },

    category: {
        type: String,
        required: true
    },

    duration: {
        type: String,
        default: ""
    },

    url: {
        type: String,
        default: ""
    },
resources: {
    youtube: {
        type: String,
        default: ""
    },
    website: {
        type: String,
        default: ""
    },
    practice: {
        type: String,
        default: ""
    }
}
}, {
    timestamps: true
});

module.exports = mongoose.model("Course", courseSchema);