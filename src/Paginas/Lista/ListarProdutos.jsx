import React, { useState } from 'react';

// Componente de um item de produto
const ProductItem = ({ product, onRemove, onSelect }) => {
  return (
    <div className="product-item">
      <input type="checkbox" checked={product.selected} onChange={() => onSelect(product.id)} />
      <div className="product-info">
        <div className="product-name">Nome do Produto: {product.name}</div>
        <div className="vendor-name">Nome do Vendedor: {product.vendorName}</div>
      </div>
      <button className="remove-button" onClick={() => onRemove(product.id)}>Remover</button>
    </div>
  );
};

// Componente de lista de produtos
const ProductList = ({ products, onRemove, onSelectAll, onSelect }) => {
  return (
    <div className="product-list">
      <h2>Lista de Produtos</h2>
      <div className="select-all">
        <input type="checkbox" onChange={onSelectAll} /> Marcar todos
      </div>
      {products.map(product => (
        <ProductItem key={product.id} product={product} onRemove={onRemove} onSelect={onSelect} />
      ))}
    </div>
  );
};

// Página de lista de produtos
const ProductsPage = () => {
  const [products, setProducts] = useState([
    { id: 1, vendorName: 'Vendedor 1', name: 'Produto A', selected: false },
    { id: 2, vendorName: 'Vendedor 2', name: 'Produto B', selected: false },
    { id: 3, vendorName: 'Vendedor 1', name: 'Produto C', selected: false },
    { id: 4, vendorName: 'Vendedor 3', name: 'Produto D', selected: false },
    { id: 5, vendorName: 'Vendedor 2', name: 'Produto E', selected: false },
    { id: 6, vendorName: 'Vendedor 1', name: 'Produto F', selected: false },
    { id: 7, vendorName: 'Vendedor 1', name: 'Produto G', selected: false },
  ]);

  // Função para remover um produto
  const handleRemoveProduct = (productId) => {
    setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
  };

  // Função para selecionar ou deselecionar um produto individualmente
  const handleSelectProduct = (productId) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId ? { ...product, selected: !product.selected } : product
      )
    );
  };

  // Função para marcar ou desmarcar todos os produtos
  const handleSelectAllProducts = () => {
    const allSelected = products.every(product => product.selected);
    setProducts(prevProducts =>
      prevProducts.map(product => ({ ...product, selected: !allSelected }))
    );
  };

  return (
    <div className="products-page">
      <h1>Página de Produtos</h1>
      <ProductList
        products={products}
        onRemove={handleRemoveProduct}
        onSelectAll={handleSelectAllProducts}
        onSelect={handleSelectProduct}
      />
    </div>
  );
};

export default ProductsPage;
