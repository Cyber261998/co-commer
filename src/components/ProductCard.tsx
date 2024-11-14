'use client';  // This marks it as a Client Component

import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product);
    
    // Show feedback for 1 second
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <div className="border rounded-lg p-4 shadow-md">
      <div className="relative aspect-video mb-4">
        <Image
          src={product.imageUrl || 'https://placehold.co/400x300'}
          alt={product.name}
          fill
          className="object-cover rounded-md"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <h2 className="text-xl font-semibold">{product.name}</h2>
      <p className="text-gray-600 mt-2">{product.description}</p>
      <p className="text-lg font-bold text-blue-600 mt-2">
        ${product.price.toFixed(2)}
      </p>
      <button 
        onClick={handleAddToCart}
        className={`mt-4 w-full px-4 py-2 rounded transition-colors ${
          isAdding 
            ? 'bg-green-500 hover:bg-green-600' 
            : 'bg-blue-500 hover:bg-blue-600'
        } text-white`}
        disabled={isAdding}
      >
        {isAdding ? '✓ Added!' : 'Add to Cart'}
      </button>
    </div>
  );
} 