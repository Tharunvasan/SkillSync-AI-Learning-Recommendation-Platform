const Course = require("../models/Course");

const createCourse = async (req, res) => {

    try {

        const {
            title,
            description,
            skills,
            level,
            category,
            duration,
            url
        } = req.body;

        // Check required fields
        if (!title || !description || !category) {
            return res.status(400).json({
                message: "Title, description and category are required"
            });
        }

        const course = await Course.create({
            title,
            description,
            skills: skills || [],
            level: level || "Beginner",
            category,
            duration: duration || "",
            url: url || ""
        });

        res.status(201).json({
            message: "Course created successfully",
            course
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createCourse
};