// PlazaPage.js
import React, { useState } from 'react';
import ProductCard from './ProductCard';
import AddProductForm from './AddProductForm';
import './style.css';

const PlazaPage = () => {
  const [products, setProducts] = useState([]);

  const handleAddProduct = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  return (
    <div className="plaza-page">
      <h2>Bem-vindo à Praça</h2>
      <div className="product-list">
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
      <AddProductForm onSubmit={handleAddProduct} />
    </div>
  );
};

export default PlazaPage;
