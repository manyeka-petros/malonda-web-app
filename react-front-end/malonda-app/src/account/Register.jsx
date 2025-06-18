import { useState } from 'react';
import api from '../Auth/api';
import Swal from 'sweetalert2';
import './Register.css'; // Optional, ensure this file exists

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'customer',
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
    <div className="registerContainer">
      <form onSubmit={handleSubmit} className="registerForm">
        <h2>Register</h2>
        <input
          name="first_name"
          onChange={handleChange}
          value={form.first_name}
          placeholder="First Name"
          required
        />
        <input
          name="last_name"
          onChange={handleChange}
          value={form.last_name}
          placeholder="Last Name"
          required
        />
        <input
          name="email"
          type="email"
          onChange={handleChange}
          value={form.email}
          placeholder="Email"
          required
        />
        <input
          name="password"
          type="password"
          onChange={handleChange}
          value={form.password}
          placeholder="Password"
          required
        />
        <select
          name="role"
          onChange={handleChange}
          value={form.role}
          required
        >
          <option value="customer">Customer</option>
          <option value="manager">Manager</option>
          
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
