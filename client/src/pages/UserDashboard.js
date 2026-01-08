import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const UserDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name"); 

  const fetchStores = useCallback(async () => {
    if (!user) return;

    try {
      const authHeader = { headers: { Authorization: `Bearer ${user.token}` } };

      const res = await axios.get(
        `http://localhost:5000/api/stores?search=${search}&sort=${sort}`,
        authHeader
      );
      setStores(res.data);
    } catch (err) {
      console.error("Error fetching stores:", err);
    }
  }, [user, search, sort]); 

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleRating = async (storeId, newRating) => {
    if (!user) return;
    try {
      const authHeader = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(
        "http://localhost:5000/api/rating",
        { storeId, rating: newRating },
        authHeader
      );
      alert(`You rated this store ${newRating} stars!`);
      fetchStores(); 
    } catch (err) {
      alert(err.response?.data?.error || "Error submitting rating");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      {/* ----------------------Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "1px solid #ccc",
          paddingBottom: "15px",
          marginBottom: "20px",
        }}
      >
        <h2>User Dashboard</h2>
        <div>
          <span style={{ marginRight: "15px" }}>Hello, {user?.name}</span>
          <button
            onClick={logout}
            style={{
              background: "red",
              color: "white",
              border: "none",
              padding: "8px 15px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* ========================Filters */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          placeholder="Search Stores..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "10px", width: "300px", border: "1px solid #ddd" }}
        />
        <select
          onChange={(e) => setSort(e.target.value)}
          style={{ padding: "10px" }}
        >
          <option value="name">Sort by Name</option>
          <option value="rating">Sort by Rating</option>
        </select>
      </div>

      {/* =-=-=-=-=-=-=-=-=-=-=-=-=-=-Store Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {stores.map((store) => (
          <div key={store.id} style={cardStyle}>
            <h3 style={{ margin: "0 0 10px 0" }}>{store.name}</h3>
            <p style={{ color: "#666" }}>{store.address}</p>

            <div style={{ margin: "15px 0", fontSize: "18px" }}>
              Current Rating:{" "}
              <strong>
                {store.rating ? Number(store.rating).toFixed(1) : "No Ratings"}
              </strong>{" "}
              / 5
            </div>

            {/* =======================Rating Buttons */}
            <div style={{ borderTop: "1px solid #eee", paddingTop: "10px" }}>
              <p style={{ fontSize: "14px", marginBottom: "5px" }}>
                Submit Your Rating:
              </p>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(store.id, star)}
                  style={{
                    marginRight: "5px",
                    padding: "5px 10px",
                    cursor: "pointer",
                    background: "#ffc107",
                    border: "none",
                    borderRadius: "4px",
                  }}
                >
                  {star}★
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {stores.length === 0 && <p>No stores found.</p>}
    </div>
  );
};

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "20px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  background: "white",
};

export default UserDashboard;
