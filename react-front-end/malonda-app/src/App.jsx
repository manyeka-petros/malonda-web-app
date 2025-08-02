import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Logout from './account/Logout';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useContext } from 'react';

import Navbar from './common-component/Navbar';
import { AuthProvider, AuthContext } from './Auth/AuthContext';

import DisplayProducts from './common-component/DisplayProducts';
import DisplayCategories from './common-component/DisplayCategories';
import CreateCategory from './common-component/CreateCategory';
import CreateProduct from './common-component/CreateProduct';
import Login from './account/Login';
import Register from './account/Register';
import CartView from './common-component/CartView';
import WishlistView from './common-component/WishlistView';
import OrdersView from './common-component/OrdersView';
import ProductDetails from './common-component/ProductDetails';
import HomePage from './common-component/HomePage';
import Dashboard from './common-component/Dashboard';
import AboutUs from './common-component/AboutUs';

function AppContent() {
  // No need for Sidebar logic now
  useContext(AuthContext); 

  return (
    <div>
      <Navbar />
      <div className="p-4">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
       
      

          {/* Protected Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/products" element={<DisplayProducts />} />
          <Route path="/wishlist" element={<WishlistView />} />
          <Route path="/orders" element={<OrdersView />} />
          <Route path="/categories" element={<DisplayCategories />} />
          <Route path="/categories/create" element={<CreateCategory />} />
          <Route path="/products/create" element={<CreateProduct />} />
          <Route path="/cart" element={<CartView />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
