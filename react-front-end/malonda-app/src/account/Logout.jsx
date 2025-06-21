// src/account/Logout.jsx
import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Auth/api';
import { AuthContext } from '../Auth/AuthContext';
import Swal from 'sweetalert2';

export default function Logout() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const performLogout = async () => {
      const refresh = localStorage.getItem('refresh');

      try {
        if (refresh) {
          // Send refresh token to backend for blacklisting
          await api.post('/logout/', { refresh });
        }

        // Clear auth context and tokens
        logout();

        Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          text: 'You have been successfully logged out.',
          timer: 2000,
          showConfirmButton: false,
        });

        // Redirect to login page
        navigate('/login');
      } catch (err) {
        console.error('Logout error:', err);

        Swal.fire({
          icon: 'error',
          title: 'Logout Failed',
          text: err.response?.data?.detail || 'There was a problem logging you out.',
        });

        // Always clear session and redirect, even on error
        logout();
        navigate('/login');
      }
    };

    performLogout();
  }, [logout, navigate]);

  return null;
}
