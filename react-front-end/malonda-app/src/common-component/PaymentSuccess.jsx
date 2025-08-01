import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../Auth/api';
import Swal from 'sweetalert2';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [transactionId, setTransactionId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const txId = searchParams.get('transaction_id'); // Update for Malipo
    setTransactionId(txId);

    if (!txId) {
      Swal.fire('❌ Error', 'Missing transaction ID in URL.', 'error');
      setLoading(false);
      return;
    }

    // Confirm payment with backend
    api.post('/confirm-malipo/', { transaction_id: txId })
      .then(() => {
        Swal.fire('🎉 Success', 'Payment confirmed successfully!', 'success');
        setLoading(false);
        setTimeout(() => navigate('/orders'), 5000);
      })
      .catch(err => {
        Swal.fire(
          '❌ Failed',
          err.response?.data?.error || 'Confirmation failed. Please contact support.',
          'error'
        );
        setLoading(false);
      });
  }, [searchParams, navigate]);

  return (
    <div className="text-center mt-5">
      {loading ? (
        <>
          <h3>🔄 Verifying your payment...</h3>
          <p>Please wait while we confirm your transaction.</p>
          {transactionId && (
            <p><strong>Transaction ID:</strong> {transactionId}</p>
          )}
        </>
      ) : (
        <>
          <h3>✅ Payment Successful!</h3>
          <p>Thank you. Your order has been processed.</p>
        </>
      )}
    </div>
  );
};

export default PaymentSuccess;
