import { useEffect, useState } from 'react';
import api from '../Auth/api';
import Swal from 'sweetalert2';
import './WishlistView.css';

const WishlistView = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = () => {
    setLoading(true);
    api.get('/wishlist/')
      .then(res => {
        setWishlist(res.data);
        setLoading(false);
      })
      .catch(() => {
        Swal.fire('Error', 'Failed to load wishlist.', 'error');
        setLoading(false);
      });
  };

  useEffect(() => { fetchWishlist(); }, []);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      if (result.isConfirmed) {
        api.delete(`/wishlist/${id}/`).then(() => {
          Swal.fire('Deleted!', 'Wishlist item removed.', 'success');
          fetchWishlist();
        });
      }
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
    if (!imagePath) return 'https://via.placeholder.com/300x300?text=No+Image';
    return imagePath.startsWith('http')
      ? imagePath
      : `http://127.0.0.1:8000${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <h2>Your Wishlist</h2>
        <p className="wishlist-subtitle">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}</p>
      </div>

      {loading ? (
        <div className="wishlist-loading">
          <div className="spinner"></div>
          <p>Loading your wishlist...</p>
        </div>
      ) : wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <div className="empty-icon">❤️</div>
          <h3>Your wishlist is empty</h3>
          <p>Start adding items you love</p>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map(item => (
            <div key={item.id} className="wishlist-card">
              <div className="wishlist-card-image">
                <img
                  src={getImageUrl(item.product_image)}
                  alt={item.product_name}
                  loading="lazy"
                />
              </div>
              <div className="wishlist-card-content">
                <h3 className="wishlist-card-title">{item.product_name}</h3>
                <div className="wishlist-card-actions">
                  <button
                    className="wishlist-action-btn wishlist-order-btn"
                    onClick={() => handleOrder(item.product)}
                  >
                    <span className="icon">🛒</span> Order Now
                  </button>
                  <button
                    className="wishlist-action-btn wishlist-remove-btn"
                    onClick={() => handleDelete(item.id)}
                  >
                    <span className="icon">❌</span> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistView;