import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Import CSS for styling

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard"); // If already logged in, go to dashboard
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("storage"));
        navigate("/dashboard");
      } else {
        alert(data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <table>
          <tbody>
            <tr>
              <td>
                <label>Email:</label>
              </td>
              <td>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Password:</label>
              </td>
              <td>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td colSpan="2" className="centered">
                <button type="submit">Login</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
};

export default Login;
