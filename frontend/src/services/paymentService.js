import { loadStripe } from '@stripe/stripe-js';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

const stripePromise = loadStripe('your_publishable_key');

export const paymentService = {
  async createCheckoutSession(cart, userId) {
    try {
      const checkoutSession = await addDoc(collection(db, 'checkout_sessions'), {
        userId,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        status: 'pending'
      });

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSession.id
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    }
  }
}; 