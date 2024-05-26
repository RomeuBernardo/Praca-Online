import React, { useState, useEffect,useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import $ from "jquery";
import Header from "../components/Header/MenuAdmin";
import "./Admin.css"; // Importando arquivo de estilos CSS
  import { Toast } from 'primereact/toast';

function Admin() {
  const [publicacoes, setPublicacoes] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const [totalPublicacoes, setTotalPublicacoes] = useState(0);
  const toast = useRef(null);
  
    const show = (mensagem, estado) => {
        toast.current.show({ severity: estado, detail: mensagem });
    };
  useEffect(() => {
    listarPublicacoes();
  }, []);

  const listarPublicacoes = () => {
    $.ajax({
      url: "http://localhost:5000/listarPublicacoes",
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.success) {
          const publicacoes = response.publicacoes;
          setPublicacoes(publicacoes);
          setTotalPublicacoes(publicacoes.length);
        } else {
          console.error("Nenhuma publicação encontrada");
        }
      },
      error: function (xhr, status, error) {
        console.error("Erro ao listar publicações:", error);
      },
    });
  };

  const handleEditarPublicacao = () => {
    $.ajax({
      url: "http://localhost:5000/editarPublicacao",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(formData),
      dataType: "json",
      success: function (response) {
        if (response.success) {
          show("Publicação editada com sucesso!","success");
          listarPublicacoes();
          onHide();
        } else {
          console.error("Erro ao editar publicação:", response.message);
        }
      },
      error: function (xhr, status, error) {
        console.error("Erro ao editar publicação:", error);
      },
    });
  };

  const handleRemoverPublicacao = (id_Publicacao) => {
    $.ajax({
      url: "http://localhost:5000/removerPublicacao",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ id_Publicacao: id_Publicacao }),
      dataType: "json",
      success: function (response) {
        if (response.success) {
          show("Publicação removida com sucesso!","success");
          listarPublicacoes();
        } else {
          console.error("Erro ao remover publicação:", response.message);
        }
      },
      error: function (xhr, status, error) {
        console.error("Erro ao remover publicação:", error);
      },
    });
  };

  const handleEditar = (publicacao) => {
    setSelectedItem(publicacao);
    setFormData(publicacao);
    setVisible(true);
  };

  const onHide = () => {
    setSelectedItem(null);
    setFormData({});
    setVisible(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
          <Toast ref={toast} style={{padding: "20px"}} />

      <div className="container">
        <h1>Lista de Publicações</h1>
        <table className="p-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Texto</th>
              <th>ID do Administrador</th>
              <th>Email do Administrador</th>
              <th>Data</th>

              <th>Opções</th>
            </tr>
          </thead>
          <tbody>
            {publicacoes.map((publicacao, index) => (
              <tr key={publicacao.id_Publicacao}>
                <td>{publicacao.id_Publicacao}</td>
                <td>{publicacao.titulo}</td>
                <td>{publicacao.texto}</td>
                <td>{publicacao.id_adm}</td>
                <td>{publicacao.email_Admin}</td>
                <td>{publicacao.data}</td>
                <td>
                  <div className="button-group">
                    <Button
                      label="Editar"
                      onClick={() => handleEditar(publicacao)}
                      icon="pi pi-pencil"
                      className="p-button-sm p-button-warning"
                    />
                    <Button
                      label="Remover"
                      onClick={() =>
                        handleRemoverPublicacao(publicacao.id_Publicacao)
                      }
                      icon="pi pi-trash"
                      className="p-button-sm p-button-danger"
                    />
                  </div>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="5"></td>
              <td>Total de Publicações: {totalPublicacoes}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Dialog
        header={<strong>Editar Publicação</strong>}
        visible={visible}
        style={{
          width: "50vw",
          backgroundColor: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onHide={onHide}
        className="edit-dialog"
      >
        <div className="edit-form">
          <div className="p-field">
            <label htmlFor="titulo">
              <strong>Título</strong>
            </label>
            <br />
            <input
              id="titulo"
              type="text"
              name="titulo"
              value={formData.titulo || ""}
              onChange={handleChange}
              className="p-inputtext"
            />
          </div>
          <div className="p-field">
            <label htmlFor="texto">
              <strong>Texto</strong>
            </label>
            <br />
            <input
              id="texto"
              type="text"
              name="texto"
              value={formData.texto || ""}
              onChange={handleChange}
              className="p-inputtext"
              
            />
          </div>
          
         
          <Button
            label="Salvar"
            onClick={handleEditarPublicacao}
            className="p-button-success"
          />
          <Button
            label="Cancelar"
            onClick={onHide}
            className="p-button-secondary"
          />
        </div>
      </Dialog>
    </>
  );
}

export default Admin;
