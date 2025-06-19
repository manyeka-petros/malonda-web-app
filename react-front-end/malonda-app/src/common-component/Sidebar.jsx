import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';
import api from '../Auth/api';
import './Sidebar.css';

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const role = user?.role;

  const [cartCount, setCartCount] = useState(0);

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

  const commonLinks = (
    <ul>
      <li>
        <NavLink to="/categories" className={({ isActive }) => (isActive ? 'active' : '')}>
          📁 View Categories
        </NavLink>
      </li>
      <li>
        <NavLink to="/products" className={({ isActive }) => (isActive ? 'active' : '')}>
          🛍️ View Products
        </NavLink>
      </li>
      <li>
        <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
          👤 My Profile
        </NavLink>
      </li>
      <li>
        <NavLink to="/logout" className={({ isActive }) => (isActive ? 'active' : '')}>
          🚪 Logout
        </NavLink>
      </li>
    </ul>
  );

  const renderLinks = () => {
    switch (role) {
      case 'customer':
        return (
          <ul>
            <li>
              <NavLink to="/customer-dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
                🏠 Customer Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/wishlist" className={({ isActive }) => (isActive ? 'active' : '')}>
                💖 My Wishlist
              </NavLink>
            </li>
            <li>
              <NavLink to="/cart" className={({ isActive }) => (isActive ? 'active' : '')}>
                🛒 My Cart {cartCount > 0 && <span className="cart-badge">({cartCount})</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/orders" className={({ isActive }) => (isActive ? 'active' : '')}>
                📦 My Orders
              </NavLink>
            </li>
          </ul>
        );

      case 'manager':
        return (
          <ul>
            <li>
              <NavLink to="/manager-dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
                📊 Manager Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/categories/create" className={({ isActive }) => (isActive ? 'active' : '')}>
                ➕ Add Category
              </NavLink>
            </li>
            <li>
              <NavLink to="/products/create" className={({ isActive }) => (isActive ? 'active' : '')}>
                ➕ Add Product
              </NavLink>
            </li>
            <li>
              <NavLink to="/manage-products" className={({ isActive }) => (isActive ? 'active' : '')}>
                🛠️ Manage Products
              </NavLink>
            </li>
            <li>
              <NavLink to="/manage-orders" className={({ isActive }) => (isActive ? 'active' : '')}>
                📦 Manage Orders
              </NavLink>
            </li>
            <li>
              <NavLink to="/customers" className={({ isActive }) => (isActive ? 'active' : '')}>
                👥 Customers
              </NavLink>
            </li>
          </ul>
        );

      default:
        return <p>No sidebar options available.</p>;
    }
  };

  return (
    <div className="sidebar">
      <h3>📂 Dashboard</h3>
      {renderLinks()}
      {commonLinks}
    </div>
  );
};

export default Sidebar;
