# 🎯 SkillSync — AI Learning Recommendation Platform

> A full-stack AI-powered learning recommendation platform that suggests relevant courses based on a learner's skills, career goals, experience level, and interests. SkillSync combines a **React** frontend, **Node.js/Express** backend, **MongoDB** database, and a **Python (TF-IDF + cosine similarity)** recommendation engine.

<p align="left">
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Python-Flask-3776AB?logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/status-in%20development-yellow" alt="Status"/>
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License"/>
</p>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Frontend Applications](#️-frontend-applications)
- [How It Works](#-how-it-works)
- [AI Recommendation System](#-ai-recommendation-system)
- [Admin Dashboard Flow](#-admin-dashboard-flow)
- [Technology Stack](#️-technology-stack)
- [Project Structure](#-project-structure)
- [Backend API](#-backend-api)
- [Database Models](#️-database-models)
- [Installation and Setup](#️-installation-and-setup)
- [Create an Admin Account](#-create-an-admin-account)
- [Usage](#-usage)
- [Security Notes](#-security-notes)
- [Future Improvements](#-future-improvements)
- [Author](#-author)
- [Support](#-support)

---

## 📖 Overview

**SkillSync** helps learners find courses that match their current skills and career direction, instead of browsing a generic course catalog. The platform analyzes learner profile data to calculate relevance scores for each course and explains **why** it was recommended.

The project ships with two distinct experiences:

| Experience | Description |
| --- | --- |
| 🧑‍🎓 **Learner website** | Registration, profile editing, AI recommendations, course details, and learning resources |
| 🛠️ **Admin dashboard** | Secure admin login, dashboard summary, learner management, and full course management |

---

## ✨ Key Features

| Feature | Status |
| --- | :---: |
| User registration and login | ✅ |
| JWT-based authentication | ✅ |
| Profile editing (skills, interests, career goal, experience) | ✅ |
| MongoDB course catalog | ✅ |
| AI-powered recommendations | ✅ |
| TF-IDF and cosine similarity scoring | ✅ |
| Match score and recommendation reason | ✅ |
| Course learning resources | ✅ |
| Separate Admin Dashboard UI | ✅ |
| Admin login and role-based access control | ✅ |
| Admin learner management | ✅ |
| Admin course add / edit / delete | ✅ |

---

## 🖥️ Frontend Applications

### Learner Website

```text
http://localhost:5173
```

Learners can:

- Create an account and log in
- Update profile information
- Add skills and interests
- Select a career goal and experience level
- Receive personalized AI recommendations
- View course details and relevance scores
- Open YouTube, official website, and practice resources

### Admin Dashboard

```text
http://localhost:5173/admin
```

The learner login page includes an **Admin login** link to this address.

Administrators can:

- Log in with an admin account
- View learner and course totals
- View recent learners and recent courses
- View every learner
- Delete a learner
- Create, edit, or delete a course

> ⚠️ The admin session is **not** persisted after refresh — reopening or refreshing `/admin` requires logging in again.

---

## 🔄 How It Works

1. A learner registers or logs in.
2. The learner completes a profile with skills, career goal, interests, and experience level.
3. React requests recommendations from the Express backend.
4. Express verifies the learner's JWT and retrieves their profile from MongoDB.
5. The backend forwards the profile to the Python Flask AI service.
6. The AI service scores available courses using skill matches, TF-IDF/cosine similarity, and experience-level matching.
7. The top five recommendations are returned to Express.
8. Express attaches the learning-resource data stored with each MongoDB course.
9. React displays the recommendations, reasons, scores, and resources.

```text
Learner
   ↓
React Frontend
   ↓  JWT-protected request
Node.js / Express Backend
   ↓                 ↓
MongoDB          Flask AI Service
Users/Courses          ↓
                 TF-IDF + Cosine Similarity
                         ↓
                 Ranked recommendations
                         ↓
                  React course cards
```

---

## 🧠 AI Recommendation System

The recommendation service lives in `ai/app.py`.

SkillSync builds a learner representation from:

```text
skills
careerGoal
interests
experienceLevel
```

### Example Learner Profile

```json
{
  "skills": ["React", "MongoDB"],
  "careerGoal": "Full Stack Developer",
  "experienceLevel": "Intermediate",
  "interests": ["Web Development"]
}
```

### Recommendation Score

| Component | Weight | Method |
| --- | ---: | --- |
| Skill match | 50% | Matching learner and course skills |
| Career-goal match | 25% | TF-IDF cosine similarity |
| Interest match | 15% | TF-IDF cosine similarity |
| Experience-level match | 10% | Exact level match |

```text
final_score =
    (skill_score      × 0.50)
  + (career_score     × 0.25)
  + (interest_score   × 0.15)
  + (level_score      × 0.10)
```

Each result includes a numeric score and a human-readable reason, for example:

```text
This course matches your skill: react and matches your career goal.
```

---

## 👨‍💼 Admin Dashboard Flow

```text
Admin Login (/admin)
        ↓
Admin JWT
        ↓
Protected Admin APIs
        ↓
Dashboard Overview
   ├── Learner count
   ├── Course count
   ├── Recent learners
   └── Recent courses
        ↓
Manage learners and courses
```

> ℹ️ The recommendation total currently displays `0` — recommendations are generated live by the Python service and are not yet persisted as database records.

---

## 🛠️ Technology Stack

<table>
<tr>
<td valign="top" width="25%">

**Frontend**
- React 19
- Vite
- Axios
- JavaScript / JSX
- CSS

</td>
<td valign="top" width="25%">

**Backend**
- Node.js
- Express.js
- Mongoose
- REST APIs
- JWT middleware

</td>
<td valign="top" width="25%">

**Database**
- MongoDB
- Mongoose
- PyMongo

</td>
<td valign="top" width="25%">

**AI / ML**
- Python
- Flask
- scikit-learn
- `TfidfVectorizer`
- `cosine_similarity`

</td>
</tr>
</table>

**Authentication & Security:** JSON Web Tokens · bcryptjs password hashing · protected API routes · admin-only authorization

---

## 📁 Project Structure

```text
SkillSync/
│
├── ai/
│   ├── app.py                         # Flask recommendation API
│   ├── recommendation.py              # Recommendation logic/testing
│   └── test_mongodb.py                # MongoDB connectivity test
│
├── backend/
│   ├── controllers/
│   │   ├── adminController.js          # Admin login, dashboard, users, courses
│   │   ├── authController.js           # Learner registration/login
│   │   ├── courseController.js
│   │   ├── recommendationController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js           # JWT and admin authorization
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Course.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── recommendationRoutes.js
│   │   └── userRoutes.js
│   ├── createAdmin.js
│   ├── updateCourses.js
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── AdminApp.jsx                # Separate admin application
    │   ├── AdminApp.css
    │   ├── App.jsx                     # Learner application
    │   ├── App.css
    │   ├── index.css
    │   └── main.jsx                    # Chooses / or /admin app
    ├── package.json
    └── vite.config.js
```

---

## 🔌 Backend API

### 🔐 Learner Authentication — `/api/auth`

| Method | Endpoint | Purpose | Auth |
| --- | --- | --- | :---: |
| POST | `/api/auth/register` | Register a new learner | ❌ |
| POST | `/api/auth/login` | Learner login and JWT | ❌ |

### 👤 Learner Profile — `/api/user`

| Method | Endpoint | Purpose | Auth |
| --- | --- | --- | :---: |
| GET | `/api/user/profile` | Get logged-in learner profile | ✅ JWT |
| PUT | `/api/user/profile` | Update logged-in learner profile | ✅ JWT |

### 📚 Public Courses — `/api/courses`

| Method | Endpoint | Purpose | Auth |
| --- | --- | --- | :---: |
| GET | `/api/courses` | Get all courses | ❌ |

### 🤖 Recommendations — `/api/recommendations`

| Method | Endpoint | Purpose | Auth |
| --- | --- | --- | :---: |
| GET | `/api/recommendations` | Get top AI recommendations | ✅ JWT |

### 👨‍💼 Admin — `/api/admin`

| Method | Endpoint | Purpose | Auth |
| --- | --- | --- | :---: |
| POST | `/api/admin/login` | Admin login | ❌ |
| GET | `/api/admin/dashboard` | Dashboard totals and recent data | ✅ Admin JWT |
| GET | `/api/admin/users` | Get all learners | ✅ Admin JWT |
| DELETE | `/api/admin/users/:id` | Delete learner | ✅ Admin JWT |
| GET | `/api/admin/courses` | Get all courses for admin | ✅ Admin JWT |
| POST | `/api/admin/courses` | Create course | ✅ Admin JWT |
| PUT | `/api/admin/courses/:id` | Update course | ✅ Admin JWT |
| DELETE | `/api/admin/courses/:id` | Delete course | ✅ Admin JWT |

---

## 🗄️ Database Models

### User

| Field | Type | Description |
| --- | --- | --- |
| `name` | String | Learner name |
| `email` | String | Unique learner email |
| `password` | String | Bcrypt-hashed password |
| `skills` | `[String]` | Learner skills |
| `careerGoal` | String | Desired career |
| `experienceLevel` | String | Beginner, Intermediate, or Advanced |
| `interests` | `[String]` | Learner interests |

### Admin

| Field | Type | Description |
| --- | --- | --- |
| `name` | String | Administrator name |
| `email` | String | Unique admin email |
| `password` | String | Bcrypt-hashed password |

### Course

| Field | Type | Description |
| --- | --- | --- |
| `title` | String | Course title |
| `description` | String | Course description |
| `skills` | `[String]` | Skills covered |
| `level` | String | Beginner, Intermediate, or Advanced |
| `category` | String | Course category |
| `duration` | String | Course duration |
| `url` | String | Course URL |
| `resources.youtube` | String | YouTube resource |
| `resources.website` | String | Official website resource |
| `resources.practice` | String | Practice resource |

---

## ⚙️ Installation and Setup

SkillSync requires MongoDB and **three** running services:

1. Python AI service
2. Node.js backend
3. React frontend

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Tharunvasan/SkillSync-AI-Learning-Recommendation-Platform.git
cd SkillSync-AI-Learning-Recommendation-Platform
```

### 2️⃣ Start MongoDB

Make sure MongoDB is running locally.

```text
Database: skillsync
```

### 3️⃣ Start the Python AI Service

Open terminal 1:

```powershell
cd ai
python app.py
```

Runs at:

```text
http://localhost:8000
```

### 4️⃣ Start the Node.js Backend

Open terminal 2:

```powershell
cd backend
npm install
node server.js
```

Runs at:

```text
http://localhost:5000
```

Expected output:

```text
Server running on port 5000
MongoDB Connected
```

### 5️⃣ Start the React Frontend

Open terminal 3:

```powershell
cd frontend
npm install
npm run dev
```

Runs at:

```text
http://localhost:5173
```

---

## 👨‍💼 Create an Admin Account

Run this once, after MongoDB is running:

```powershell
cd backend
node createAdmin.js
```

Default development credentials:

```text
Email: admin@skillsync.com
Password: admin123
```

> ⚠️ **Change these credentials before deployment.**

---

## 🚀 Usage

### Learner Flow

1. Open `http://localhost:5173`.
2. Register an account or log in.
3. Open the profile page.
4. Add skills, career goal, experience level, and interests.
5. Save the profile.
6. View AI-generated course recommendations.
7. Select **View Course** for details and learning resources.

### Admin Flow

1. Open `http://localhost:5173/admin`, or select **Admin login** from the learner login screen.
2. Enter the admin email and password.
3. Use **Overview** to view totals and recent data.
4. Use **Users** to review or delete learner accounts.
5. Use **Courses** to add, edit, or delete courses.
6. Select **Sign out** when finished.

---

## 🔐 Security Notes

- Passwords are hashed with `bcryptjs`.
- Protected requests use `Authorization: Bearer <token>`.
- Admin routes verify that the token role is `admin`.
- Admin login tokens are held only in the active browser page and are cleared on refresh.

> Before production deployment, move the MongoDB connection string and JWT secret into environment variables. **Do not** keep production secrets or default passwords in source code.

---

## 🔮 Future Improvements

- [ ] Persist recommendation history in MongoDB
- [ ] Show real recommendation history/count in the admin dashboard
- [ ] Course completion and progress tracking
- [ ] Learner search, pagination, and filters for admins
- [ ] Admin password-change screen
- [ ] Automated frontend, backend, and AI tests
- [ ] Docker Compose setup
- [ ] Production deployment with HTTPS
- [ ] Improved ML recommendation models

---

## 👤 Author

**Tharunvasan**

GitHub: [@Tharunvasan](https://github.com/Tharunvasan)

---

## ⭐ Support

If you find this project useful, consider giving the repository a **star** — it helps others discover it too!
