const Admin = require("../models/Admin");
const User = require("../models/User");
const Course = require("../models/Course");
const Recommendation = require("../models/Recommendation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const courseData = (body) => ({
    title: body.title?.trim(),
    description: body.description?.trim(),
    skills: Array.isArray(body.skills) ? body.skills.map((skill) => String(skill).trim()).filter(Boolean) : [],
    level: body.level || "Beginner",
    category: body.category?.trim(),
    duration: body.duration?.trim() || "",
    url: body.url?.trim() || "",
    resources: {
        youtube: body.resources?.youtube?.trim() || "",
        website: body.resources?.website?.trim() || "",
        practice: body.resources?.practice?.trim() || ""
    }
});

const validateCourse = (course) => (!course.title || !course.description || !course.category
    ? "Title, description and category are required" : null);

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "Please enter email and password" });

        const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(401).json({ message: "Invalid admin email or password" });
        }

        const token = jwt.sign({ id: admin._id, email: admin.email, role: "admin" }, "SKILLSYNC_SECRET_KEY", { expiresIn: "1d" });
        res.status(200).json({ message: "Admin login successful", token, admin: { id: admin._id, name: admin.name, email: admin.email } });
    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const getDashboard = async (req, res) => {
    try {
        const [users, courses, recommendations, recentUsers, recentCourses] = await Promise.all([
            User.countDocuments(), Course.countDocuments(), Recommendation.countDocuments(),
            User.find().select("name email skills careerGoal experienceLevel createdAt").sort({ createdAt: -1 }).limit(5),
            Course.find().select("title category level duration createdAt").sort({ createdAt: -1 }).limit(5)
        ]);
        res.json({ summary: { users, courses, recommendations }, recentUsers, recentCourses });
    } catch (error) {
        console.error("Admin dashboard error:", error);
        res.status(500).json({ message: "Could not load dashboard data" });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("name email skills careerGoal experienceLevel interests createdAt").sort({ createdAt: -1 });
        res.json({ users });
    } catch (error) { res.status(500).json({ message: "Could not load users" }); }
};

const deleteUser = async (req, res) => {
    try {
        if (!await User.findByIdAndDelete(req.params.id)) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (error) { res.status(400).json({ message: "Could not delete user" }); }
};

const getCourses = async (req, res) => {
    try { res.json({ courses: await Course.find().sort({ createdAt: -1 }) }); }
    catch (error) { res.status(500).json({ message: "Could not load courses" }); }
};

const createCourse = async (req, res) => {
    try {
        const data = courseData(req.body); const validationError = validateCourse(data);
        if (validationError) return res.status(400).json({ message: validationError });
        const course = await Course.create(data);
        res.status(201).json({ message: "Course created successfully", course });
    } catch (error) { res.status(400).json({ message: "Could not create course" }); }
};

const updateCourse = async (req, res) => {
    try {
        const data = courseData(req.body); const validationError = validateCourse(data);
        if (validationError) return res.status(400).json({ message: validationError });
        const course = await Course.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.json({ message: "Course updated successfully", course });
    } catch (error) { res.status(400).json({ message: "Could not update course" }); }
};

const deleteCourse = async (req, res) => {
    try {
        if (!await Course.findByIdAndDelete(req.params.id)) return res.status(404).json({ message: "Course not found" });
        res.json({ message: "Course deleted successfully" });
    } catch (error) { res.status(400).json({ message: "Could not delete course" }); }
};

module.exports = { loginAdmin, getDashboard, getUsers, deleteUser, getCourses, createCourse, updateCourse, deleteCourse };
