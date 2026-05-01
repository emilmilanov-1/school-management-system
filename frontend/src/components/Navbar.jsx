import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const canViewPayments = user?.role === "ADMIN" || user?.role === "TEACHER";

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">School System</Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/pricing">Pricing</Link>
        <Link to="/contact">Contact</Link>

        {token && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/students">Students</Link>
            {token && <Link to="/payments">Payments</Link>}
            <Link to="/schedules">Schedules</Link>
            <Link to="/messages">Messages</Link>
          </>
        )}

        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button onClick={logout} className="logout-btn">Logout</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;