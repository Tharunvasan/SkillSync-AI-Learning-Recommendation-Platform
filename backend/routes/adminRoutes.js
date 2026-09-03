const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
    loginAdmin,
    getDashboard,
    getUsers,
    deleteUser,
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse
} = require("../controllers/adminController");

const router = express.Router();

router.post("/login", loginAdmin);

router.use(protect, adminOnly);
router.get("/dashboard", getDashboard);
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);
router.get("/courses", getCourses);
router.post("/courses", createCourse);
router.put("/courses/:id", updateCourse);
router.delete("/courses/:id", deleteCourse);

module.exports = router;
