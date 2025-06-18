import { useEffect, useState } from 'react';
import api from '../Auth/api';
import Swal from 'sweetalert2';
import './CartView.css';

const CartView = () => {
  const [cart, setCart] = useState([]);

  const fetchCart = () => {
    api.get('/cart/')
      .then(res => setCart(res.data))
      .catch(() => Swal.fire('Error', 'Failed to load cart items.', 'error'));
  };

  useEffect(() => { fetchCart(); }, []);

  const handleDelete = (id) => {
    api.delete(`/cart/${id}/`).then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'Cart item removed.',
        timer: 1500,
        showConfirmButton: false,
      });
      fetchCart();
    });
  };

  return (
    <div className="cart-container">
      <h3 className="cart-title">🛒 Your Shopping Cart</h3>
      {cart.length === 0 ? (
        <div className="empty-cart">Your cart is empty 😢</div>
      ) : (
        <div className="cart-grid">
          {cart.map(item => (
            <div key={item.id} className="cart-item-card">
              <div className="item-info">
                <h5>{item.product_name}</h5>
                <p><strong>Quantity:</strong> {item.quantity}</p>
              </div>
              <button className="remove-btn" onClick={() => handleDelete(item.id)}>
                ❌ Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartView;
