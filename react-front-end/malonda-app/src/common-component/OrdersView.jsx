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
          <p><strong>Order #{order.id}</strong> - {order.status}</p>
          <p>Total: <strong>${order.total_price}</strong></p>
          <p>Date: {new Date(order.created_at).toLocaleString()}</p>
          <ul className="order-items-list">
            {order.items.map(item => (
              <li key={item.id} className="order-item">
                {item.product_image && (
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="order-item-image"
                  />
                )}
                <span>{item.product_name} × {item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default OrdersView;
