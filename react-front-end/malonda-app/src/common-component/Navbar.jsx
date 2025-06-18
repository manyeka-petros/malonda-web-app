// src/components/Navbar.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export function Navbar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    const access = localStorage.getItem('access');
    const storedRole = localStorage.getItem('role');
    if (access) {
      setIsAuthenticated(true);
      setRole(storedRole);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setRole('');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">MyEcommerce</Link>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>

        {isAuthenticated && <li><Link to="/profile">Profile</Link></li>}

        {role === 'manager' && (
          <li><Link to="/manager-dashboard">Manager Dashboard</Link></li>
        )}

        {role === 'customer' && (
          <li><Link to="/customer-dashboard">Customer Dashboard</Link></li>
        )}

        {!isAuthenticated ? (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        ) : (
          <li><button onClick={handleLogout} className="logout-button">Logout</button></li>
        )}
      </ul>
    </nav>
  );
}
