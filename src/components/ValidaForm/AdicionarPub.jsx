import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import './Formulario.css';
import Header from '../Header/MenuAdmin';
import Scroll from '../Scroll/Scroll';
import $ from 'jquery';
import { Toast } from 'primereact/toast';

const AddPublicationForm = () => {
  const [publicationData, setPublicationData] = useState({
    titulo: '', // Alterado para 'titulo'
    texto: ''   // Alterado para 'texto'
  });
  const toast = useRef(null);

  const show = (mensagem, estado) => {
      toast.current.show({ severity: estado, detail: mensagem });
  };

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPublicationData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Limpar mensagem de erro quando o campo for alterado
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
// Verificar se o título excede 20 caracteres
if (publicationData.titulo && publicationData.titulo.length > 20) {
    newErrors.titulo = 'O título deve ter 20 caracteres ou menos';
}

// Verificar se o texto excede 160 caracteres
if (publicationData.texto && publicationData.texto.length > 300) {
    newErrors.texto = 'O texto deve ter 160 caracteres ou menos';
}

    // Verificar se todos os campos obrigatórios foram preenchidos
    if (!publicationData.titulo) { // Alterado para 'titulo'
      newErrors.titulo = 'Por favor, preencha este campo';
    }
    if (!publicationData.texto) { // Alterado para 'texto'
      newErrors.texto = 'Por favor, preencha este campo';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Enviar a requisição AJAX
    $.ajax({
      url: 'http://localhost:5000/AddPublicacao',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(publicationData),
      success: function(response) {
        if (response.success) {

          show("Publicação adicionada com sucesso!","success");
                 // Redirecione para a página de login ou qualquer outra página desejada
                 setTimeout(() => {
                  // Redirecione para a página de login ou qualquer outra página desejada
                }, 3000); 
          // Limpar os campos do formulário após o envio bem-sucedido
          setPublicationData({
            titulo: '', // Alterado para 'titulo'
            texto: ''   // Alterado para 'texto'
          });
        } else {
          console.log("AAAAAAAAAAAAA");
          show(response.message,"error");
        }
      },
      error: function(xhr, status, error) {
        console.error('Erro ao enviar requisição:', error);
        show("Erro ao adicionar publicação. Por favor, tente novamente.","error");
      }
    });
  };

  return (
    <>
          <Toast ref={toast} style={{padding: "20px"}} />

      <div className="form-container">
      <h1 style={{textAlign:'center', color:'#415aca'}}>Adicionar Publicação</h1>

        <div className="p-col-8">
          <div className="card" style={{marginBottom:'450px'}}>
            <h2 style={{ textAlign: 'center', marginTop: '18px' }}>Adicionar Nova Publicação</h2>
            <form onSubmit={handleSubmit} className="p-fluid">
              <div className="p-field" style={{ marginBottom: '1rem' }}>
                <label htmlFor="titulo">Título *</label>
                <InputText id="titulo" name="titulo" placeholder='Digite o título' value={publicationData.titulo} onChange={handleChange} className="no-border" />
                {errors.titulo && <small className="p-error">{errors.titulo}</small>}
              </div>
              <div className="p-field" style={{ marginBottom: '1rem' }}>
                <label htmlFor="texto">Publicação *</label>
                <InputText id="texto" placeholder='Digite a publicação' name="texto" value={publicationData.texto} onChange={handleChange} className="no-border" />
                {errors.texto && <small className="p-error">{errors.texto}</small>}
              </div>
              <div className="p-field">
                <Button type="submit" label="Publicar" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPublicationForm;
