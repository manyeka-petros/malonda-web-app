import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Auth/api';
import Swal from 'sweetalert2';
import './DisplayCategories.css';

const DisplayCategories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/categories/')
      .then(res => {
        setCategories(res.data);
        Swal.fire({
          title: 'Loaded!',
          text: 'Categories fetched successfully.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      })
      .catch(err => {
        console.error('Error loading categories:', err);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load categories.',
          icon: 'error',
        });
      });
  }, []);

  const handleCategoryClick = (id) => {
    navigate(`/category/${id}`);
  };

  const imgUrl = (src) =>
    src || 'https://via.placeholder.com/400x300?text=No+Image';

  const renderProductPreview = (product) => {
    const images = product.images?.length > 0 ? product.images : [];
    const firstImage = images.length > 0 ? imgUrl(images[0].image) : imgUrl();

    return (
      <div key={product.id} className="product-card-preview">
        <img
          src={firstImage}
          alt={product.name}
          className="product-image-preview"
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderRadius: '10px'
          }}
        />
        <p>{product.name}</p>
        <p><strong>${product.price}</strong></p>
      </div>
    );
  };

  return (
    <div className="categories-container">
      <h2 className="categories-title">📁 Product Categories</h2>
      <div className="categories-grid">
        {categories.map(cat => (
          <div
            key={cat.id}
            className="category-card"
            onClick={() => handleCategoryClick(cat.id)}
            style={{ cursor: 'pointer' }}
          >
            <h3>{cat.name}</h3>
            <p>{cat.description}</p>
            {cat.products && cat.products.length > 0 ? (
              <div className="product-preview-list">
                {cat.products.slice(0, 2).map(renderProductPreview)}
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
