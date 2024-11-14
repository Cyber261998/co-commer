import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc,
  doc
} from 'firebase/firestore';

interface OrderStatus {
  PENDING: 'pending';
  PROCESSING: 'processing';
  SHIPPED: 'shipped';
  DELIVERED: 'delivered';
  CANCELLED: 'cancelled';
}

export const orderService = {
  async createOrder(orderData) {
    try {
      const order = await addDoc(collection(db, 'orders'), {
        ...orderData,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return order.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async getUserOrders(userId) {
    try {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }
}; 