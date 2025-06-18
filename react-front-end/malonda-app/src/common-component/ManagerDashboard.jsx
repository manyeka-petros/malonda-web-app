// src/components/ManagerDashboard.jsx
import React, { useEffect, useState } from 'react';
import api from '../Auth/api';
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import './ManagerDashboard.css';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00c49f'];

const ManagerDashboard = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await api.get('/api/sales/summary/');
        setSalesData(res.data);
      } catch (err) {
        console.error('Failed to fetch sales data', err);
      }
    };
    fetchSales();
  }, []);

  // Prepare weekly chart data (bar)
  const weeklyChartData = salesData.map(product => ({
    name: product.product,
    sales: product.weekly.reduce((a, b) => a + b, 0),
  }));

  // Prepare monthly pie data
  const monthlyChartData = salesData.map(product => ({
    name: product.product,
    value: product.monthly.reduce((a, b) => a + b, 0),
  }));

  return (
    <div className="dashboard-container">
      <h2>📊 Manager Dashboard</h2>

      <div className="chart-section">
        <h4>📈 Daily Sales Trend</h4>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart>
            <XAxis dataKey="index" type="number" />
            <YAxis />
            <CartesianGrid stroke="#ccc" />
            <Tooltip />
            <Legend />
            {salesData.map((product, idx) => (
              <Line
                key={idx}
                dataKey="value"
                name={product.product}
                data={product.daily.map((val, i) => ({ index: i + 1, value: val }))}
                stroke={COLORS[idx % COLORS.length]}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h4>📊 Weekly Sales Summary</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyChartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h4>🧩 Monthly Sales Distribution</h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={monthlyChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {monthlyChartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ManagerDashboard;
