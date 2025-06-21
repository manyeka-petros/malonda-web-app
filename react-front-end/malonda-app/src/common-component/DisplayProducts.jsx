import { useEffect, useState } from 'react';
import api from '../Auth/api';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    const imageUrl = product.image
      ? product.image.startsWith('http')
        ? product.image
        : `http://127.0.0.1:8000${product.image.startsWith('/') ? '' : '/'}${product.image}`
      : 'https://via.placeholder.com/300x200?text=No+Image';

    return (
      <img
        src={imageUrl}
        alt={product.name}
        className="card-img-top"
        style={{ height: '200px', objectFit: 'cover' }}
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
    <div className="container py-5">
      <h2 className="text-center mb-4">🛍️ Explore Our Products</h2>
      <div className="row g-4">
        {products.map(prod => (
          <div key={prod.id} className="col-sm-6 col-md-4 col-lg-3">
            <div className="card h-100 shadow-sm">
              {renderProductImage(prod)}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{prod.name}</h5>
                <p className="card-text text-muted" style={{ fontSize: '0.9rem' }}>
                  {prod.description}
                </p>
                <ul className="list-unstyled mb-3">
                  <li><strong>Price:</strong> ${prod.price}</li>
                  <li><strong>Stock:</strong> {prod.stock_quantity}</li>
                  <li><strong>Category:</strong> {prod.category?.name || 'Uncategorized'}</li>
                </ul>
                <div className="mt-auto d-flex justify-content-between">
                  <button
                    className="btn btn-outline-primary btn-sm"
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayProducts;
