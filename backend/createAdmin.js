const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

const createAdmin = async () => {

    try {

        await mongoose.connect(
            "mongodb://127.0.0.1:27017/skillsync"
        );

        console.log("MongoDB Connected");

        const existingAdmin = await Admin.findOne({
            email: "admin@skillsync.com"
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash(
            "admin123",
            10
        );

        await Admin.create({
            name: "SkillSync Admin",
            email: "admin@skillsync.com",
            password: hashedPassword
        });

        console.log("Admin created successfully");

        process.exit();

    } catch (error) {

        console.log("Error:", error);

        process.exit(1);
    }
};

createAdmin();