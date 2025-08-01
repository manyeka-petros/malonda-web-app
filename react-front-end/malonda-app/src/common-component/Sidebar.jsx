import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';
import api from '../Auth/api';
import './Sidebar.css';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const role = user?.role;
  const [cartCount, setCartCount] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize on first render

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (user) {
      api.get('/cart/')
        .then(res => {
          const totalItems = res.data.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(totalItems);
        })
        .catch(() => setCartCount(0));
    }
  }, [user]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const commonLinks = (
    <div className="sidebar-section">
      <h4 className="sidebar-section-title">General</h4>
      <ul className="sidebar-menu">
        <li>
          <NavLink 
            to="/categories" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <i className="sidebar-icon fas fa-list"></i>
            <span className="sidebar-text">Categories</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/products" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <i className="sidebar-icon fas fa-box-open"></i>
            <span className="sidebar-text">Products</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/profile" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <i className="sidebar-icon fas fa-user"></i>
            <span className="sidebar-text">Profile</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );

  const customerLinks = (
    <div className="sidebar-section">
      <h4 className="sidebar-section-title">Shopping</h4>
      <ul className="sidebar-menu">
        <li>
          <NavLink 
            to="/wishlist" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <i className="sidebar-icon fas fa-heart"></i>
            <span className="sidebar-text">Wishlist</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/cart" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <i className="sidebar-icon fas fa-shopping-cart"></i>
            <span className="sidebar-text">My Cart</span>
            {cartCount > 0 && (
              <span className="cart-badge">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/orders" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <i className="sidebar-icon fas fa-clipboard-list"></i>
            <span className="sidebar-text">My Orders</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );

  const managerLinks = (
    <div className="sidebar-section">
      <h4 className="sidebar-section-title">Management</h4>
      <ul className="sidebar-menu">
        <li>
          <NavLink 
            to="/manager-dashboard" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <i className="sidebar-icon fas fa-tachometer-alt"></i>
            <span className="sidebar-text">Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/categories/create" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <i className="sidebar-icon fas fa-plus-circle"></i>
            <span className="sidebar-text">Add Category</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/products/create" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <i className="sidebar-icon fas fa-plus-square"></i>
            <span className="sidebar-text">Add Product</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/manage-products" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <i className="sidebar-icon fas fa-boxes"></i>
            <span className="sidebar-text">Manage Products</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/manage-orders" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <i className="sidebar-icon fas fa-clipboard-check"></i>
            <span className="sidebar-text">Manage Orders</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/customers" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <i className="sidebar-icon fas fa-users"></i>
            <span className="sidebar-text">Customers</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );

  return (
    <>
      {isMobile && !isCollapsed && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}
      
      <div className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobile ? 'mobile' : ''}`}>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isCollapsed ? (
            <i className="fas fa-bars"></i>
          ) : (
            <i className="fas fa-times"></i>
          )}
        </button>
        
        <div className="sidebar-header">
          <h3 className="sidebar-title">
            {!isCollapsed && (
              <>
                <i className="fas fa-chart-line"></i>
                <span>Dashboard</span>
              </>
            )}
            {isCollapsed && <i className="fas fa-chart-line"></i>}
          </h3>
        </div>

        <div className="sidebar-content">
          {role === 'customer' && customerLinks}
          {role === 'manager' && managerLinks}
          {commonLinks}
          
          <div className="sidebar-section">
            <ul className="sidebar-menu">
              <li>
                <NavLink 
                  to="/logout" 
                  className={({ isActive }) => `sidebar-link logout-link ${isActive ? 'active' : ''}`}
                >
                  <i className="sidebar-icon fas fa-sign-out-alt"></i>
                  <span className="sidebar-text">Logout</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;