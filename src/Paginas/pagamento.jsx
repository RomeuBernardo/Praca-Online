import React, { useState,useRef } from 'react';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import '../components/ValidaForm/Formulario.css';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/FooterVendedor';
import Scroll from '../components/Scroll/Scroll';
import axios from 'axios';
import { Toast } from 'primereact/toast';

const AddProductForm = () => {
  const [file, setFile] = useState(null);
  const toast = useRef(null);
  
    const show = (mensagem, estado) => {
        toast.current.show({ severity: estado, detail: mensagem });
    };
  const handleFileUpload = (event) => {
    const selectedFile = event.files && event.files.length ? event.files[0] : null;
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!file) {
        show('Nenhum arquivo selecionado',"error");
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://localhost:5000/pagamento', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        show("Pagamento efetuado com sucesso:'", "success");
        setTimeout(() => {
          // Redirecione para a página de login ou qualquer outra página desejada
      }, 3000); // 2000 milissegundos = 2 segundos   
        setFile(null);
      } else {
        console.error('Erro ao efetuar pagamento:', response.data.message);
      }
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error);
    }
  };

  return (
    <>
    
<div className="mov"><Header/></div>
<Toast ref={toast} style={{padding: "20px"}} />

      <div className="form-container">
        <div className="p-col-8">
          <div className="card">
            <h2 style={{ textAlign: 'center', marginTop: '18px' }}>Adicionar Novo Arquivo</h2>
            <form onSubmit={handleSubmit} className="p-fluid">
              <div className="p-field" style={{ marginBottom: '1rem' }}>
                <label htmlFor="file">Selecione um Arquivo *</label>
                <FileUpload
                  mode="basic"
                  maxFileSize={1000000}
                  customUpload
                  onSelect={handleFileUpload}
                  chooseLabel="Selecionar Arquivo"
                  className="no-border"
                />
                {file && (
                  <div style={{ marginTop: '10px' }}>
                    <strong>Arquivo Selecionado:</strong> {file.name}
                  </div>
                )}
              </div>
              <div className="p-field">
                <Button type="submit" label="Enviar Pagamento" />
              </div>
            </form>
          </div>
        </div>
      </div>
      <Scroll />
      <Footer />
    </>
  );
};

export default AddProductForm;
