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
        wishlist.map(item => (
          <div key={item.id} className="wishlist-item card mb-3">
            <div className="row g-0">
              <div className="col-md-2">
                <img
                  src={getImageUrl(item.product_image)}
                  alt={item.product_name}
                  className="img-fluid rounded-start"
                  style={{ height: '100px', objectFit: 'cover' }}
                />
              </div>
              <div className="col-md-10">
                <div className="card-body">
                  <h5 className="card-title">{item.product_name}</h5>
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
                      🛒 Order Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default WishlistView;
