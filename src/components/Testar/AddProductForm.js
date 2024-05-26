// AddProductForm.js
import React, { useState } from 'react';

const AddProductForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, image, price });
    setName('');
    setImage('');
    setPrice('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nome do Produto"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Preço"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
            setImage(reader.result);
          };
          reader.readAsDataURL(file);
        }}
        required
      />
      <button type="submit">Adicionar Produto</button>
    </form>
  );
};

export default AddProductForm;
