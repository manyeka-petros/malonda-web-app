import { useEffect, useState } from 'react';
import api from '../Auth/api';
import Swal from 'sweetalert2';
import styles from './CartView.module.css';
import { useNavigate } from 'react-router-dom';

const CartView = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

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

  const renderImage = (img) => {
    const imageUrl = img?.startsWith('http')
      ? img
      : `http://127.0.0.1:8000${img?.startsWith('/') ? '' : '/'}${img}`;
    return (
      <img
        src={imageUrl || 'https://via.placeholder.com/100'}
        alt="product"
        className={styles.cartProductImage}
      />
    );
  };

  const totalPrice = cart.reduce((total, item) => {
    return total + (item.product_price || 0) * item.quantity;
  }, 0);

  const handleStripeCheckout = async () => {
    if (cart.length === 0) {
      Swal.fire('Empty Cart', 'You need items in cart to proceed.', 'warning');
      return;
    }

    try {
      // First confirm the order to save it in DB
      const confirmResponse = await api.post('/confirm-order/', {
        items: cart.map(item => ({
          product: item.product,
          quantity: item.quantity,
        })),
        total_price: totalPrice,
      });

      if (!confirmResponse.data || !confirmResponse.data.id) {
        throw new Error("Failed to confirm order before Stripe.");
      }

      // Now proceed to Stripe
      const stripeResponse = await api.post('/create-checkout-session/', {
        items: cart.map(item => ({
          name: item.product_name,
          price: Math.round(item.product_price * 100),
          quantity: item.quantity,
        })),
        order_id: confirmResponse.data.id, // Send order ID
      });

      const stripe = await (await import('@stripe/stripe-js')).loadStripe('pk_test_51RbiWcF79TyJMFC9I5vGFzeSc87eM7B4VUmw16nhXdoXFurKM1QiMvcb7vBkP52z95Li9FBt8wTHZDvcPmwTEvRW00ehI4TGeL');

      const result = await stripe.redirectToCheckout({
        sessionId: stripeResponse.data.id,
      });

      if (result.error) {
        Swal.fire('Error', result.error.message, 'error');
      }
    } catch (error) {
      console.error('Stripe Checkout Error:', error);
      Swal.fire('Error', 'Could not initiate checkout.', 'error');
    }
  };

  return (
    <div className={styles.cartContainer}>
      <h3 className={styles.cartTitle}>🛒 Your Shopping Cart</h3>
      {cart.length === 0 ? (
        <div className={styles.emptyCart}>Your cart is empty 😢</div>
      ) : (
        <>
          <div className={styles.cartGrid}>
            {cart.map(item => (
              <div key={item.id} className={styles.cartItemCard}>
                {renderImage(item.product_image)}
                <div className={styles.itemInfo}>
                  <h5>{item.product_name}</h5>
                  <p><strong>Price:</strong> ${item.product_price}</p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                </div>
                <div className={styles.cartButtons}>
                  <button
                    className={styles.removeButton}
                    onClick={() => handleDelete(item.id)}
                  >
                    ❌ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.cartSummary}>
            <h4>Total Price: ${totalPrice.toFixed(2)}</h4>
            <button
              className="btn btn-primary mt-3"
              onClick={handleStripeCheckout}
            >
              💳 Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartView;
