import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

import { Navbar } from './common-component/Navbar';
import Sidebar from './common-component/Sidebar';
import Login from './account/Login';
import Register from './account/Register';
import { useContext } from 'react';
import { AuthContext, AuthProvider } from './Auth/AuthContext';

// Existing Components
import CreateCategory from './common-component/CreateCategory';
import DisplayCategories from './common-component/DisplayCategories';
import CreateProduct from './common-component/CreateProduct';
import DisplayProducts from './common-component/DisplayProducts';
import ManagerDashboard from './common-component/ManagerDashboard';

// ✅ New Components
import CartView from './common-component/CartView';
import WishlistView from './common-component/WishlistView';
import OrdersView from './common-component/OrdersView';

// ✅ Layout wrapper component
const AppLayout = ({ children }) => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const hideSidebarRoutes = ['/login', '/register'];
  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname) || !user;

  return (
    <>
      <Navbar />
      <div className="app-layout">
        {!shouldHideSidebar && <Sidebar />}
        <main className={`main-content ${shouldHideSidebar ? 'w-100' : ''}`}>
          <div className="container-fluid">{children}</div>
        </main>
      </div>
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <Routes>
            {/* Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Category/Product Management */}
            <Route path="/categories/create" element={<CreateCategory />} />
            <Route path="/categories" element={<DisplayCategories />} />
            <Route path="/products/create" element={<CreateProduct />} />
            <Route path="/products" element={<DisplayProducts />} />

            {/* Cart / Wishlist / Orders */}
            <Route path="/cart" element={<CartView />} />
            <Route path="/wishlist" element={<WishlistView />} />
            <Route path="/orders" element={<OrdersView />} />

            {/* Manager Dashboard */}
            <Route path="/manager-dashboard" element={<ManagerDashboard />} />
          </Routes>
        </AppLayout>
      </Router>
    </AuthProvider>
  );
}
