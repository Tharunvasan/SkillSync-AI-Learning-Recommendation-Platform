import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5000";

function App() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
const [name, setName] = useState("");

  const [recommendations, setRecommendations] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [user, setUser] = useState(null);

  const [showProfile, setShowProfile] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    skills: [],
    careerGoal: "",
    experienceLevel: "Beginner",
    interests: []
  });

  const [skillsText, setSkillsText] = useState("");
  const [interestsText, setInterestsText] = useState("");

  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // -----------------------------
  // LOGIN
  // -----------------------------

  const handleLogin = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      const response = await axios.post(
        `${API}/api/auth/login`,
        {
          email,
          password
        }
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      setUser(response.data.user);
      setLoggedIn(true);

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Login failed"
      );

    } finally {

      setLoading(false);

    }
  };
  // -----------------------------
// REGISTER
// -----------------------------

const handleRegister = async (e) => {

  e.preventDefault();

  setLoading(true);
  setError("");
  setSuccess("");

  try {

    await axios.post(
      `${API}/api/auth/register`,
      {
        name,
        email,
        password
      }
    );

    setSuccess(
      "Registration successful! Please login."
    );

    // Switch back to login
    setIsRegister(false);

    // Clear fields
    setName("");
    setEmail("");
    setPassword("");

  } catch (err) {

    setError(
      err.response?.data?.message ||
      "Registration failed"
    );

  } finally {

    setLoading(false);

  }
};

  // -----------------------------
  // GET PROFILE
  // -----------------------------

  const fetchProfile = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API}/api/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = response.data.user;

      setUser(data);

      setProfile({
        name: data.name || "",
        skills: data.skills || [],
        careerGoal: data.careerGoal || "",
        experienceLevel:
          data.experienceLevel || "Beginner",
        interests: data.interests || []
      });

      setSkillsText(
        (data.skills || []).join(", ")
      );

      setInterestsText(
        (data.interests || []).join(", ")
      );

    } catch (err) {

      console.log("Profile error:", err);

    }
  };


  // -----------------------------
  // GET AI RECOMMENDATIONS
  // -----------------------------

  const fetchRecommendations = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API}/api/recommendations`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setRecommendations(
        response.data.recommendations
      );

    } catch (err) {

      console.log("Recommendation error:", err);

      setError(
        "Could not load AI recommendations"
      );

    }
  };


  // -----------------------------
  // LOAD DATA
  // -----------------------------

  useEffect(() => {

    if (loggedIn) {

      fetchProfile();
      fetchRecommendations();

    }

  }, [loggedIn]);


  // -----------------------------
  // UPDATE PROFILE
  // -----------------------------

  const handleProfileChange = (e) => {

    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });

  };


  // -----------------------------
  // SAVE PROFILE
  // -----------------------------

  const handleSaveProfile = async (e) => {

    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {

      const token = localStorage.getItem("token");

      const updatedProfile = {

        name: profile.name,

        skills: skillsText
          .split(",")
          .map(skill => skill.trim())
          .filter(skill => skill !== ""),

        careerGoal: profile.careerGoal,

        experienceLevel:
          profile.experienceLevel,

        interests: interestsText
          .split(",")
          .map(interest => interest.trim())
          .filter(interest => interest !== "")

      };


      const response = await axios.put(
        `${API}/api/user/profile`,
        updatedProfile,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      setUser(response.data.user);

      setProfile(updatedProfile);

      setSuccess(
        "Profile updated successfully!"
      );

      setShowProfile(false);

      // Get new AI recommendations
      await fetchRecommendations();

    } catch (err) {

      console.log(err);

      setError(
        err.response?.data?.message ||
        "Profile update failed"
      );

    } finally {

      setSaving(false);

    }
  };


  // -----------------------------
  // LOGOUT
  // -----------------------------

  const handleLogout = () => {

    localStorage.removeItem("token");

    setLoggedIn(false);
    setRecommendations([]);
    setUser(null);

  };


  // -----------------------------
  // LOGIN SCREEN
  // -----------------------------

  // -----------------------------
// LOGIN / REGISTER SCREEN
// -----------------------------

if (!loggedIn) {

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="logo">
          Skill<span>Sync</span>
        </div>


        {/* REGISTER SCREEN */}

        {isRegister ? (

          <>

            <h1>Create Account</h1>

            <p className="login-subtitle">
              Create your SkillSync account.
            </p>


            <form onSubmit={handleRegister}>

              <label>Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />


              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />


              <label>Password</label>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />


              <button
                className="login-button"
                type="submit"
                disabled={loading}
              >

                {loading
                  ? "Creating account..."
                  : "Register"}

              </button>

            </form>


            <p className="switch-auth">

              Already have an account?

              <button
                type="button"
                onClick={() => {

                  setIsRegister(false);
                  setError("");
                  setSuccess("");

                }}
              >
                Login
              </button>

            </p>

          </>

        ) : (

          /* LOGIN SCREEN */

          <>

            <h1>Welcome Back 👋</h1>

            <p className="login-subtitle">
              Login to discover courses made for you.
            </p>


            <form onSubmit={handleLogin}>

              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />


              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
              />


              <button
                className="login-button"
                type="submit"
                disabled={loading}
              >

                {loading
                  ? "Logging in..."
                  : "Login"}

              </button>

            </form>


            <p className="switch-auth">

              Don't have an account?
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setError("");
              setSuccess("");
            }}
          >
            Register
          </button>

        </p>

        <p className="admin-access">
          Are you an administrator? <a href="/admin">Admin login</a>
        </p>

      </>
    )}

        {/* ERROR */}

        {error && (

          <p className="error">
            {error}
          </p>

        )}


        {/* SUCCESS */}

        {success && (

          <p className="success">
            {success}
          </p>

        )}

      </div>

    </div>
  );
}

  // -----------------------------
  // DASHBOARD
  // -----------------------------

  return (
    <div className="dashboard">

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="logo">
          Skill<span>Sync</span>
        </div>

        <div className="nav-actions">

          <button
            className="profile-button"
            onClick={() =>
              setShowProfile(true)
            }
          >
            Profile
          </button>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* SUCCESS MESSAGE */}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}


      {/* HERO */}

      <section className="hero">

        <h1>
          Welcome back
          {user?.name
            ? `, ${user.name}`
            : ""} 👋
        </h1>

        <p>
          Learn smarter. Build your career.
        </p>

      </section>


      {/* PROFILE SUMMARY */}

      <section className="profile-section">

        <div className="profile-card">

          <h3>Your Skills</h3>

          <div className="badges">

            {user?.skills?.length > 0 ? (

              user.skills.map((skill) => (

                <span
                  className="badge"
                  key={skill}
                >
                  {skill}
                </span>

              ))

            ) : (

              <span>
                No skills added
              </span>

            )}

          </div>

        </div>


        <div className="profile-card">

          <h3>Career Goal</h3>

          <p className="career">
            {user?.careerGoal ||
              "Not specified"}
          </p>

        </div>


        <div className="profile-card">

          <h3>Experience</h3>

          <p className="career">
            {user?.experienceLevel ||
              "Beginner"}
          </p>

        </div>

      </section>

{/* COURSE DETAILS */}

{selectedCourse && (

  <section className="course-details">

    {/* BACK BUTTON */}

    <button
      className="back-button"
      onClick={() => setSelectedCourse(null)}
    >
      ← Back to Recommendations
    </button>


    <div className="course-details-card">


      {/* HEADER */}

      <div className="course-details-header">

        <span className="category">
          {selectedCourse.course.category}
        </span>

        <span className="score">
          AI Score:{" "}
          {(selectedCourse.score * 100).toFixed(1)}%
        </span>

      </div>


      {/* TITLE */}

      <h1>
        {selectedCourse.course.title}
      </h1>


      {/* DESCRIPTION */}

      <p className="course-details-description">
        {selectedCourse.course.description}
      </p>


      {/* COURSE INFORMATION */}

      <div className="course-details-info">

        <div>
          <strong>Level</strong>

          <span>
            📊 {selectedCourse.course.level}
          </span>
        </div>


        <div>
          <strong>Duration</strong>

          <span>
            ⏱️ {selectedCourse.course.duration}
          </span>
        </div>


        <div>
          <strong>Category</strong>

          <span>
            📚 {selectedCourse.course.category}
          </span>
        </div>

      </div>


      {/* SKILLS */}

      <div className="course-skills">

        <h2>
          Skills You Will Learn
        </h2>


        <div className="badges">

          {selectedCourse.course.skills.map(
            (skill) => (

              <span
                className="badge"
                key={skill}
              >
                {skill}
              </span>

            )
          )}

        </div>

      </div>


      {/* AI REASON */}

      <div className="ai-reason">

        <h2>
          🤖 Why AI Recommended This
        </h2>


        <p>
          {selectedCourse.reason}
        </p>

      </div>


      {/* WHAT YOU WILL LEARN */}

      <div className="learning-section">

        <h2>
          What You'll Learn
        </h2>


        <ul>

          {selectedCourse.course.skills.map(
            (skill) => (

              <li key={skill}>
                Learn {skill} concepts and
                practical applications
              </li>

            )
          )}

        </ul>

      </div>


      {/* ================================ */}
      {/* LEARNING RESOURCES */}
      {/* ================================ */}

      <div className="learning-resources">

        <h2>
          Learn This Course
        </h2>


        <p className="resources-subtitle">
          Choose a learning resource that
          works best for you.
        </p>


        {/* YOUTUBE */}

        {selectedCourse.course.resources?.youtube && (

          <a
            className="resource-card"
            href={
              selectedCourse.course.resources.youtube
            }
            target="_blank"
            rel="noopener noreferrer"
          >

            <div className="resource-icon">
              🎥
            </div>


            <div className="resource-content">

              <h3>
                YouTube Tutorials
              </h3>


              <p>
                Learn through video tutorials
                and practical explanations.
              </p>

            </div>


            <span>
              Visit →
            </span>

          </a>

        )}


        {/* OFFICIAL WEBSITE */}

        {selectedCourse.course.resources?.website && (

          <a
            className="resource-card"
            href={
              selectedCourse.course.resources.website
            }
            target="_blank"
            rel="noopener noreferrer"
          >

            <div className="resource-icon">
              🌐
            </div>


            <div className="resource-content">

              <h3>
                Official Website
              </h3>


              <p>
                Learn from official documentation
                and tutorials.
              </p>

            </div>


            <span>
              Visit →
            </span>

          </a>

        )}


        {/* PRACTICE */}

        {selectedCourse.course.resources?.practice && (

          <a
            className="resource-card"
            href={
              selectedCourse.course.resources.practice
            }
            target="_blank"
            rel="noopener noreferrer"
          >

            <div className="resource-icon">
              💻
            </div>


            <div className="resource-content">

              <h3>
                Practice
              </h3>


              <p>
                Practice what you learned with
                coding exercises and projects.
              </p>

            </div>


            <span>
              Practice →
            </span>

          </a>

        )}


        {/* NO RESOURCES MESSAGE */}

        {!selectedCourse.course.resources && (

          <p className="no-resources">
            Learning resources are currently
            unavailable for this course.
          </p>

        )}

      </div>

    </div>

  </section>

)}
      {/* RECOMMENDATIONS */}

     
{!selectedCourse && (

<section className="recommendations">
        <div className="section-heading">

          <h2>
            AI Recommended Courses 🤖
          </h2>

          <p>
            Personalized recommendations based
            on your profile.
          </p>

        </div>


        {error && (
          <p className="error">
            {error}
          </p>
        )}


        {recommendations.length === 0 ? (

          <div className="loading">
            Loading recommendations...
          </div>

        ) : (

          <div className="course-grid">

            {recommendations.map((item) => (

              <div
                className="course-card"
                key={item.course.id}
              >

                <div className="course-top">

                  <span className="category">
                    {item.course.category}
                  </span>

                  <span className="score">
                    {(item.score * 100)
                      .toFixed(1)}%
                  </span>

                </div>


                <h3>
                  {item.course.title}
                </h3>


                <p className="description">
                  {item.course.description}
                </p>


                <div className="course-info">

                  <span>
                    📊 {item.course.level}
                  </span>

                  <span>
                    ⏱️ {item.course.duration}
                  </span>

                </div>


                <div className="reason">

                  <strong>
                    Why recommended?
                  </strong>

                  <p>
                    {item.reason}
                  </p>

                </div>


                <button
  className="course-button"
  onClick={() =>
    setSelectedCourse(item)
  }
>
  View Course →
</button>

              </div>

            ))}

          </div>

        )}

      </section>
)}

      {/* PROFILE MODAL */}

      {showProfile && (

        <div className="modal-overlay">

          <div className="profile-modal">

            <div className="modal-header">

              <h2>
                Edit Profile
              </h2>

              <button
                className="close-button"
                onClick={() =>
                  setShowProfile(false)
                }
              >
                ×
              </button>

            </div>


            <form
              onSubmit={handleSaveProfile}
            >

              <label>Name</label>

              <input
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                required
              />


              <label>
                Skills
              </label>

              <input
                value={skillsText}
                onChange={(e) =>
                  setSkillsText(
                    e.target.value
                  )
                }
                placeholder="Java, JavaScript, MongoDB"
              />

              <small>
                Separate skills using commas.
              </small>


              <label>
                Career Goal
              </label>

              <input
                name="careerGoal"
                value={profile.careerGoal}
                onChange={handleProfileChange}
                placeholder="Full Stack Developer"
              />


              <label>
                Experience Level
              </label>

              <select
                name="experienceLevel"
                value={profile.experienceLevel}
                onChange={handleProfileChange}
              >
                <option value="Beginner">
                  Beginner
                </option>

                <option value="Intermediate">
                  Intermediate
                </option>

                <option value="Advanced">
                  Advanced
                </option>
              </select>


              <label>
                Interests
              </label>

              <input
                value={interestsText}
                onChange={(e) =>
                  setInterestsText(
                    e.target.value
                  )
                }
                placeholder="Web Development, AI"
              />

              <small>
                Separate interests using commas.
              </small>


              <button
                className="save-button"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Profile"}
              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;