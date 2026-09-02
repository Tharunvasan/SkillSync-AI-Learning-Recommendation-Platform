const express = require("express");

const Course = require("../models/Course");

const router = express.Router();

router.get("/", async (req, res) => {

    try {

        const courses = await Course.find();

        res.status(200).json({
            message: "Courses fetched successfully",
            courses: courses
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;