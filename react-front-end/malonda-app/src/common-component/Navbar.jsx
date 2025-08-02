import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../Auth/AuthContext';
import api from '../Auth/api';
import Swal from 'sweetalert2';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const role = user?.role || localStorage.getItem('role');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('access'));
  }, []);

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

  // Fetch cart count for customers
  useEffect(() => {
    if (isAuthenticated && role === 'customer') {
      api.get('/cart/')
        .then(res => {
          const totalItems = res.data.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(totalItems);
        })
        .catch(() => setCartCount(0));
    }
  }, [isAuthenticated, role]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    if (isMobile) {
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    Swal.fire('Logged out', 'You have been successfully logged out!', 'success');
    navigate('/login');
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

          {/* Common Links */}
          <li>
            <Link to="/categories" onClick={closeMenu} className="nav-link">
              <i className="fas fa-list nav-icon"></i>
              <span>Categories</span>
            </Link>
          </li>
          <li>
            <Link to="/products" onClick={closeMenu} className="nav-link">
              <i className="fas fa-box-open nav-icon"></i>
              <span>Products</span>
            </Link>
          </li>

          {/* Customer Links */}
          {isAuthenticated && role === 'customer' && (
            <>
              <li>
                <Link to="/wishlist" onClick={closeMenu} className="nav-link">
                  <i className="fas fa-heart nav-icon"></i>
                  <span>Wishlist</span>
                </Link>
              </li>
              <li>
                <Link to="/cart" onClick={closeMenu} className="nav-link">
                  <i className="fas fa-shopping-cart nav-icon"></i>
                  <span>My Cart</span>
                  {cartCount > 0 && <span className="cart-badge">{cartCount > 9 ? '9+' : cartCount}</span>}
                </Link>
              </li>
              <li>
                <Link to="/orders" onClick={closeMenu} className="nav-link">
                  <i className="fas fa-clipboard-list nav-icon"></i>
                  <span>My Orders</span>
                </Link>
              </li>
            </>
          )}

          {/* Manager Links */}
          {isAuthenticated && role === 'manager' && (
            <>
              <li>
                <Link to="/manager-dashboard" onClick={closeMenu} className="nav-link">
                  <i className="fas fa-tachometer-alt nav-icon"></i>
                  <span>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/categories/create" onClick={closeMenu} className="nav-link">
                  <i className="fas fa-plus-circle nav-icon"></i>
                  <span>Add Category</span>
                </Link>
              </li>
              <li>
                <Link to="/products/create" onClick={closeMenu} className="nav-link">
                  <i className="fas fa-plus-square nav-icon"></i>
                  <span>Add Product</span>
                </Link>
              </li>
              <li>
                <Link to="/manage-products" onClick={closeMenu} className="nav-link">
                  <i className="fas fa-boxes nav-icon"></i>
                  <span>Manage Products</span>
                </Link>
              </li>
              <li>
                <Link to="/manage-orders" onClick={closeMenu} className="nav-link">
                  <i className="fas fa-clipboard-check nav-icon"></i>
                  <span>Manage Orders</span>
                </Link>
              </li>
              <li>
                <Link to="/customers" onClick={closeMenu} className="nav-link">
                  <i className="fas fa-users nav-icon"></i>
                  <span>Customers</span>
                </Link>
              </li>
            </>
          )}

          {/* Logout/Login */}
          {isAuthenticated ? (
            <li>
              <NavLink 
                to="/logout"
                onClick={(e) => { e.preventDefault(); handleLogout(); }}
                className={({ isActive }) => `nav-link logout-link ${isActive ? 'active' : ''}`}
              >
                <i className="fas fa-sign-out-alt nav-icon"></i>
                <span>Logout</span>
              </NavLink>
            </li>
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
