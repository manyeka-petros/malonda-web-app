// src/components/DisplayCategories.jsx
import { useEffect, useState } from 'react';
import api from '../Auth/api';
import Swal from 'sweetalert2'; // ✅ SweetAlert2
import './DisplayCategories.css';

const DisplayCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/categories/')
      .then(res => {
        setCategories(res.data);

        // ✅ Show success alert once
        Swal.fire({
          title: 'Success!',
          text: 'Categories loaded successfully.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        });
      })
      .catch(err => {
        console.error('Failed to fetch categories', err);

        // ❌ Show error alert
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load categories.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      });
  }, []);

  return (
    <div className="categories-container">
      <h2 className="categories-title">📂 Categories</h2>
      <div className="categories-grid">
        {categories.map(cat => (
          <div key={cat.id} className="category-card">
            <h4>{cat.name}</h4>
            <p>{cat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayCategories;
