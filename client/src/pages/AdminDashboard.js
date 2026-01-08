import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

// --- Main Dashboard================
const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [view, setView] = useState("stats"); 

  const renderContent = () => {
    switch (view) {
      case "stats":
        return <StatsView user={user} />;
      case "users":
        return <ListView user={user} type="users" />;
      case "stores":
        return <ListView user={user} type="stores" />;
      case "addUser":
        return <CreateForm user={user} type="user" />;
      case "addStore":
        return <CreateForm user={user} type="store" />;
      default:
        return <StatsView user={user} />;
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      {/* ---------------Header---------------- */}
      <div style={styles.header}>
        <h2>System Admin Dashboard</h2>
        <div>
          <span style={{ marginRight: "15px" }}>{user?.name}</span>
          <button onClick={logout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      {/* ===============Navigation ==========*/}

      <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
        {["stats", "users", "stores", "addUser", "addStore"].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              ...styles.navBtn,
              background: view === v ? "#007bff" : "#eee",
              color: view === v ? "#fff" : "#000",
            }}
          >
            {v === "stats"
              ? "Dashboard"
              : v
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
          </button>
        ))}
      </div>

      {/*-=-=-=-=-=-=-=-=Content Area-=-=-=-=-=-=-==-==-= */}
      {renderContent()}
    </div>
  );
};

// --- ----------------STATS view -----------------------------
const StatsView = ({ user }) => {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/stats", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, [user]);

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <Card title="Total Users" count={stats.users} color="#4CAF50" />
      <Card title="Total Stores" count={stats.stores} color="#2196F3" />
      <Card title="Total Ratings" count={stats.ratings} color="#FF9800" />
    </div>
  );
};

// ---=-=-=-=-=-=-=-=-=-=-=--LIST VIEW (Users or Store) -=-=-=-=-=-=-=-=--=

const ListView = ({ user, type }) => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const fetchData = () => {
    const endpoint = type === "users" ? "/api/admin/users" : "/api/stores";
    axios
      .get(`http://localhost:5000${endpoint}?search=${search}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setData(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchData();
  }, [type]);

  return (
    <div>
      <div style={{ marginBottom: "15px" }}>
        <input
          placeholder={`Search ${type}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />
        <button onClick={fetchData} style={styles.actionBtn}>
          Search
        </button>
      </div>
      <table style={styles.table}>
        <thead>
          <tr style={{ background: "#f8f9fa", textAlign: "left" }}>
            <th style={styles.td}>Name</th>
            <th style={styles.td}>Email</th>
            <th style={styles.td}>Address</th>
            {type === "users" ? (
              <th style={styles.td}>Role</th>
            ) : (
              <th style={styles.td}>Rating</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
              <td style={styles.td}>{item.name}</td>
              <td style={styles.td}>{item.email}</td>
              <td style={styles.td}>{item.address}</td>
              <td style={styles.td}>
                {type === "users" ? item.role : item.rating || "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && <p>No data found.</p>}
    </div>
  );
};

// ==================Create Form====================
const CreateForm = ({ user, type }) => {
  const [formData, setFormData] = useState({});
  const isUser = type === "user";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isUser ? "/api/admin/add-user" : "/api/admin/add-store";
      await axios.post(`http://localhost:5000${endpoint}`, formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert(`${isUser ? "User" : "Store"} added!`);
      e.target.reset();
      setFormData({});
    } catch (err) {
      alert(err.response?.data?.error || "Error");
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div style={styles.formContainer}>
      <h3>Create New {isUser ? "User" : "Store"}</h3>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <input
          name="name"
          placeholder={`Name (Min 3 chars)`}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          style={styles.input}
        />
        {isUser && (
          <input
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            style={styles.input}
          />
        )}
        <input
          name="address"
          placeholder="Address"
          onChange={handleChange}
          required
          style={styles.input}
        />

        {isUser && (
          <select name="role" onChange={handleChange} style={styles.input}>
            <option value="Normal User">Normal User</option>
            <option value="System Administrator">System Administrator</option>
            <option value="Store Owner">Store Owner</option>
          </select>
        )}
        <button type="submit" style={styles.submitBtn}>
          Create
        </button>
      </form>
    </div>
  );
};

// ---=------------------- Styles ---
const Card = ({ title, count, color }) => (
  <div
    style={{
      borderLeft: `5px solid ${color}`,
      padding: "20px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      background: "white",
      width: "200px",
    }}
  >
    <h3 style={{ margin: 0, color: "#555" }}>{title}</h3>
    <p
      style={{
        fontSize: "30px",
        fontWeight: "bold",
        margin: "10px 0 0",
        color,
      }}
    >
      {count}
    </p>
  </div>
);

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "2px solid #eee",
    paddingBottom: "15px",
    marginBottom: "20px",
  },
  logoutBtn: {
    background: "#ff4d4d",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  navBtn: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  input: {
    padding: "12px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    width: "100%",
    boxSizing: "border-box",
  },
  actionBtn: { marginLeft: "10px", padding: "10px", cursor: "pointer" },
  submitBtn: {
    padding: "12px",
    background: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    border: "1px solid #ddd",
  },
  td: { padding: "12px", borderBottom: "1px solid #eee" },
  formContainer: {
    maxWidth: "500px",
    background: "#f9f9f9",
    padding: "30px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
};

export default AdminDashboard;