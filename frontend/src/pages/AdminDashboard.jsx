import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load recent orders
      const ordersQuery = query(
        collection(db, 'orders'),
        where('status', '==', 'pending')
      );
      const ordersSnapshot = await getDocs(ordersQuery);
      setOrders(ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));

      // Load low stock products
      const productsQuery = query(
        collection(db, 'products'),
        where('stockQuantity', '<', 10)
      );
      const productsSnapshot = await getDocs(productsQuery);
      setProducts(productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));

      // Calculate statistics
      calculateStats(ordersSnapshot.docs);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const calculateStats = (orders) => {
    const totalSales = orders.reduce((sum, order) => 
      sum + order.data().total, 0
    );
    
    setStats({
      totalSales,
      totalOrders: orders.length,
      averageOrderValue: orders.length ? totalSales / orders.length : 0
    });
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Sales</h3>
          <p>${stats.totalSales.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Average Order Value</h3>
          <p>${stats.averageOrderValue.toFixed(2)}</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="pending-orders">
          <h2>Pending Orders</h2>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customerName}</td>
                  <td>${order.total}</td>
                  <td>{order.status}</td>
                  <td>
                    <button>Process</button>
                    <button>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="low-stock">
          <h2>Low Stock Products</h2>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.stockQuantity}</td>
                  <td>
                    <button>Restock</button>
                    <button>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 