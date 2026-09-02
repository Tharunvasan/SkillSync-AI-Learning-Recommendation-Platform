const axios = require("axios");

const User = require("../models/User");
const Course = require("../models/Course");


const getRecommendations = async (req, res) => {

    try {

        // Find logged-in user
        const user = await User.findById(req.user.id);

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }


        // Send actual user profile to Python AI
        const response = await axios.post(
            "http://127.0.0.1:8000/recommend",
            {
                skills: user.skills,
                careerGoal: user.careerGoal,
                interests: user.interests,
                experienceLevel: user.experienceLevel
            }
        );


        // AI recommendations
        const aiRecommendations =
            response.data.recommendations;


        // Get all courses from MongoDB
        const courses = await Course.find();


        // Add MongoDB resources to AI recommendations
        const recommendations = aiRecommendations.map(
            (recommendation) => {

                const aiCourse =
                    recommendation.course;


                // Find matching MongoDB course
                const mongoCourse =
                    courses.find(
                        (course) =>
                            course.title === aiCourse.title
                    );


                return {

                    course: {

                        id: aiCourse.id,

                        title: aiCourse.title,

                        description:
                            aiCourse.description,

                        skills:
                            aiCourse.skills,

                        level:
                            aiCourse.level,

                        category:
                            aiCourse.category,

                        duration:
                            aiCourse.duration,

                        url:
                            aiCourse.url,


                        // ADD RESOURCES
                        resources: mongoCourse
                            ? {
                                youtube:
                                    mongoCourse.resources?.youtube || "",

                                website:
                                    mongoCourse.resources?.website || "",

                                practice:
                                    mongoCourse.resources?.practice || ""
                            }
                            : {
                                youtube: "",
                                website: "",
                                practice: ""
                            }
                    },


                    reason:
                        recommendation.reason,

                    score:
                        recommendation.score
                };

            }
        );


        // Send final response
        res.status(200).json({

            message:
                "AI recommendations generated successfully",

            recommendations:
                recommendations

        });


    } catch (error) {

        console.log(
            "AI Recommendation Error:",
            error.message
        );


        res.status(500).json({

            message:
                "Failed to generate AI recommendations"

        });

    }

};


module.exports = {
    getRecommendations
};