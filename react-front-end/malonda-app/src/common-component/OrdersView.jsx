import { useEffect, useState } from 'react';
import api from '../Auth/api';
import Swal from 'sweetalert2';
import './OrdersView.css';

const OrdersView = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/')
      .then(res => setOrders(res.data))
      .catch(() => Swal.fire('Error', 'Failed to fetch orders', 'error'));
  }, []);

  return (
    <div className="orders-container">
      <h3>📦 Your Orders</h3>
      {orders.map(order => (
        <div key={order.id} className="order-card">
          <p>Order #{order.id} - {order.status}</p>
          <p>Total: ${order.total_price}</p>
          <p>Date: {new Date(order.created_at).toLocaleString()}</p>
          <ul>
            {order.items.map(item => (
              <li key={item.id}>{item.product_name} x {item.quantity}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default OrdersView;