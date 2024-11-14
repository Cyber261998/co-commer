import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.images[0]} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="part-number">Part #: {product.partNumber}</p>
      <p className="price">${product.price}</p>
      <div className="compatibility">
        Fits: {product.compatibility.map(car => 
          `${car.make} ${car.model} ${car.year}`
        ).join(', ')}
      </div>
      <button className="add-to-cart">Add to Cart</button>
    </div>
  );
};

export default ProductCard; 