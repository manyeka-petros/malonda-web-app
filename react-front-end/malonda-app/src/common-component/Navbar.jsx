import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../Auth/api';
import Swal from 'sweetalert2';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('');

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('access'));
    setRole(localStorage.getItem('role'));
  }, []);

  const handleLogout = async () => {
    const refresh = localStorage.getItem('refresh');

    try {
      if (refresh) {
        await api.post('/logout/', { refresh });
      }
    } catch (error) {
      console.error('Logout error:', error);
    }

    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setRole('');

    Swal.fire({
      icon: 'success',
      title: 'Logged Out',
      text: 'You have been logged out successfully.',
      timer: 1500,
      showConfirmButton: false,
    });

    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark custom-navbar px-4">
      <Link className="navbar-brand brand-animate" to="/">🌐 Malonda</Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse nav-slide" id="navbarNav">
        <ul className="navbar-nav ms-auto align-items-center">
          <li className="nav-item">
            <Link className="nav-link link-hover" to="/">Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link link-hover" to="/about">About Us</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link link-hover" to="/contact">Contact</Link>
          </li>

          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link className="nav-link link-hover" to="/profile">Profile</Link>
              </li>
              {role === 'manager' && (
                <li className="nav-item">
                  <Link className="nav-link link-hover" to="/manager-dashboard">Manager Dashboard</Link>
                </li>
              )}
              {role === 'customer' && (
                <li className="nav-item">
                  <Link className="nav-link link-hover" to="/customer-dashboard">Customer Dashboard</Link>
                </li>
              )}
              <li className="nav-item">
                <button
                  className="btn btn-outline-warning ms-3 logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link link-hover" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link link-hover" to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
