import { db } from '../config/firebase';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where 
} from 'firebase/firestore';

export const productService = {
  // Get all products
  async getAllProducts() {
    const productsCol = collection(db, 'products');
    const snapshot = await getDocs(productsCol);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Get product by ID
  async getProductById(id) {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  },

  // Get products by category
  async getProductsByCategory(category) {
    const productsCol = collection(db, 'products');
    const q = query(productsCol, where("category", "==", category));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  // Search products by compatibility
  async searchByVehicle(make, model, year) {
    const productsCol = collection(db, 'products');
    const q = query(
      productsCol, 
      where("compatibility", "array-contains", { make, model, year })
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
}; 