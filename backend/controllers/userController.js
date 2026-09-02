const User = require("../models/User");

const getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "Profile fetched successfully",
            user: user
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const updateProfile = async (req, res) => {

    try {

        const {
            name,
            skills,
            careerGoal,
            experienceLevel,
            interests
        } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (name !== undefined) {
            user.name = name;
        }

        if (skills !== undefined) {
            user.skills = skills;
        }

        if (careerGoal !== undefined) {
            user.careerGoal = careerGoal;
        }

        if (experienceLevel !== undefined) {
            user.experienceLevel = experienceLevel;
        }

        if (interests !== undefined) {
            user.interests = interests;
        }

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                skills: user.skills,
                careerGoal: user.careerGoal,
                experienceLevel: user.experienceLevel,
                interests: user.interests
            }
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    getProfile,
    updateProfile
};