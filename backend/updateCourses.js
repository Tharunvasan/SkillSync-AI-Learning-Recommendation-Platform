const mongoose = require("mongoose");
const Course = require("./models/Course");

mongoose
    .connect("mongodb://127.0.0.1:27017/skillsync")
    .then(async () => {

        console.log("MongoDB Connected");

        const updates = [

            {
                title: "Complete React Course",

                resources: {
                    youtube:
                        "https://www.youtube.com/@TraversyMedia",

                    website:
                        "https://react.dev/learn",

                    practice:
                        "https://www.freecodecamp.org/learn/front-end-development-libraries/"
                }
            },


            {
                title: "Node.js Backend Development",

                resources: {
                    youtube:
                        "https://www.youtube.com/@TraversyMedia",

                    website:
                        "https://nodejs.org/en/learn",

                    practice:
                        "https://www.freecodecamp.org/learn/back-end-development-and-apis/"
                }
            },


            {
                title: "Advanced Java Programming",

                resources: {
                    youtube:
                        "https://www.youtube.com/@freecodecamp",

                    website:
                        "https://dev.java/learn/",

                    practice:
                        "https://www.hackerrank.com/domains/java"
                }
            },


            {
                title: "Data Structures and Algorithms",

                resources: {
                    youtube:
                        "https://www.youtube.com/@freecodecamp",

                    website:
                        "https://www.geeksforgeeks.org/data-structures/",

                    practice:
                        "https://leetcode.com/studyplan/"
                }
            },


            {
                title: "MongoDB for Developers",

                resources: {
                    youtube:
                        "https://www.youtube.com/@MongoDB",

                    website:
                        "https://learn.mongodb.com/",

                    practice:
                        "https://www.mongodb.com/docs/"
                }
            },


            {
                title: "Python for Artificial Intelligence",

                resources: {
                    youtube:
                        "https://www.youtube.com/@freecodecamp",

                    website:
                        "https://docs.python.org/3/tutorial/",

                    practice:
                        "https://www.kaggle.com/learn/python"
                }
            },


            {
                title: "Machine Learning Fundamentals",

                resources: {
                    youtube:
                        "https://www.youtube.com/@krishnaik06",

                    website:
                        "https://scikit-learn.org/stable/getting_started.html",

                    practice:
                        "https://www.kaggle.com/learn/intro-to-machine-learning"
                }
            }

        ];


        for (const update of updates) {

            await Course.updateOne(

                {
                    title: update.title
                },

                {
                    $set: {
                        resources: update.resources
                    }
                }

            );

            console.log(
                "Updated:",
                update.title
            );
        }


        console.log(
            "\nAll courses updated successfully!"
        );

        process.exit();

    })
    .catch((error) => {

        console.error(
            "MongoDB Error:",
            error
        );

        process.exit(1);

    });