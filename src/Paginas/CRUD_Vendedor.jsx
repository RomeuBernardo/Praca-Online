import React, { useState, useEffect,useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import $ from "jquery";
import "./Admin.css"; // Importando arquivo de estilos CSS
import Header from "../components/Header/MenuAdmin";
import Footer from '../components/Footer/FooterAdmin.jsx';
import Scroll from '../components/Scroll/Scroll.jsx';
import { Toast } from 'primereact/toast';

function Admin() {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({}); // Estado para armazenar os dados do formulário
  const [totalVendedores, setTotalVendedores] = useState(0); // Estado para armazenar o total de vendedores
  const toast = useRef(null);
  
    const show = (mensagem, estado) => {
        toast.current.show({ severity: estado, detail: mensagem });
    };
  useEffect(() => {
    handleListarVendedores();
  }, []);

  //Funcao para listar vendedores
  const handleListarVendedores = () => {
    $.ajax({
      url: "http://localhost:5000/ListarVendedores",
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.success) {
          const vendedores = response.vendedores;
          setData(vendedores);
          setTotalVendedores(vendedores.length); // Atualizar o total de vendedores
        } else {
          console.error("Nenhum vendedor encontrado");
        }
      },
      error: function (xhr, status, error) {
        console.error("Erro ao listar vendedores:", error);
      },
    });
  };

  //Funcao para remover vendedores
  const handleEliminar = (id_Vendedor) => {
    $.ajax({
      url: "http://localhost:5000/removerVendedor",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ id_Vendedor: id_Vendedor }),
      dataType: "json",
      success: function (response) {
        show("Vendedor Removido com sucesso","success");
        handleListarVendedores();
      },
      error: function (xhr, status, error) {
        console.error("Erro ao eliminar registro:", error);
      },
    });
  };

  //Funcao para Editar vendedores
  // Função para enviar os dados do formulário para edição do vendedor
  const handleEditarVendedor = () => {
    $.ajax({
      url: "http://localhost:5000/editarVendedor",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(formData), // Enviar os dados do formulário
      dataType: "json",
      success: function (response) {
        if (response.success) {
          show("Vendedor editado com sucesso!","success");
          handleListarVendedores(); // Atualizar a lista de vendedores após a edição
          onHide(); // Fechar o diálogo de edição
        } else {
          console.error("Erro ao editar vendedor:", response.message);
        }
      },
      error: function (xhr, status, error) {
        console.error("Erro ao editar vendedor:", error);
      },
    });
  };

  // Função para desabilitar vendedores
  const handleDesabilitar = (item) => {
    // Implemente a lógica para desabilitar o vendedor aqui
    console.log("Vendedor desabilitado:", item);
  };

  const handleEditar = (item) => {
    setSelectedItem(item);
    setFormData(item); // Preencher o formulário com os dados do item selecionado
    setVisible(true);
  };

  const onHide = () => {
    setSelectedItem(null);
    setFormData({}); // Limpar os dados do formulário ao fechar o diálogo
    setVisible(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Atualizar os dados do formulário conforme o usuário insere os valores
  };

  const handleSubmit = () => {
    // Aqui você pode enviar os dados do formulário para o servidor para salvar as alterações
    console.log("Dados do formulário:", formData);
    onHide(); // Fechar o diálogo após o envio do formulário
  };

  return (
    <>
      <Toast ref={toast} style={{padding: "20px"}} />

      <div className="container">
      <h1>Listas de Vendedores</h1>

        <table className="p-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>BI</th>
              <th>Tipo de Produto</th>
              <th>Endereço</th>
              <th>Senha</th>
              <th>Data</th>
              <th>Opções</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id_Vendedor}>
                <td>{item.id_Vendedor}</td>
                <td>{item.nome}</td>
                <td>{item.email}</td>
                <td>{item.telefone}</td>
                <td>{item.BI}</td>
                <td>{item.tipo_de_Produto}</td>
                <td >{item.endereco}</td>
                <td style={{ wordBreak: 'break-all' }}>{item.senha}</td>
                <td >{item.data}</td>
                <td>
                  <div className="button-group">
                    <Button
                      label="Remover"
                      onClick={() => handleEliminar(item.id_Vendedor)}
                      icon="pi pi-trash"
                      className="p-button-sm p-button-danger"
                    />
                    <Button
                      label="Editar"
                      onClick={() => handleEditar(item)}
                      icon="pi pi-pencil"
                      className="p-button-sm p-button-warning"
                    />
                   
                  </div>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="9"></td>
              <td>Total de Vendedores: {totalVendedores}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Dialog
        header={<strong>Editar Vendedores</strong>}
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
            <label htmlFor="nome">
              <strong>Nome</strong>
            </label>
            <br />
            <input
              id="nome"
              type="text"
              name="nome"
              value={formData.nome || ""}
              onChange={handleChange}
              className="p-inputtext"
              style={{ border: "0px !important" }}
            />
          </div>
          <div className="p-field">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <br />
            <input
              id="email"
              type="text"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="p-inputtext"
            />
          </div>
          <div className="p-field">
            <label htmlFor="senha">
              <strong>Senha</strong>
            </label>
            <br />
            <input
              id="senha"
              type="password"
              name="senha"
              value={formData.senha || ""}
              onChange={handleChange}
              className="p-inputtext"
            />
          </div>
          <div className="p-field">
            <label htmlFor="confirmarSenha">
              <strong>Confirmar Senha</strong>
            </label>
            <br />
            <input
              id="confirmarSenha"
              type="password"
              name="confirmarSenha"
              value={formData.confirmarSenha || ""}
              onChange={handleChange}
              className="p-inputtext"
            />
          </div>
          <div className="p-field">
            <label htmlFor="telefone">
              <strong>Telefone</strong>
            </label>
            <br />
            <input
              id="telefone"
              type="text"
              name="telefone"
              value={formData.telefone || ""}
              onChange={handleChange}
              className="p-inputtext"
            />
          </div>
          <div className="p-field">
            <label htmlFor="BI">
              <strong>BI</strong>
            </label>
            <br />
            <input
              id="BI"
              type="text"
              name="BI"
              value={formData.BI || ""}
              onChange={handleChange}
              className="p-inputtext"
            />
          </div>
          <div className="p-field">
            <label htmlFor="tipo_de_Produto">
              <strong>Tipo de Produto</strong>
            </label>
            <br />
            <input
              id="tipo_de_Produto"
              type="text"
              name="tipo_de_Produto"
              value={formData.tipo_de_Produto || ""}
              onChange={handleChange}
              className="p-inputtext"
            />
          </div>
          <div className="p-field">
            <label htmlFor="endereco">
              <strong>Endereço</strong>
            </label>
            <br />
            <input
              id="endereco"
              type="text"
              name="endereco"
              value={formData.endereco || ""}
              onChange={handleChange}
              className="p-inputtext"
            />
          </div>
          <Button
            label="Salvar"
            onClick={handleEditarVendedor}
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
