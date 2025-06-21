// src/common-component/StripeCheckoutButton.jsx
import { loadStripe } from '@stripe/stripe-js';
import api from '../Auth/api';
import Swal from 'sweetalert2';

// 🔐 Use your Stripe publishable key (test or live)
const stripePromise = loadStripe('pk_test_51RbiWcF79TyJMFC9I5vGFzeSc87eM7B4VUmw16nhXdoXFurKM1QiMvcb7vBkP52z95Li9FBt8wTHZDvcPmwTEvRW00ehI4TGeL');

const StripeCheckoutButton = ({ cart }) => {
  const handleCheckout = async () => {
    const stripe = await stripePromise;

    if (!cart || cart.length === 0) {
      Swal.fire('Empty Cart', 'There are no items to checkout.', 'warning');
      return;
    }

    try {
      const accessToken = localStorage.getItem('access');
      if (!accessToken) {
        Swal.fire('Unauthorized', 'You must be logged in to proceed.', 'error');
        return;
      }

      const response = await api.post('/create-checkout-session/', {
        items: cart.map(item => ({
          name: item.product_name,
          price: Math.round(item.product_price * 100), // in cents
          quantity: item.quantity,
        })),
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const session = response.data;

      const result = await stripe.redirectToCheckout({
        sessionId: session.id
      });

      if (result.error) {
        Swal.fire('Stripe Error', result.error.message, 'error');
        console.error('❌ Stripe redirect error:', result.error);
      }
    } catch (error) {
      console.error('❌ Stripe checkout error:', error.response?.data || error.message);
      Swal.fire('Error', error.response?.data?.error || 'Failed to start Stripe checkout.', 'error');
    }
  };

  return (
    <button className="btn btn-primary mt-3" onClick={handleCheckout}>
      💳 Proceed to Checkout
    </button>
  );
};

export default StripeCheckoutButton;
