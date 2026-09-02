from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# -----------------------------------
# CONNECT TO MONGODB
# -----------------------------------

client = MongoClient("mongodb://127.0.0.1:27017/")

db = client["skillsync"]

courses_collection = db["courses"]


# -----------------------------------
# USER PROFILE
# -----------------------------------

user_profile = """
Java JavaScript MongoDB
Full Stack Developer
Intermediate
Web Development AI
"""


# -----------------------------------
# GET COURSES FROM MONGODB
# -----------------------------------

courses = list(courses_collection.find())

print("Courses loaded from MongoDB:", len(courses))


# -----------------------------------
# CREATE COURSE TEXT
# -----------------------------------

course_texts = []

for course in courses:

    text = (
        course.get("title", "") + " " +
        course.get("description", "") + " " +
        " ".join(course.get("skills", [])) + " " +
        course.get("level", "") + " " +
        course.get("category", "")
    )

    course_texts.append(text)


# -----------------------------------
# TF-IDF
# -----------------------------------

vectorizer = TfidfVectorizer()

course_vectors = vectorizer.fit_transform(course_texts)

user_vector = vectorizer.transform([user_profile])


# -----------------------------------
# COSINE SIMILARITY
# -----------------------------------

similarity_scores = cosine_similarity(
    user_vector,
    course_vectors
)[0]


# -----------------------------------
# CREATE RECOMMENDATIONS
# -----------------------------------

recommendations = []

for i in range(len(courses)):

    recommendations.append({
        "title": courses[i]["title"],
        "score": similarity_scores[i]
    })


# -----------------------------------
# SORT BY SCORE
# -----------------------------------

recommendations.sort(
    key=lambda x: x["score"],
    reverse=True
)


# -----------------------------------
# DISPLAY RESULTS
# -----------------------------------

print("\nSkillSync AI Recommendations\n")

for recommendation in recommendations:

    print(
        recommendation["title"],
        "->",
        round(recommendation["score"], 3)
    )