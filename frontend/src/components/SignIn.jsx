import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignIn.css"; // Import CSS for styling

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [country, setCountry] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, fullName, gender, dateOfBirth, country }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // ✅ Store token in localStorage
        localStorage.setItem("token", data.token);
  
        // ✅ Redirect to Dashboard
        alert("Registration Successful! Redirecting to Dashboard...");
        navigate("/dashboard");
      } else {
        alert(data.message || "Signup failed!");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Something went wrong!");
    }
  };
  

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="signup-title">SignIn</h2>
        <form onSubmit={handleSignup} className="signup-form">
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Full Name:</label>
            <input
              type="text"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group gender">
            <label>Gender:</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group dob">
            <label>Date of Birth:</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Country:</label>
            <input
              type="text"
              placeholder="Enter country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="signup-button">Signup</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
