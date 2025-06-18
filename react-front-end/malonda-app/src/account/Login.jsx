import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../Auth/api';
import { AuthContext } from '../Auth/AuthContext';
import Swal from 'sweetalert2';
import './Login.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post('/login/', form);

      const { access, refresh, user: userData } = res.data;

      if (!userData || !access) {
        throw new Error("Missing user data or token in response");
      }

      console.log("✅ Login successful!");
      console.log("🔑 Access token:", access);
      console.log("🔄 Refresh token:", refresh);

      localStorage.setItem('access', access);
      localStorage.setItem('refresh', refresh);

      login(access, userData);

      Swal.fire({
        icon: 'success',
        title: 'Login Successful',
        text: `Welcome back, ${userData.email || 'user'}!`,
        timer: 2000,
        showConfirmButton: false,
      });

      navigate('/');
    } catch (err) {
      console.error("❌ Login error:", err);

      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Invalid email or password',
      });

      setIsLoading(false);
    }
  };

  return (
    <div className="fullScreenContainer">
      <div className="loginContainer">
        <h2 className="loginTitle">Login</h2>

        <form onSubmit={handleSubmit} className="loginForm">
          <div className="inputGroup">
            <label htmlFor="email" className="inputLabel">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="your@email.com"
              className="inputField"
              required
            />
          </div>

          <div className="inputGroup">
            <label htmlFor="password" className="inputLabel">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="inputField"
              required
            />
          </div>

          <button
            type="submit"
            className="loginButton"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="linkText">
          Don't have an account?{' '}
          <Link to="/register" className="link">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
