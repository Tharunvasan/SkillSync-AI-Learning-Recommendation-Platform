import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminApp.css";

const API = "http://localhost:5000";
const emptyCourse = { title: "", description: "", skills: "", level: "Beginner", category: "", duration: "", url: "", youtube: "", website: "", practice: "" };

const toForm = (course = emptyCourse) => ({
  title: course.title || "", description: course.description || "", skills: Array.isArray(course.skills) ? course.skills.join(", ") : course.skills || "",
  level: course.level || "Beginner", category: course.category || "", duration: course.duration || "", url: course.url || "",
  youtube: course.resources?.youtube || "", website: course.resources?.website || "", practice: course.resources?.practice || ""
});
const toPayload = (form) => ({ ...form, skills: form.skills.split(",").map((skill) => skill.trim()).filter(Boolean), resources: { youtube: form.youtube, website: form.website, practice: form.practice } });

function AdminApp() {
  const [token, setToken] = useState(localStorage.getItem("adminToken"));
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [tab, setTab] = useState("overview");
  const [data, setData] = useState({ summary: {}, recentUsers: [], recentCourses: [] });
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyCourse);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => { if (token) loadAll(); }, [token]);
  const request = async (path) => axios.get(`${API}/api/admin${path}`, { headers });
  const loadAll = async () => {
    try {
      const [dashboard, userList, courseList] = await Promise.all([request("/dashboard"), request("/users"), request("/courses")]);
      setData(dashboard.data); setUsers(userList.data.users); setCourses(courseList.data.courses); setError("");
    } catch (err) { setError(err.response?.data?.message || "Could not load the admin dashboard."); if (err.response?.status === 401 || err.response?.status === 403) logout(); }
  };
  const login = async (event) => {
    event.preventDefault(); setError("");
    try { const response = await axios.post(`${API}/api/admin/login`, credentials); localStorage.setItem("adminToken", response.data.token); setToken(response.data.token); }
    catch (err) { setError(err.response?.data?.message || "Admin login failed."); }
  };
  const logout = () => { localStorage.removeItem("adminToken"); setToken(null); };
  const saveCourse = async (event) => {
    event.preventDefault(); setError("");
    try {
      const payload = toPayload(form);
      const response = editingId ? await axios.put(`${API}/api/admin/courses/${editingId}`, payload, { headers }) : await axios.post(`${API}/api/admin/courses`, payload, { headers });
      setNotice(response.data.message); setForm(emptyCourse); setEditingId(null); await loadAll(); setTab("courses");
    } catch (err) { setError(err.response?.data?.message || "Could not save course."); }
  };
  const remove = async (kind, id, label) => {
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return;
    try { const response = await axios.delete(`${API}/api/admin/${kind}/${id}`, { headers }); setNotice(response.data.message); await loadAll(); }
    catch (err) { setError(err.response?.data?.message || "Could not delete item."); }
  };
  const startEdit = (course) => { setForm(toForm(course)); setEditingId(course._id); setTab("course-form"); };
  const openNew = () => { setForm(emptyCourse); setEditingId(null); setTab("course-form"); };

  if (!token) return <main className="admin-login"><form onSubmit={login} className="admin-login-card"><div className="admin-mark">Skill<span>Sync</span></div><p>Administrator portal</p><h1>Sign in</h1>{error && <div className="admin-alert error">{error}</div>}<label>Email<input type="email" value={credentials.email} onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} required /></label><label>Password<input type="password" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} required /></label><button className="admin-primary">Sign in</button><a href="/">← Return to SkillSync</a></form></main>;

  return <div className="admin-app"><aside className="admin-sidebar"><div className="admin-mark">Skill<span>Sync</span><small>ADMIN</small></div><nav>{[["overview", "Overview"], ["courses", "Courses"], ["users", "Users"]].map(([key, label]) => <button key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}>{label}</button>)}<button onClick={openNew}>+ Add course</button></nav><button className="admin-logout" onClick={logout}>Sign out</button></aside><main className="admin-main"><header><div><p className="eyebrow">ADMINISTRATION</p><h1>{tab === "overview" ? "Dashboard" : tab === "users" ? "Users" : tab === "courses" ? "Course management" : editingId ? "Edit course" : "Create course"}</h1></div>{tab === "courses" && <button className="admin-primary" onClick={openNew}>+ Add course</button>}</header>{error && <div className="admin-alert error">{error}</div>}{notice && <div className="admin-alert success">{notice}</div>}
  {tab === "overview" && <><section className="stat-grid">{[["Learners", data.summary.users || 0], ["Courses", data.summary.courses || 0], ["Recommendations", data.summary.recommendations || 0]].map(([label, value]) => <article className="stat-card" key={label}><span>{label}</span><strong>{value}</strong></article>)}</section><section className="admin-columns"><article className="panel"><h2>Recent learners</h2>{data.recentUsers.map((user) => <div className="row" key={user._id}><div><strong>{user.name}</strong><small>{user.email}</small></div><span>{user.experienceLevel}</span></div>) || null}</article><article className="panel"><h2>Recent courses</h2>{data.recentCourses.map((course) => <div className="row" key={course._id}><div><strong>{course.title}</strong><small>{course.category}</small></div><span>{course.level}</span></div>) || null}</article></section></>}
  {tab === "users" && <section className="panel"><h2>All learners <span>{users.length}</span></h2><div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Goal</th><th>Skills</th><th></th></tr></thead><tbody>{users.map((user) => <tr key={user._id}><td>{user.name}</td><td>{user.email}</td><td>{user.careerGoal || "—"}</td><td>{user.skills?.join(", ") || "—"}</td><td><button className="danger-link" onClick={() => remove("users", user._id, user.name)}>Delete</button></td></tr>)}</tbody></table></div></section>}
  {tab === "courses" && <section className="panel"><h2>All courses <span>{courses.length}</span></h2><div className="course-list">{courses.map((course) => <article className="admin-course" key={course._id}><div><p className="tag">{course.category}</p><h3>{course.title}</h3><p>{course.description}</p><small>{course.level} · {course.duration || "No duration"}</small></div><div className="course-actions"><button onClick={() => startEdit(course)}>Edit</button><button className="danger-link" onClick={() => remove("courses", course._id, course.title)}>Delete</button></div></article>)}</div></section>}
  {tab === "course-form" && <section className="panel form-panel"><h2>{editingId ? "Update course details" : "New course details"}</h2><form onSubmit={saveCourse} className="course-form">{[["title", "Course title"], ["category", "Category"], ["duration", "Duration (e.g. 20 hours)"], ["url", "Course URL"], ["skills", "Skills (comma-separated)"], ["youtube", "YouTube URL"], ["website", "Official website URL"], ["practice", "Practice URL"]].map(([key, label]) => <label key={key}>{label}<input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} required={key === "title" || key === "category"} /></label>)}<label>Level<select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label><label className="wide">Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows="4" /></label><div className="wide form-actions"><button type="button" onClick={() => setTab("courses")}>Cancel</button><button className="admin-primary">{editingId ? "Save changes" : "Create course"}</button></div></form></section>}
  </main></div>;
}

export default AdminApp;
