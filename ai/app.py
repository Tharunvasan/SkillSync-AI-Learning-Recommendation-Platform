from flask import Flask, request, jsonify
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# MongoDB
client = MongoClient("mongodb://127.0.0.1:27017/")
db = client["skillsync"]
courses_collection = db["courses"]


def calculate_similarity(user_text, course_text):

    if not user_text.strip():
        return 0

    vectorizer = TfidfVectorizer()

    vectors = vectorizer.fit_transform([
        user_text,
        course_text
    ])

    score = cosine_similarity(
        vectors[0:1],
        vectors[1:2]
    )[0][0]

    return float(score)


@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "message": "SkillSync AI Server is running"
    })


@app.route("/recommend", methods=["POST"])
def recommend():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "message": "Request body is required"
            }), 400

        # User information
        skills = data.get("skills", [])
        career_goal = data.get("careerGoal", "")
        interests = data.get("interests", [])
        experience_level = data.get("experienceLevel", "")

        # Get courses
        courses = list(courses_collection.find())

        if not courses:
            return jsonify({
                "message": "No courses found"
            }), 404

        recommendations = []

        user_skills = set(
            skill.lower()
            for skill in skills
        )

        interest_text = " ".join(interests)

        for course in courses:

            course_skills = course.get("skills", [])
            course_category = course.get("category", "")
            course_level = course.get("level", "")
            course_description = course.get("description", "")

            course_skill_set = set(
                skill.lower()
                for skill in course_skills
            )

            # -----------------------------
            # SKILL SCORE
            # -----------------------------

            if user_skills and course_skill_set:

                skill_matches = user_skills.intersection(
                    course_skill_set
                )

                skill_score = (
                    len(skill_matches)
                    / len(user_skills)
                )

            else:

                skill_matches = set()
                skill_score = 0

            # -----------------------------
            # CAREER SCORE
            # -----------------------------

            career_score = calculate_similarity(
                career_goal,
                course_category + " " + course_description
            )

            # -----------------------------
            # INTEREST SCORE
            # -----------------------------

            interest_score = calculate_similarity(
                interest_text,
                course_category + " " +
                course_description + " " +
                " ".join(course_skills)
            )

            # -----------------------------
            # EXPERIENCE SCORE
            # -----------------------------

            if experience_level.lower() == course_level.lower():
                level_score = 1
            else:
                level_score = 0

            # -----------------------------
            # FINAL SCORE
            # -----------------------------

            final_score = (
                skill_score * 0.50 +
                career_score * 0.25 +
                interest_score * 0.15 +
                level_score * 0.10
            )

            # -----------------------------
            # REASON
            # -----------------------------

            reasons = []

            if skill_matches:
                matched = ", ".join(skill_matches)
                reasons.append(
                    f"matches your skill: {matched}"
                )

            if career_score > 0.10:
                reasons.append(
                    "matches your career goal"
                )

            if interest_score > 0.10:
                reasons.append(
                    "matches your interests"
                )

            if level_score == 1:
                reasons.append(
                    "matches your experience level"
                )

            if reasons:

                reason = "This course " + " and ".join(reasons) + "."

            else:

                reason = "This course has some relevance to your profile."

            recommendations.append({

                "course": {
                    "id": str(course["_id"]),
                    "title": course.get("title", ""),
                    "description": course.get("description", ""),
                    "skills": course.get("skills", []),
                    "level": course.get("level", ""),
                    "category": course.get("category", ""),
                    "duration": course.get("duration", ""),
                    "url": course.get("url", "")
                },

                "score": round(final_score, 3),

                "reason": reason

            })

        # Sort highest score first
        recommendations.sort(
            key=lambda x: x["score"],
            reverse=True
        )

        # Only return TOP 5
        top_recommendations = recommendations[:5]

        return jsonify({

            "message":
                "AI recommendations generated successfully",

            "recommendations":
                top_recommendations

        })

    except Exception as error:

        print("AI Error:", error)

        return jsonify({
            "message": "AI server error"
        }), 500


if __name__ == "__main__":

    app.run(
        port=8000,
        debug=True
    )