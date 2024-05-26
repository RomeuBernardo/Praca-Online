import React, { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import './Formulario.css';
import Header from '../Header/MenuAdmin';
import Footer from '../Footer/FooterVendedor';
import Scroll from '../Scroll/Scroll';
import axios from 'axios'; // Importando axios para fazer requisições HTTP
import { Toast } from 'primereact/toast';

const AddProductForm = () => {
  const [image, setImage] = useState(null); // Armazenar a imagem selecionada
  const toast = useRef(null);

  const show = (mensagem, estado) => {
      toast.current.show({ severity: estado, detail: mensagem });
  };

  const handleFileUpload = (event) => {
    const file = event.files && event.files.length ? event.files[0] : null;
    console.log('Evento de upload acionado');
    console.log('Arquivo selecionado:', file);
    console.log(file);
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!image) {
        show("Nenhuma imagem selecionada","error");
        return;
      }

      const formData = new FormData();
      formData.append('image', image);

      const response = await axios.post('http://localhost:5000/adicionar_imagem_slide', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        show("Imagem adicionada com sucesso","success");
        // Limpar a seleção da imagem após o envio bem-sucedido
        // Redirecione para a página de login ou qualquer outra página desejada
        setTimeout(() => {
         // Redirecione para a página de login ou qualquer outra página desejada
       }, 3000); 
        setImage(null);
      } else {
        show(response.data.message,"error");
        // Lidar com erros do servidor
      }
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error);
      // Lidar com o erro de conexão
    }
  };

  return (
    <>
      <Toast ref={toast} style={{padding: "20px"}} />

      <div className="form-container">
      <h1 style={{textAlign:'center', color:'#415aca',marginBottom:'200px'}}>Adicionar Slide</h1>

        <div className="p-col-8" >
          <div className="card" style={{marginBottom:'450px'}}>
            <h2 style={{ textAlign: 'center', marginTop: '18px' }}>Adicionar Nova Imagem</h2>
            <form onSubmit={handleSubmit} className="p-fluid">
              <div className="p-field" style={{ marginBottom: '1rem' }}>
                <label htmlFor="image">Imagem do Slide *</label>

                <FileUpload
                  mode="basic"
                  maxFileSize={1000000}
                  accept="image/*"
                  customUpload
                  onSelect={handleFileUpload}
                  chooseLabel="Selecionar Imagem"
                  className="no-border"
                />
                {image && (
                  <img src={URL.createObjectURL(image)} alt="Slide" style={{ marginTop: '10px', maxWidth: '200px' }} />
                )}
              </div>
              <div className="p-field">
                <Button type="submit" label="Adicionar Imagem" />
              </div>
            </form>
          </div>
        </div>
      </div>

    </>
  );
};

export default AddProductForm;
