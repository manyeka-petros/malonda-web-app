import { useEffect, useState } from 'react';
import api from '../Auth/api';
import Swal from 'sweetalert2';
import './OrdersView.css'; // Keep this for styling

const OrdersView = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/orders/');
        setOrders(res.data);
      } catch {
        Swal.fire('Error', 'Failed to fetch your orders.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/60';
    return img.startsWith('http')
      ? img
      : `http://127.0.0.1:8000${img.startsWith('/') ? '' : '/'}${img}`;
  };

  if (isLoading) {
    return (
      <div className="orders-container text-center" style={{ padding: '2rem' }}>
        <div className="spinner-border" role="status" />
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h3 className="orders-title text-center mb-4">📦 Your Orders</h3>

      {orders.length === 0 ? (
        <div className="alert alert-info text-center">You have no orders yet.</div>
      ) : (
        orders.map(order => (
          <div key={order.id} className="order-card card shadow mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Order #{order.id}</h5>
              {/* Status badge: You may want to handle more statuses */}
              <span className={`badge bg-${order.status.toLowerCase() === 'paid' ? 'success' : 'secondary'}`}>
                {order.status}
              </span>
            </div>
            <div className="card-body">
              <p><strong>Total:</strong> ${parseFloat(order.total_price).toFixed(2)}</p>
              <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>

              <ul className="list-group">
                {order.items.map(item => (
                  <li key={item.id} className="list-group-item d-flex align-items-center">
                    <img
                      src={getImageUrl(item.product_image)}
                      alt={item.product_name}
                      className="order-item-image me-3"
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '5px' }}
                    />
                    <div>
                      <strong>{item.product_name}</strong>
                      <div className="text-muted">Qty: {item.quantity}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrdersView;
