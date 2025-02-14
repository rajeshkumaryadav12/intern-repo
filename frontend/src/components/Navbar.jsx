import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", checkLoginStatus); // Listen for token changes

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("storage")); // Notify other components
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h2>RouteTest</h2>
      </div>
      <div className="nav-right">
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link to="/signup">SignIn</Link>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
