import React, { useState,useRef } from 'react';
import $ from 'jquery';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import './Formulario.css';
import Header from '../Header/Header';
import Footer from '../Footer/FooterVendedor';
import Scroll  from '../Scroll/Scroll';
import { Toast } from 'primereact/toast';

const AddProductForm = () => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '', // Adicionando quantidade ao estado
    image: null
  });

  const [errors, setErrors] = useState({});
  const toast = useRef(null);

  const show = (mensagem, estado) => {
      toast.current.show({ severity: estado, detail: mensagem });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Limpar mensagem de erro quando o campo for alterado
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.files && event.files.length ? event.files[0] : null;
    console.log('Evento de upload acionado');
    console.log('Arquivo selecionado:', file);
    console.log(file);
    setProductData(prevState => ({
      ...prevState,
      image: file
    }));
    // Limpar mensagem de erro quando uma imagem for anexada
    setErrors(prevErrors => ({
      ...prevErrors,
      image: file ? '' : 'Por favor, selecione uma imagem'
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const newErrors = {};
  
    // Verificar se todos os campos obrigatórios foram preenchidos
    if (!productData.name) {
      newErrors.name = 'Por favor, preencha este campo';
    }
    if (!productData.price) {
      newErrors.price = 'Por favor, preencha este campo';
    }
    if (!productData.quantity) { // Verificar se a quantidade foi preenchida
      newErrors.quantity = 'Por favor, preencha este campo';
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    // Verificar se a imagem foi enviada
    if (productData.image) {
      console.log("Imagem enviada:", productData.image);
    } else {
      console.log("Nenhuma imagem enviada");
    }
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('quantity', productData.quantity); // Adicionar quantidade ao FormData
    formData.append('price', productData.price);
    formData.append('image', productData.image);
    
    $.ajax({
      url: 'http://localhost:5000/adicionar_produto',
      method: 'POST',
      data: formData,
      processData: false, // Não processar os dados automaticamente
      contentType: false, // Não definir o tipo de conteúdo automaticamente
      success: function(data) {
        if (data.success) {
          show("Produto adicionado com sucesso:","success");
          // Limpar os campos após o envio
          setProductData({
            name: '',
            description: '',
            price: '',
            image: null
          });
          // Limpar mensagens de erro após o envio bem-sucedido
          setErrors({});
        } else {
          console.error('Erro ao adicionar produto:', data.message);
          // Lidar com erros do servidor
        }
      },
      error: function(xhr, status, error) {
        console.error('Erro ao fazer a requisição:', error);
        // Lidar com o erro de conexão
      }
    });
    console.log("Formulário enviado com sucesso!");
   
  
}  
  return (
    <>
      <div className='mov'><Header /></div>
      <Toast ref={toast} style={{padding: "20px"}} />

    <div className="form-container" >
        <div className="p-col-8" >
          <div className="card">
            <h2 style={{ textAlign: 'center', marginTop: '18px'}}>Adicionar Novo Produto</h2>
            <form onSubmit={handleSubmit} className="p-fluid">
              <div className="p-field"  style={{ marginBottom: '1rem'}}>
                <label htmlFor="name">Nome do Produto *</label>
                <InputText id="name" name="name" placeholder='Digite o nome' value={productData.name} onChange={handleChange} className="no-border" />
                {errors.name && <small className="p-error">{errors.name}</small>}
              </div>
              <div className="p-field" style={{ marginBottom: '1rem' }}>
                <label htmlFor="description">Descrição do Produto</label>
                <InputText id="description" placeholder='Digite a descrição' name="description" value={productData.description} onChange={handleChange} className="no-border" />
              </div>
              <div className="p-field" style={{ marginBottom: '1rem' }}>
                <label htmlFor="quantity">Quantidade *</label>
                <InputText id="quantity" placeholder='Digite a quantidade' name="quantity" value={productData.quantity} onChange={handleChange} className="no-border" />
                {errors.quantity && <small className="p-error">{errors.quantity}</small>}
              </div>
              <div className="p-field" style={{ marginBottom: '1rem' }}>
                <label htmlFor="price">Preço do Produto *</label>
                <InputText id="price" placeholder='Digite o preço' name="price" value={productData.price} onChange={handleChange} className="no-border" />
                {errors.price && <small className="p-error">{errors.price}</small>}
              </div>
              <div className="p-field" style={{ marginBottom: '1rem' }}>
                <label htmlFor="image">Imagem do Produto *</label>
                <input type='file' url="http://localhost:5000/adicionar_produto" id="image" name="image" accept="image/*" mode="basic" maxFileSize={1000000} customUpload onChange={e => setProductData({...productData, image: e.target.files[0]})} chooseLabel="Carregar Imagem" className="no-border" />
                {productData.image && (
                  <img src={URL.createObjectURL(productData.image)} alt="Product" style={{ marginTop: '10px', maxWidth: '200px' }} />
                )}
                {errors.image && <small className="p-error">{errors.image}</small>}
              </div>
              <div className="p-field">
                <Button type="submit" label="Adicionar Produto" />
              </div>
            </form>
          </div>
        </div> 
      </div>
      <Scroll/>
      <Footer/>
   
    </>
  );
};

export default AddProductForm;
