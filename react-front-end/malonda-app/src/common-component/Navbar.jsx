import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../Auth/api';
import Swal from 'sweetalert2';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (!isMobile && menuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [menuOpen, isMobile]);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('access'));
    setRole(localStorage.getItem('role'));
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    if (isMobile) {
      setMenuOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link className="navbar-brand" to="/" onClick={closeMenu}>
          <span className="logo-icon">🛒</span>
          <span className="brand-name">Malonda</span>
        </Link>

        <div className={`menu-toggle ${menuOpen ? 'open' : ''}`} onClick={toggleMenu} aria-label="Toggle menu">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

        <div className={`navbar-overlay ${menuOpen ? 'active' : ''}`} onClick={closeMenu}></div>

        <ul className={`navbar-menu ${menuOpen ? 'show' : ''}`}>
          <li>
            <Link to="/" onClick={closeMenu} className="nav-link">
              <i className="fas fa-home nav-icon"></i>
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={closeMenu} className="nav-link">
              <i className="fas fa-info-circle nav-icon"></i>
              <span>About</span>
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={closeMenu} className="nav-link">
              <i className="fas fa-envelope nav-icon"></i>
              <span>Contact</span>
            </Link>
          </li>

          {isAuthenticated ? (
            <>
              
              {role === 'manager' && (
                <li>
                  <Link 
                    to="/manager-dashboard" 
                    onClick={closeMenu} 
                    className="nav-link manager-badge"
                  >
                    <i className="fas fa-tachometer-alt nav-icon"></i>
                    <span>Manager Dashboard</span>
                  </Link>
                </li>
              )}
              {role === 'customer' && (
                <li>
                  <Link 
                    to="/customer-dashboard" 
                    onClick={closeMenu} 
                    className="nav-link customer-badge"
                  >
                    <i className="fas fa-user-circle nav-icon"></i>
                    <span>My Account</span>
                  </Link>
                </li>
              )}
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={closeMenu} className="nav-link login-link">
                  <i className="fas fa-sign-in-alt nav-icon"></i>
                  <span>Login</span>
                </Link>
              </li>
              <li>
                <Link to="/register" onClick={closeMenu} className="nav-link register-button">
                  <i className="fas fa-user-plus nav-icon"></i>
                  <span>Register</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
