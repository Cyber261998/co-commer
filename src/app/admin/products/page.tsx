'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Mechanical Keyboard",
      price: 129.99,
      description: "RGB backlit mechanical gaming keyboard",
      imageUrl: "https://placehold.co/400x300"
    },
    {
      id: 2,
      name: "Gaming Mouse",
      price: 59.99,
      description: "High DPI gaming mouse with programmable buttons",
      imageUrl: "https://placehold.co/400x300"
    }
  ]);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id ? editingProduct : p
      ));
      setEditingProduct(null);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Products</h1>

      <button 
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => setEditingProduct({
          id: Math.max(...products.map(p => p.id)) + 1,
          name: '',
          price: 0,
          description: '',
          imageUrl: 'https://placehold.co/400x300'
        })}
      >
        Add New Product
      </button>

      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form onSubmit={handleSave} className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct.id ? 'Edit Product' : 'Add New Product'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={e => setEditingProduct({
                    ...editingProduct,
                    name: e.target.value
                  })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Price</label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={e => setEditingProduct({
                    ...editingProduct,
                    price: parseFloat(e.target.value)
                  })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  value={editingProduct.description}
                  onChange={e => setEditingProduct({
                    ...editingProduct,
                    description: e.target.value
                  })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingProduct.imageUrl}
                  onChange={e => setEditingProduct({
                    ...editingProduct,
                    imageUrl: e.target.value
                  })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg p-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div>
                <h3 className="font-bold">{product.name}</h3>
                <p className="text-gray-600">${product.price.toFixed(2)}</p>
              </div>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(product)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 