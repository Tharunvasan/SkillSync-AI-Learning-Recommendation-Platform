const express = require("express");

const router = express.Router();

const {
    loginAdmin
} = require("../controllers/adminController");

const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");

const {
    createCourse
} = require("../controllers/courseController");


// Admin login
router.post("/login", loginAdmin);


// Admin dashboard
router.get(
    "/dashboard",
    protect,
    adminOnly,
    (req, res) => {

        res.json({
            message: "Welcome to Admin Dashboard",
            admin: req.user
        });

    }
);


// Create course
router.post(
    "/courses",
    protect,
    adminOnly,
    createCourse
);


module.exports = router;