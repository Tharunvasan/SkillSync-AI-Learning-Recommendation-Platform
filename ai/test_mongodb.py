from pymongo import MongoClient

client = MongoClient("mongodb://127.0.0.1:27017/")

db = client["skillsync"]

courses = db["courses"]

print("MongoDB connected!")

print("Number of courses:", courses.count_documents({}))

for course in courses.find():
    print(course["title"])