import { useEffect, useState } from 'react';
import api from '../Auth/api';
import Swal from 'sweetalert2';
import './DisplayCategories.css';

const DisplayCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/categories/')
      .then(res => {
        setCategories(res.data);
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
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load categories.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      });
  }, []);

  const renderProduct = (product) => (
    <div key={product.id} className="product-card">
      <img
        src={`http://127.0.0.1:8000${product.image}`}
        alt={product.name}
        className="product-image"
      />
      <p>{product.name}</p>
      <p><strong>${product.price}</strong></p>
    </div>
  );

  return (
    <div className="categories-container">
      <h2 className="categories-title">📂 Categories</h2>
      <div className="categories-grid">
        {categories.map(cat => (
          <div key={cat.id} className="category-card">
            <h4>{cat.name}</h4>
            <p>{cat.description}</p>
            {cat.products && cat.products.length > 0 ? (
              <div className="product-list">
                {cat.products.map(renderProduct)}
              </div>
            ) : (
              <p>No products in this category.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayCategories;
