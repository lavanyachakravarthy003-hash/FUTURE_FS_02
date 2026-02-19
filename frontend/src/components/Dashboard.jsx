const [activePage, setActivePage] = useState("dashboard");
import { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "New",
  });
  const [editId, setEditId] = useState(null);

  const fetchLeads = async () => {
    const res = await axios.get("http://localhost:5000/api/leads");
    setLeads(res.data);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

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
      phone: lead.phone,
      status: lead.status,
    });
    setEditId(lead._id);
  };

  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(search.toLowerCase())
  );

  const countStatus = (status) =>
    leads.filter((lead) => lead.status === status).length;

  const getChartData = () => [
    { name: "New", value: countStatus("New"), color: "#331258" },
    { name: "Contacted", value: countStatus("Contacted"), color: "#ffc107" },
    { name: "Qualified", value: countStatus("Qualified"), color: "#28a745" },
  ];

  return (
    <div style={styles.app}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h2 style={{ color: "white" }}>CRM</h2>
        <p
  style={styles.menuItem}
  onClick={() => setActivePage("dashboard")}
>
  Dashboard
</p>

<p
  style={styles.menuItem}
  onClick={() => setActivePage("leads")}
>
  Leads
</p>

<p
  style={styles.menuItem}
  onClick={() => setActivePage("settings")}
>
  Settings
</p>

      </div>

      {/* MAIN */}
      <div style={styles.main}>
        <h2>Mini CRM Dashboard</h2>

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

        {/* PIE CHART */}
        <div style={styles.chartCard}>
          <h3>Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getChartData()}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {getChartData().map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* FORM */}
        <div style={styles.card}>
          <h3>{editId ? "Edit Lead" : "Add Lead"}</h3>
          <form onSubmit={handleSubmit}>
            <input
              style={styles.input}
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              style={styles.input}
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              style={styles.input}
              name="phone"
              placeholder="Phone"
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

            <button style={styles.primaryBtn}>
              {editId ? "Update Lead" : "Add Lead"}
            </button>
          </form>
        </div>

        {/* SEARCH */}
        <input
          style={styles.search}
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

/* STATUS BADGE */
const getBadgeStyle = (status) => {
  const base = {
    padding: "5px 12px",
    borderRadius: "20px",
    color: "white",
    fontSize: "12px",
  };

  if (status === "New") return { ...base, background: "#331258" };
  if (status === "Contacted")
    return { ...base, background: "#ffc107", color: "black" };
  if (status === "Qualified")
    return { ...base, background: "#28a745" };

  return base;
};

/* STYLES */
const styles = {
  app: { display: "flex", fontFamily: "Calibri" },
  sidebar: {
    width: "200px",
    background: "#1e293b",
    minHeight: "100vh",
    padding: "20px",
  },
  main: {
    flex: 1,
    padding: "30px",
    background: "#4b89c7",
    minHeight: "100vh",
  },
  analytics: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "15px",
    marginBottom: "30px",
  },
  analyticsCard: {
    background: "#101494",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
  },
  chartCard: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "30px",
  },
  card: {
    background: "#291a9ba1",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  input: {
    display: "block",
    width: "90%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
  },
  primaryBtn: {
    background: "#032057",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
  },
  search: {
    width: "95%",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "5px",
  },
  leadCard: {
    background: "#054a77",
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
  },
  deleteBtn: {
    background: "#ef4444",
    color: "white",
    padding: "6px 12px",
    border: "none",
    borderRadius: "5px",
  },
};

export default Dashboard;
