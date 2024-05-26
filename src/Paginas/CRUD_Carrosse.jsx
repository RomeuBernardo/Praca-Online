import React, { useState, useEffect,useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import $ from "jquery";
import Header from "../components/Header/MenuAdmin";
import Footer from "../components/Footer/FooterAdmin.jsx";
import Scroll from "../components/Scroll/Scroll.jsx";
import "./Admin.css"; // Importando arquivo de estilos CSS
  import { Toast } from 'primereact/toast';

function Admin() {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    id_adm: "",
    email_Admin: "",
    caminho_imagem: ""
  }); // Estado para armazenar os dados do formulário
  const [totalSlides, setTotalSlides] = useState(0); // Estado para armazenar o total de slides
  const toast = useRef(null);
  
    const show = (mensagem, estado) => {
        toast.current.show({ severity: estado, detail: mensagem });
    };
  useEffect(() => {
    handleListarSlides();
  }, []);

  // Funcao para listar slides
  const handleListarSlides = () => {
    $.ajax({
      url: "http://localhost:5000/ListarSlides",
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.success) {
          const slides = response.slides;
          setData(slides);
          setTotalSlides(slides.length); // Atualizar o total de slides
        } else {
          console.error("Nenhum slide encontrado");
        }
      },
      error: function (xhr, status, error) {
        console.error("Erro ao listar slides:", error);
      },
    });
  };

  // Funcao para editar slides
  const handleEditarSlide = () => {
    $.ajax({
      url: "http://localhost:5000/editarSlide",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(formData), // Enviar os dados do formulário
      dataType: "json",
      success: function (response) {
        if (response.success) {
          show("Slide editado com sucesso!","success");
          handleListarSlides(); // Atualizar a lista de slides após a edição
          onHide(); // Fechar o diálogo de edição
        } else {
          console.error("Erro ao editar slide:", response.message);
        }
      },
      error: function (xhr, status, error) {
        console.error("Erro ao editar slide:", error);
      },
    });
  };

  // Funcao para remover slides
  const handleRemoverSlide = (id_Slide) => {
    $.ajax({
      url: "http://localhost:5000/removerSlide",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ id_Slide: id_Slide }),
      dataType: "json",
      success: function (response) {
        if (response.success) {
          show("Slide removido com sucesso!","success");
          handleListarSlides(); // Atualizar a lista de slides após a remoção
        } else {
          console.error("Erro ao remover slide:", response.message);
        }
      },
      error: function (xhr, status, error) {
        console.error("Erro ao remover slide:", error);
      },
    });
  };

  const handleEditar = (slide) => {
    setSelectedItem(slide);
    setFormData({
      ...slide,
      id_adm: slide.id_adm || "",
      email_Admin: slide.email_Admin || ""
    }); // Preencher o formulário com os dados do slide selecionado
    setVisible(true);
  };

  const onHide = () => {
    setSelectedItem(null);
    setFormData({}); // Limpar os dados do formulário ao fechar o diálogo
    setVisible(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "id_adm" || name === "email_Admin") {
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value
      }));
    }
  };

  return (
    <>
      <Toast ref={toast} style={{padding: "20px"}} />

      <div className="container">
        <h1>Lista de Slides</h1>

        <table className="p-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Caminho da Imagem</th>
              <th>E-mail do Administrador</th>
              <th>Data</th>
              <th>Opções</th>
            </tr>
          </thead>
          <tbody>
            {data.map((slide, index) => (
              <tr key={slide.id_Slide}>
                <td>{slide.id_Slide}</td>
                <td>{slide.caminho_imagem}</td>
                <td>{slide.email_Admin}</td>
                <td>{slide.data}</td>

                <td>
                  <div className="button-group">
                    <Button
                      label="Editar"
                      onClick={() => handleEditar(slide)}
                      icon="pi pi-pencil"
                      className="p-button-sm p-button-warning"
                    />
                    <Button
                      label="Remover"
                      onClick={() => handleRemoverSlide(slide.id_Slide)}
                      icon="pi pi-trash"
                      className="p-button-sm p-button-danger"
                    />
                  </div>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="3"></td>
              <td>Total de Slides: {totalSlides}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Dialog
        header={<strong>Editar Slide</strong>}
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
            <label htmlFor="caminho_imagem">
              <strong>Caminho da Imagem</strong>
            </label>
            <br />
            <input
              id="caminho_imagem"
              type="text"
              name="caminho_imagem"
              value={formData.caminho_imagem || ""}
              onChange={handleChange}
              className="p-inputtext"
            />
          </div>
          
         
          <Button
            label="Salvar"
            onClick={handleEditarSlide}
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
