import { useState } from 'react';
import api from '../Auth/api';
import Swal from 'sweetalert2';
import './Register.css';

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: ''
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/register/', form);
      
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);

      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: 'You have been registered successfully!',
      });

    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        html: err.response?.data
          ? Object.entries(err.response.data)
              .map(([key, val]) => `<p><strong>${key}:</strong> ${val}</p>`)
              .join('')
          : 'Something went wrong.',
      });
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-header">
          <h2>Create Account</h2>
          <p>Join us today</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <input
              name="first_name"
              onChange={handleChange}
              value={form.first_name}
              placeholder="First Name"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <input
              name="last_name"
              onChange={handleChange}
              value={form.last_name}
              placeholder="Last Name"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <input
              name="email"
              type="email"
              onChange={handleChange}
              value={form.email}
              placeholder="Email"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <input
              name="password"
              type="password"
              onChange={handleChange}
              value={form.password}
              placeholder="Password"
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>

        <div className="register-footer">
          <p>Already have an account? <a href="/login" className="login-link">Sign in</a></p>
        </div>
      </div>
    </div>
  );
}