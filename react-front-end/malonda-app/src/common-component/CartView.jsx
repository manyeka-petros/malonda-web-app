import { useEffect, useState } from 'react';
import api from '../Auth/api';
import Swal from 'sweetalert2';
import './CartView.css';
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('pk_test_XXXXXXXXXXXXXXXXXXXXXXXX');

const CartView = () => {
  const [cart, setCart] = useState([]);

  const fetchCart = () => {
    api.get('/cart/')
      .then(res => setCart(res.data))
      .catch(() => Swal.fire('Error', 'Failed to load cart items.', 'error'));
  };

  useEffect(() => {
    fetchCart();
  }, []);

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

  const handleStripeCheckout = async () => {
    const stripe = await stripePromise;

    if (cart.length === 0) {
      Swal.fire('Empty Cart', 'There are no items to order.', 'warning');
      return;
    }

    try {
      // Send structured cart data to your backend
      const response = await api.post('/create-checkout-session/', {
        items: cart.map(item => ({
          product_id: item.product,  // product ID from cart
          quantity: item.quantity,
        })),
      });

      const session = response.data;
      console.log("Stripe session created:", session);

      const result = await stripe.redirectToCheckout({ sessionId: session.id });

      if (result.error) {
        Swal.fire('Stripe Error', result.error.message, 'error');
      }
    } catch (error) {
      console.error('Stripe checkout error:', error.response?.data || error.message);
      Swal.fire('Error', 'Failed to start Stripe checkout.', 'error');
    }
  };

  const renderImage = (img) => {
    const imageUrl = img?.startsWith('http')
      ? img
      : `http://127.0.0.1:8000${img?.startsWith('/') ? '' : '/'}${img}`;
    return (
      <img
        src={imageUrl || 'https://via.placeholder.com/100'}
        alt="product"
        className="cart-product-image"
      />
    );
  };

  const totalPrice = cart.reduce((total, item) => {
    return total + (item.product_price || 0) * item.quantity;
  }, 0);

  return (
    <div className="cart-container">
      <h3 className="cart-title">🛒 Your Shopping Cart</h3>
      {cart.length === 0 ? (
        <div className="empty-cart">Your cart is empty 😢</div>
      ) : (
        <>
          <div className="cart-grid">
            {cart.map(item => (
              <div key={item.id} className="cart-item-card">
                {renderImage(item.product_image)}

                <div className="item-info">
                  <h5>{item.product_name}</h5>
                  <p><strong>Price:</strong> ${item.product_price}</p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                </div>

                <div className="cart-buttons">
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>
                    ❌ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h4>Total Price: ${totalPrice.toFixed(2)}</h4>
            <button className="btn btn-primary mt-3" onClick={handleStripeCheckout}>
              💳 Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartView;
