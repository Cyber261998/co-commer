import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import VehicleSelector from '../components/VehicleSelector';
import CategoryFilter from '../components/CategoryFilter';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    loadProducts();
  }, [selectedVehicle, selectedCategory]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      let results;
      if (selectedVehicle) {
        const { make, model, year } = selectedVehicle;
        results = await productService.searchByVehicle(make, model, year);
      } else if (selectedCategory) {
        results = await productService.getProductsByCategory(selectedCategory);
      } else {
        results = await productService.getAllProducts();
      }
      setProducts(results);
    } catch (error) {
      console.error('Error loading products:', error);
    }
    setLoading(false);
  };

  return (
    <div className="catalog-page">
      <div className="filters">
        <VehicleSelector onSelect={setSelectedVehicle} />
        <CategoryFilter onSelect={setSelectedCategory} />
      </div>
      
      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Catalog; 