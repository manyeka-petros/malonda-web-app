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

  return (
    <div className="wishlist-container">
      <h3>💖 Wishlist</h3>
      {wishlist.map(item => (
        <div key={item.id} className="wishlist-item">
          <p>{item.product_name}</p>
          <button onClick={() => handleDelete(item.id)}>❌ Remove</button>
        </div>
      ))}
    </div>
  );
};

export default WishlistView;
