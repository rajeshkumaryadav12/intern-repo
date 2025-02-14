import { useState } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [query, setQuery] = useState("");
  const [userData, setUserData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const searchUser = async () => {
    if (!query.trim()) {
      setErrorMessage("⚠️ Please enter a username or email.");
      setUserData(null);
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
  
      // ✅ Fix API URL
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/search?query=${query}`, {
        method: "GET",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
  
      console.log("Response Status:", response.status); // ✅ Debugging
  
      if (response.status === 404) {
        setErrorMessage("❌ User not found!");
        setUserData(null);
        return;
      }
  
      if (!response.ok) {
        throw new Error("❌ An error occurred while fetching data.");
      }
  
      const data = await response.json();
      console.log("User Data Received:", data); // ✅ Debugging
  
      if (!data || Object.keys(data).length === 0) {
        setErrorMessage("❌ User not found!");
        setUserData(null);
      } else {
        setUserData(data); // ✅ Directly store the object
        setErrorMessage("");
      }
    } catch (error) {
      console.error("Error fetching user:", error); // ✅ Debugging
      setErrorMessage(error.message);
      setUserData(null);
    }
  };
  

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>Dashboard</h2>
        <p className="dashboard-subtext">Search for a user by username or email</p>
        
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter username or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={searchUser}>🔍 Search</button>
        </div>

        {/* Display Error Message */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Display User Info */}
        {userData && (
          <div className="user-card">
            <h3>User Details</h3>
            <p><strong>Username:</strong> {userData.username}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Full Name:</strong> {userData.fullName}</p>
            <p><strong>Gender:</strong> {userData.gender}</p>
            <p><strong>Date of Birth:</strong> {new Date(userData.dateOfBirth).toLocaleDateString()}</p>
            <p><strong>Country:</strong> {userData.country}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
