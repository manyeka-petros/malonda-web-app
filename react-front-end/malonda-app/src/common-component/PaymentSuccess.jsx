// src/common-component/PaymentSuccess.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../Auth/api';
import Swal from 'sweetalert2';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const session_id = searchParams.get('session_id');
    setSessionId(session_id);
    console.log("✅ Retrieved session_id from URL:", session_id); // Debug log

    if (!session_id) {
      Swal.fire('❌ Error', 'Missing session ID in URL.', 'error');
      setLoading(false);
      return;
    }

    api.post('/confirm-order/', { session_id })
      .then(res => {
        console.log("✅ Server response:", res.data); // Log response
        Swal.fire('🎉 Success', 'Payment confirmed and order saved!', 'success');
        setLoading(false);

        setTimeout(() => {
          navigate('/orders');
        }, 5000);
      })
      .catch(err => {
        console.error('❌ Order confirmation error:', err.response?.data || err.message);
        Swal.fire(
          '❌ Failed',
          err.response?.data?.error || 'Order confirmation failed. Please contact support.',
          'error'
        );
        setLoading(false);
      });
  }, [searchParams, navigate]);

  return (
    <div className="text-center mt-5">
      {loading ? (
        <>
          <h3>🔄 Confirming your payment...</h3>
          <p>Please wait while we save your order details.</p>
          {sessionId && <p><strong>Session ID:</strong> {sessionId}</p>}
        </>
      ) : (
        <>
          <h3>✅ Payment successful!</h3>
          <p>Thank you for your order. A confirmation email has been sent.</p>
        </>
      )}
    </div>
  );
};

export default PaymentSuccess;
