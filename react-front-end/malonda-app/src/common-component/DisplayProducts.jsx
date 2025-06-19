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

  const handleAddToWishlist = (productId) => {
    api.post('/wishlist/', { product: productId })
      .then(() => Swal.fire('Success', 'Product added to wishlist!', 'success'))
      .catch(() => Swal.fire('Error', 'Failed to add to wishlist.', 'error'));
  };

  const handleAddToCart = (productId) => {
    api.post('/cart/', { product: productId, quantity: 1 })
      .then(() => Swal.fire('Added!', 'Product added to cart!', 'success'))
      .catch(() => Swal.fire('Error', 'Failed to add to cart.', 'error'));
  };

  return (
    <div className="products-container">
      <h2 className="text-center mb-4">🛍️ Products</h2>
      <div className="products-grid">
        {products.map(prod => (
          <div key={prod.id} className="product-card">
            {renderProductImage(prod)}
            <h4>{prod.name}</h4>
            <p>{prod.description}</p>
            <p><strong>Price:</strong> ${prod.price}</p>
            <p><strong>Stock:</strong> {prod.stock_quantity}</p>
            <p><strong>Category:</strong> {prod.category?.name || 'Uncategorized'}</p>
            <div className="product-actions">
              <button
                className="btn btn-outline-primary btn-sm me-2"
                onClick={() => handleAddToWishlist(prod.id)}
              >
                ❤️ Wishlist
              </button>
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleAddToCart(prod.id)}
              >
                🛒 Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayProducts;
