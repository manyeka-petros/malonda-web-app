// src/App.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Logout from './account/Logout';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useContext } from 'react';

import Navbar from './common-component/Navbar';
import Sidebar from './common-component/Sidebar';
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
import StripeCheckoutButton from './common-component/StripeCheckoutButton';
import PaymentSuccess from './common-component/PaymentSuccess';
import PaymentCancel from './common-component/PaymentCancel'; // optional
import ProductDetails from './common-component/ProductDetails';
import HomePage from './common-component/HomePage';
import Dashboard from './common-component/Dashboard';
import AboutUs from './common-component/AboutUs';


function AppContent() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        

        {isLoggedIn && <Sidebar />}
        <div className="flex-grow-1 p-4" style={{ marginLeft: isLoggedIn ? '250px' : '0' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/success" element={<PaymentSuccess />} />
            <Route path="/cancel" element={<PaymentCancel />} />

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
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/about" element={<AboutUs/>} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/checkout" element={<StripeCheckoutButton />} />
          </Routes>
        </div>
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
