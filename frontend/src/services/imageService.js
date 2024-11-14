import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';

export const imageService = {
  async optimizeImage(file) {
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      };
      
      return await imageCompression(file, options);
    } catch (error) {
      console.error('Error optimizing image:', error);
      throw error;
    }
  },

  async uploadProductImage(file, productId) {
    try {
      const optimizedFile = await this.optimizeImage(file);
      const storageRef = ref(storage, `products/${productId}/${file.name}`);
      await uploadBytes(storageRef, optimizedFile);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  async uploadMultipleProductImages(files, productId) {
    try {
      const uploadPromises = files.map(file => 
        this.uploadProductImage(file, productId)
      );
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw error;
    }
  }
}; 