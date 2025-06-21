import { useEffect, useState } from 'react';
import api from '../Auth/api';
import Swal from 'sweetalert2';
import './WishlistView.css';

const WishlistView = () => {
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = () => {
    api.get('/wishlist/')
      .then(res => setWishlist(res.data))
      .catch(() => Swal.fire('Error', 'Failed to load wishlist.', 'error'));
  };

  useEffect(() => { fetchWishlist(); }, []);

  const handleDelete = (id) => {
    api.delete(`/wishlist/${id}/`).then(() => {
      Swal.fire('Deleted!', 'Wishlist item removed.', 'success');
      fetchWishlist();
    });
  };

  const handleOrder = (productId) => {
    api.post('/orders/', {
      items: [{ product: productId, quantity: 1 }]
    })
    .then(() => Swal.fire('Ordered!', 'Product has been ordered.', 'success'))
    .catch(() => Swal.fire('Error', 'Failed to place order.', 'error'));
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/100';
    return imagePath.startsWith('http')
      ? imagePath
      : `http://127.0.0.1:8000${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  return (
    <div className="wishlist-container">
      <h3 className="text-center mb-4">💖 Wishlist</h3>

      {wishlist.length === 0 ? (
        <p className="text-center">Your wishlist is empty.</p>
      ) : (
        <div className="card wishlist-single-card shadow">
          <div className="card-body">
            <h5 className="card-title">Your Favorite Items</h5>
            <div className="wishlist-grid">
              {wishlist.map(item => (
                <div key={item.id} className="wishlist-card-item">
                  <img
                    src={getImageUrl(item.product_image)}
                    alt={item.product_name}
                    className="wishlist-item-img"
                  />
                  <div className="wishlist-item-details">
                    <strong>{item.product_name}</strong>
                    <div className="wishlist-buttons mt-2">
                      <button
                        className="btn btn-danger btn-sm me-2"
                        onClick={() => handleDelete(item.id)}
                      >
                        ❌ Remove
                      </button>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleOrder(item.product)}
                      >
                        🛒 Order
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistView;
