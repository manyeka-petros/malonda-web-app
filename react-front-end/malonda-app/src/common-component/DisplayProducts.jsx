import { useEffect, useState } from 'react';
import api from '../Auth/api';
import Swal from 'sweetalert2';
import './DisplayProducts.css';

const DisplayProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/products/')
      .then(res => {
        console.log("Fetched products:", res.data);
        setProducts(res.data);
      })
      .catch(err => {
        console.error('Failed to fetch products', err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to load products. Please try again later.',
        });
      });
  }, []);

  const renderProductImage = (product) => {
    if (product.image) {
      const imageUrl = product.image.startsWith('http')
        ? product.image
        : `http://127.0.0.1:8000${product.image.startsWith('/') ? '' : '/'}${product.image}`;

      return (
        <img
          src={imageUrl}
          alt={product.name}
          className="product-image"
        />
      );
    }
    return (
      <img
        src="https://via.placeholder.com/150"
        alt="No image available"
        className="product-image"
      />
    );
  };

  return (
    <div className="products-container">
      <h2>Products</h2>
      <div className="products-grid">
        {products.map(prod => (
          <div key={prod.id} className="product-card">
            {renderProductImage(prod)}
            <h4>{prod.name}</h4>
            <p>{prod.description}</p>
            <p><strong>Price:</strong> ${prod.price}</p>
            <p><strong>Stock:</strong> {prod.stock_quantity}</p>
            <p><strong>Category:</strong> {prod.category?.name || 'Uncategorized'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayProducts;
