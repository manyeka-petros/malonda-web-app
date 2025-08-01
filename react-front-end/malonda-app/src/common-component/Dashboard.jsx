import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Auth/api';
import {
  FiShoppingBag,
  FiUsers,
  FiDollarSign,
  FiPackage,
} from 'react-icons/fi';
import { Line, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './Dashboard.css';

Chart.register(...registerables);

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
  });

  const [salesChart, setSalesChart] = useState({ labels: [], data: [] });
  const [revenueByCategory, setRevenueByCategory] = useState({ labels: [], data: [] });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get('/manager-dashboard/');
        const data = response.data;

        setStats({
          totalSales: data.totalSales,
          totalOrders: data.totalOrders,
          totalProducts: data.totalProducts,
          totalCustomers: data.totalCustomers,
        });

        setSalesChart(data.salesChart);
        setRevenueByCategory(data.revenueByCategory);
        setRecentOrders(data.recentOrders);
        setTopProducts(data.topProducts);
      } catch (err) {
        console.error('Dashboard error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const salesData = {
    labels: salesChart.labels,
    datasets: [{
      label: 'Sales (Last 6 months)',
      data: salesChart.data,
      backgroundColor: 'rgba(108, 92, 231, 0.2)',
      borderColor: 'rgba(108, 92, 231, 1)',
      borderWidth: 2,
      tension: 0.4,
    }],
  };

  const revenueData = {
    labels: revenueByCategory.labels,
    datasets: [{
      label: 'Revenue by Category',
      data: revenueByCategory.data,
      backgroundColor: [
        'rgba(108, 92, 231, 0.7)',
        'rgba(253, 121, 168, 0.7)',
        'rgba(85, 239, 196, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
      ],
      borderWidth: 1,
    }],
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="main-content full-width">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="user-profile">
          <span>Manager</span>
          <div className="avatar">M</div>
        </div>
      </header>

      {/* Stats */}
      <div className="dashboard-overview">
        <div className="stats-grid">
          <StatCard icon={<FiDollarSign size={24} />} title="Total Sales" value={`$${stats.totalSales.toLocaleString()}`} change="+12.5%" isPositive />
          <StatCard icon={<FiShoppingBag size={24} />} title="Total Orders" value={stats.totalOrders} change="+8.3%" isPositive />
          <StatCard icon={<FiPackage size={24} />} title="Total Products" value={stats.totalProducts} change="+5.2%" isPositive />
          <StatCard icon={<FiUsers size={24} />} title="Total Customers" value={stats.totalCustomers} change="+15.7%" isPositive />
        </div>

        {/* Charts */}
        <div className="charts-row">
          <div className="chart-card">
            <h3>Sales Overview</h3>
            <Line data={salesData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
          </div>
          <div className="chart-card">
            <h3>Revenue by Category</h3>
            <Pie data={revenueData} options={{ responsive: true, plugins: { legend: { position: 'right' } } }} />
          </div>
        </div>

        {/* Recent Orders */}
        <div className="recent-orders">
          <h3>Recent Orders</h3>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>${(Number(order.amount) || 0).toFixed(2)}</td>
                  <td><span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span></td>
                  <td>
                    <button className="view-btn" onClick={() => navigate(`/orders/${order.id}`)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top Products */}
        <div className="top-products">
          <h3>Top Selling Products</h3>
          <div className="products-list">
            {topProducts.map((product, index) => (
              <div key={index} className="product-item">
                <div className="product-info">
                  <span className="rank">{index + 1}</span>
                  <span className="name">{product.name}</span>
                </div>
                <div className="product-stats">
                  <span className="sales">{product.sales} sold</span>
                  <span className="revenue">${(Number(product.revenue) || 0).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, change, isPositive }) => (
  <div className="stat-card">
    <div className="stat-icon">{icon}</div>
    <div className="stat-info">
      <h4>{title}</h4>
      <p className="stat-value">{value}</p>
      <p className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
        {change} {isPositive ? '↑' : '↓'}
      </p>
    </div>
  </div>
);

export default Dashboard;
