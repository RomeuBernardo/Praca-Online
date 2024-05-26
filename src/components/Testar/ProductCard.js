// ProductCard.js
import React from 'react';

const ProductCard = ({ name, image, price }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={image} alt={name} />
      </div>
      <div className="product-details">
        <h3>{name}</h3>
        <p>
          <span className="price-label">Preço:</span>
          <span className="price-value">{price}</span>
        </p>
        <button>Adicionar ao Carrinho</button>
      </div>
    </div>
  );
};

export default ProductCard;
