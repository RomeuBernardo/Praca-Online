import React, { useState, useEffect,useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Card } from "primereact/card";
import $ from "jquery";
import Header from "../components/Header/MenuAdmin";
import Footer from '../components/Footer/FooterAdmin.jsx';
import Scroll from '../components/Scroll/Scroll.jsx';
import "./Admin.css"; // Importando arquivo de estilos CSS
  import { Toast } from 'primereact/toast';

function Admin() {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({}); // Estado para armazenar os dados do formulário
  const [totalAdmin, setTotalAdmin] = useState(0); // Estado para armazenar o total de clientes
  const toast = useRef(null);
  
    const show = (mensagem, estado) => {
        toast.current.show({ severity: estado, detail: mensagem });
    };
  useEffect(() => {
    handleListarAdmim();
  }, []);

  //Funcao para listar clientes
  const handleListarAdmim = () => {
    $.ajax({
      url: "http://localhost:5000/ListarAdministrador",
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.success) {
          const administradores = response.Administrador;
          setData(administradores);
          setTotalAdmin(administradores.length); // Atualizar o total de administradores
        } else {
          console.error("Nenhum Admin encontrado");
        }
      },
      error: function (xhr, status, error) {
        console.error("Erro ao listar Admin:", error);
      },
    });
  };

  //Funcao para remover clientes
  const handleEliminar = (id_adm) => {
    $.ajax({
      url: "http://localhost:5000/removerAdministrador",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ id_adm: id_adm }),
      dataType: "json",
      success: function (response) {
      show("Admim Removido com sucesso!","success");
        handleListarAdmim();
      },
      error: function (xhr, status, error) {
        console.error("Erro ao eliminar registro:", error);
      },
    });
  };

  //Funcao para Editar Admin
  const handleEditarAdmin = () => {
    $.ajax({
      url: "http://localhost:5000/editarAdministrador",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(formData), // Enviar os dados do formulário
      dataType: "json",
      success: function (response) {
        if (response.success) {
          show("Administrador  editado com sucesso!","success");
          handleListarAdmim(); // Atualizar a lista de Admin após a edição
          onHide(); // Fechar o diálogo de edição
        } else {
          console.error("Erro ao editar Administrador:", response.message);
        }
      },
      error: function (xhr, status, error) {
        console.error("Erro ao editar Administrador:", error);
      },
    });
  };

  const handleDesabilitar = (item) => {
    // Implemente a lógica para desabilitar o Admin aqui
    console.log("Admin desabilitado:", item);
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

  return (
    <>
          <Toast ref={toast} style={{padding: "20px"}} />

    <div className="Table">

      <div className="container">
      <h1>Lista  de Administrador</h1>
        <table className="p-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Senha</th>
              <th>Confirmar Senha</th>
              <th>Endereço</th>
              <th>Data</th>
              <th>Opções</th>
            </tr>
          </thead>
          <tbody>
            {data && data.map((item, index) => (
              <tr key={item.id_adm}>
                <td>{item.id_adm}</td>
                <td>{item.nome}</td>
                <td>{item.email}</td>
                <td style={{ wordBreak: 'break-all' }}>{item.senha}</td>
                <td style={{ wordBreak: 'break-all' }}>{item.confirmarSenha}</td>
                <td>{item.endereco}</td>
                <td>{item.data}</td>
                <td>
                  <div className="button-group">
                    <Button
                      label="Remover"
                      onClick={() => handleEliminar(item.id_adm)}
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
              <td colSpan="6"></td>
              <td>Total de Administradores: {totalAdmin}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Dialog
  header={<strong>Editar Administrador</strong>}
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
    {/* Adicione outros campos conforme necessário */}
    <Button
      label="Salvar"
      onClick={handleEditarAdmin}
      className="p-button-success"
    />
    <Button
      label="Cancelar"
      onClick={onHide}
      className="p-button-secondary"
    />
  </div>
</Dialog>
</div>
    </>
  );
}

export default Admin;
