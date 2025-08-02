// src/components/CartView.jsx
import { useEffect, useState, useContext } from 'react';
import api from '../Auth/api';
import Swal from 'sweetalert2';
import { AuthContext } from '../Auth/AuthContext';
import styles from './CartView.module.css';
import {
  FaShoppingCart, FaTrash, FaPlus, FaMinus,
  FaArrowRight, FaTag, FaSpinner
} from 'react-icons/fa';
import { BiShoppingBag } from 'react-icons/bi';

const CartView = () => {
  const [cart, setCart] = useState([]);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const { user, isLoggedIn } = useContext(AuthContext);

  // Calculate subtotal and total
  const subtotal = cart.reduce(
    (tot, i) => tot + (parseFloat(i.product_price) || 0) * i.quantity, 0
  );
  const totalPrice = subtotal - discountAmount;

  // Fetch cart items from backend
  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/cart/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      });
      setCart(data);
    } catch {
      Swal.fire('Error', 'Failed to load cart items.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Delete cart item
  const handleDelete = async (id) => {
    const ok = (await Swal.fire({
      title: 'Remove Item',
      text: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e03131',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, remove it!'
    })).isConfirmed;

    if (!ok) return;

    try {
      await api.delete(`/cart/${id}/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      });
      Swal.fire({ icon: 'success', title: 'Removed!', timer: 1200, showConfirmButton: false });
      fetchCart();
    } catch {
      Swal.fire('Error', 'Failed to remove item.', 'error');
    }
  };

  // Change quantity
  const handleQuantityChange = async (id, q) => {
    if (q < 1) return;
    try {
      await api.patch(`/cart/${id}/`, { quantity: q }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      });
      fetchCart();
    } catch {
      Swal.fire('Error', 'Failed to update quantity.', 'error');
    }
  };

  // Apply discount
  const applyDiscount = async () => {
    if (!discountCode.trim()) {
      Swal.fire('Error', 'Enter a discount code', 'error');
      return;
    }
    try {
      const { data } = await api.post('/apply-discount/', { code: discountCode }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      });
      setDiscountApplied(true);
      setDiscountAmount(data.discount_amount);
      Swal.fire('Success', `You saved $${parseFloat(data.discount_amount).toFixed(2)}`, 'success');
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Invalid code', 'error');
    }
  };

  // Remove discount
  const removeDiscount = async () => {
    try {
      await api.delete('/remove-discount/', {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      });
      setDiscountApplied(false);
      setDiscountAmount(0);
      setDiscountCode('');
      Swal.fire('Removed', 'Discount has been removed', 'success');
    } catch {
      Swal.fire('Error', 'Failed to remove discount', 'error');
    }
  };

  // Checkout (PayChangu)
  const handleCheckout = async () => {
    if (!isLoggedIn) {
      Swal.fire('Login Required', 'Please login to checkout.', 'warning');
      return;
    }

    if (!cart.length) {
      Swal.fire('Empty Cart', 'Add items before checkout.', 'warning');
      return;
    }

    setIsCheckingOut(true);

    try {
      const metaData = {
        cartItems: cart.map(i => `${i.product_name} (x${i.quantity})`),
        userId: user?.id || null
      };

      const { data } = await api.post('/payments/initiate/', {
        amount: totalPrice,
        currency: 'MWK',
        email: user?.email || 'customer@example.com',
        first_name: user?.first_name || 'Guest',
        last_name: user?.last_name || '',
        title: 'Cart Checkout',
        description: 'Payment for items in cart',
        meta: metaData
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access')}` }
      });

      if (data.status === 'success' && data.data?.checkout_url) {
        window.location.href = data.data.checkout_url;
      } else {
        Swal.fire('Error', data.message || 'Could not initiate payment.', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Could not initiate payment.', 'error');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const renderImage = (img) => {
    const fallback = 'https://via.placeholder.com/300x220?text=No+Image';
    const url = img?.startsWith('http') ? img : img ? `http://127.0.0.1:8000${img.startsWith('/') ? '' : '/'}${img}` : fallback;
    
    return (
      <div className={styles.imageContainer}>
        <img
          src={url}
          alt="Product"
          className={styles.cartProductImage}
          loading="lazy"
          onError={(e) => { 
            e.target.src = fallback;
            e.target.classList.add(styles.imageError);
          }}
        />
      </div>
    );
  };

  if (isLoading && !cart.length) {
    return (
      <div className={styles.cartPage}>
        <div className={styles.cartHeader}>
          <h1 className={styles.mainHeading}>
            <FaShoppingCart /> My Shopping Cart
          </h1>
        </div>
        <div className={styles.loadingContainer}>
          <FaSpinner className={styles.spinner} size={32} />
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <div className={styles.cartHeader}>
        <h1 className={styles.mainHeading}>
          <FaShoppingCart /> My Shopping Cart
        </h1>
        {cart.length > 0 && (
          <p className={styles.itemCount}>{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
        )}
      </div>

      {cart.length === 0 ? (
        <div className={styles.emptyCart}>
          <div className={styles.emptyCartIllustration}>
            <BiShoppingBag size={64} />
          </div>
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added anything yet</p>
          <button 
            className={styles.continueShoppingButton}
            onClick={() => window.location.href = '/products'}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className={styles.cartContent}>
          {isCheckingOut && (
            <div className={styles.checkoutOverlay}>
              <div className={styles.checkoutLoader}>
                <FaSpinner className={styles.spinner} size={24} />
                <p>Processing your order...</p>
              </div>
            </div>
          )}

          <div className={styles.cartItems}>
            {cart.map(i => (
              <div key={i.id} className={styles.cartItem}>
                {renderImage(i.product_image)}
                
                <div className={styles.itemDetails}>
                  <div className={styles.itemHeader}>
                    <h3 className={styles.productTitle}>{i.product_name}</h3>
                    <button 
                      className={styles.removeButton}
                      onClick={() => handleDelete(i.id)}
                      aria-label="Remove item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  
                  <div className={styles.priceRow}>
                    <span>Price:</span>
                    <span className={styles.price}>${parseFloat(i.product_price).toFixed(2)}</span>
                  </div>

                  <div className={styles.quantityRow}>
                    <div className={styles.quantityControls}>
                      <button 
                        className={styles.quantityButton}
                        onClick={() => handleQuantityChange(i.id, i.quantity - 1)}
                        disabled={i.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <FaMinus />
                      </button>
                      <span className={styles.quantityDisplay}>{i.quantity}</span>
                      <button 
                        className={styles.quantityButton}
                        onClick={() => handleQuantityChange(i.id, i.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <FaPlus />
                      </button>
                    </div>

                    <div className={styles.itemTotal}>
                      ${(parseFloat(i.product_price) * i.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.cartSummary}>
            <div className={styles.discountSection}>
              <h4><FaTag /> Discount Code</h4>
              <div className={styles.discountInputGroup}>
                <input 
                  type="text"
                  className={styles.discountInput}
                  placeholder="Enter code"
                  value={discountCode}
                  onChange={e => setDiscountCode(e.target.value)}
                  disabled={discountApplied} 
                />
                {discountApplied ? (
                  <button 
                    className={styles.discountRemoveButton}
                    onClick={removeDiscount}
                  >
                    Remove
                  </button>
                ) : (
                  <button 
                    className={styles.discountButton}
                    onClick={applyDiscount}
                    disabled={!discountCode.trim()}
                  >
                    Apply
                  </button>
                )}
              </div>
            </div>

            <div className={styles.orderSummary}>
              <h4>Order Summary</h4>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountApplied && (
                <div className={styles.summaryRow}>
                  <span>Discount</span>
                  <span className={styles.discountAmount}>- ${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className={styles.summaryTotal}>
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <button 
                className={styles.checkoutButton}
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <>
                    <FaSpinner className={styles.spinner} /> Processing...
                  </>
                ) : (
                  <>
                    Proceed to Checkout <FaArrowRight />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartView;
