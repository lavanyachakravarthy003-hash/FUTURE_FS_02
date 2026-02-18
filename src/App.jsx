import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  // ✅ LOGIN STATE
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // ✅ CRM STATES
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "New",
  });
  const [editId, setEditId] = useState(null);

  // ✅ CHECK LOGIN ON REFRESH
  useEffect(() => {
    const logged = localStorage.getItem("isLoggedIn");
    if (logged === "true") {
      setIsLoggedIn(true);
      fetchLeads();
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.email && loginData.password) {
      localStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);
      fetchLeads();
    } else {
      alert("Enter email & password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  const fetchLeads = async () => {
    const res = await axios.get("http://localhost:5000/api/leads");
    setLeads(res.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await axios.put(
        `http://localhost:5000/api/leads/${editId}`,
        formData
      );
      setEditId(null);
    } else {
      await axios.post("http://localhost:5000/api/leads", formData);
    }

    setFormData({ name: "", email: "", phone: "", status: "New" });
    fetchLeads();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lead?")) return;
    await axios.delete(`http://localhost:5000/api/leads/${id}`);
    fetchLeads();
  };

  const handleEdit = (lead) => {
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone || "",
      status: lead.status,
    });
    setEditId(lead._id);
  };

  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(search.toLowerCase())
  );

  const countStatus = (status) =>
    leads.filter((lead) => lead.status === status).length;

  // ✅ SHOW LOGIN PAGE FIRST
  if (!isLoggedIn) {
   return (
  <div style={styles.loginContainer}>
    <div style={styles.loginCard}>
      <h1 style={styles.welcomeTitle}>Welcome to CRM 🎉</h1>

      <form onSubmit={handleLogin}>
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={loginData.email}
          onChange={(e) =>
            setLoginData({ ...loginData, email: e.target.value })
          }
          required
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={loginData.password}
          onChange={(e) =>
            setLoginData({ ...loginData, password: e.target.value })
          }
          required
        />

        <button style={styles.primaryBtn} type="submit">
          Login
        </button>
      </form>
    </div>
  </div>
);

  }

  // ✅ CRM DASHBOARD
  return (
    <div style={styles.app}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h2 style={{ color: "white" }}>CRM</h2>
        <p style={styles.menuItem}>Dashboard</p>
        <p style={styles.menuItem}>Leads</p>
        <p style={styles.menuItem}>Settings</p>
      </div>

      {/* MAIN */}
      <div style={styles.main}>
        <div style={styles.topbar}>
          <h2>Mini CRM Dashboard</h2>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* ANALYTICS */}
        <div style={styles.analytics}>
          <div style={styles.analyticsCard}>
            <h3>Total Leads</h3>
            <p>{leads.length}</p>
          </div>
          <div style={styles.analyticsCard}>
            <h3>New</h3>
            <p>{countStatus("New")}</p>
          </div>
          <div style={styles.analyticsCard}>
            <h3>Contacted</h3>
            <p>{countStatus("Contacted")}</p>
          </div>
          <div style={styles.analyticsCard}>
            <h3>Qualified</h3>
            <p>{countStatus("Qualified")}</p>
          </div>
        </div>

        {/* FORM */}
        <div style={styles.card}>
          <h3>{editId ? "Edit Lead" : "Add Lead"}</h3>
          <form onSubmit={handleSubmit}>
            <input
              style={styles.input}
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              style={styles.input}
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <select
              style={styles.input}
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
            </select>
            <button style={styles.primaryBtn} type="submit">
              {editId ? "Update Lead" : "Add Lead"}
            </button>
          </form>
        </div>

        {/* SEARCH */}
        <input
          style={styles.search}
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* LEADS */}
        {filteredLeads.map((lead) => (
          <div key={lead._id} style={styles.leadCard}>
            <div>
              <h4>{lead.name}</h4>
              <p>{lead.email}</p>
              <p>{lead.phone}</p>
              <span style={getBadgeStyle(lead.status)}>
                {lead.status}
              </span>
            </div>
            <div>
              <button
                style={styles.editBtn}
                onClick={() => handleEdit(lead)}
              >
                Edit
              </button>
              <button
                style={styles.deleteBtn}
                onClick={() => handleDelete(lead._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const getBadgeStyle = (status) => {
  const base = {
    padding: "5px 12px",
    borderRadius: "20px",
    color: "Black",
    fontSize: "12px",
  };
  if (status === "New") return { ...base, background: "#13beb9" };
  if (status === "Contacted")
    return { ...base, background: "#ffc107", color: "black" };
  if (status === "Qualified") return { ...base, background: "#28a745" };
  return base;
};

const styles = {
  app: { display: "flex", fontFamily: "Calibri", width: "100vw", minHeight: "100vh" },
  welcomeTitle: {
  textAlign: "center",
  marginBottom: "20px",
  color: "#1e293b",
  fontSize: "24px",
},


  loginContainer: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#4a88c5",
  },

  loginCard: {
    background: "white",
    padding: "40px",
    borderRadius: "10px",
    width: "300px",
  },

  sidebar: {
    width: "220px",
    background: "#1e293b",
    minHeight: "100vh",
    padding: "20px",
  },

  menuItem: {
    color: "white",
    marginTop: "20px",
    cursor: "pointer",
  },

  main: {
    flex: 1,
    padding: "30px",
    background: "#4a88c5",
    minHeight: "100vh",
  },

  topbar: {
    marginBottom: "30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoutBtn: {
    background: "#ef4444",
    color: "white",
    padding: "8px 15px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  analytics: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "15px",
    marginBottom: "30px",
  },

  analyticsCard: {
    background: "#131779",
    padding: "18px",
    borderRadius: "10px",
    textAlign: "center",
  },

  card: {
    background: "#1e293b",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
  },

  input: {
    display: "block",
    width: "90%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },

  primaryBtn: {
    background: "#2563eb",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  search: {
    width: "90%",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },

  leadCard: {
    background: "#0f336c",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  editBtn: {
    background: "#0ea5e9",
    color: "white",
    padding: "6px 12px",
    border: "none",
    borderRadius: "5px",
    marginRight: "10px",
    cursor: "pointer",
  },

  deleteBtn: {
    background: "#ef4444",
    color: "white",
    padding: "6px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default App;
