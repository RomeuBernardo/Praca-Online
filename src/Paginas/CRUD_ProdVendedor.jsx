import React, { useState, useEffect ,useRef} from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import $ from "jquery";
import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/FooterVendedor.jsx";
import Scroll from "../components/Scroll/Scroll.jsx";
import "./Admin.css"; // Importando arquivo de estilos CSS
  import { Toast } from 'primereact/toast';

function Admin() {
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({}); // Estado para armazenar os dados do formulário
  const [totalProdutos, setTotalProdutos] = useState(0); // Estado para armazenar o total de produtos
  const toast = useRef(null);
  
    const show = (mensagem, estado) => {
        toast.current.show({ severity: estado, detail: mensagem });
    };
  useEffect(() => {
    handleListarProdutos();
  }, []);

  // Funcao para listar produtos
  const handleListarProdutos = () => {
    $.ajax({
      url: "http://localhost:5000/ListarProdutosVendedor",
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.success) {
          const produtos = response.produtos;
          setData(produtos);
          setTotalProdutos(produtos.length); // Atualizar o total de produtos
        } else {
          console.error("Nenhum produto encontrado");
        }
      },
      error: function (xhr, status, error) {
        console.error("Erro ao listar produtos:", error);
      },
    });
  };

  // Funcao para editar produtos
  const handleEditarProduto = () => {
    $.ajax({
      url: "http://localhost:5000/editarProduto",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(formData), // Enviar os dados do formulário
      dataType: "json",
      success: function (response) {
        if (response.success) {
          show("Produto editado com sucesso!","success");
          handleListarProdutos(); // Atualizar a lista de produtos após a edição
          onHide(); // Fechar o diálogo de edição
        } else {
          console.error("Erro ao editar produto:", response.message);
        }
      },
      error: function (xhr, status, error) {
        console.error("Erro ao editar produto:", error);
      },
    });
  };

  // Funcao para remover produtos
  const handleRemoverProduto = (id_produto) => {
    $.ajax({
      url: "http://localhost:5000/removerProduto",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ id_produto: id_produto }),
      dataType: "json",
      success: function (response) {
        if (response.success) {
          show("Produto removido com sucesso!","success");
          handleListarProdutos(); // Atualizar a lista de produtos após a remoção
        } else {
          console.error("Erro ao remover produto:", response.message);
        }
      },
      error: function (xhr, status, error) {
        console.error("Erro ao remover produto:", error);
      },
    });
  };

  const handleEditar = (produto) => {
    setSelectedItem(produto);
    setFormData(produto); // Preencher o formulário com os dados do produto selecionado
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
      <div className="mov"><Header /></div>
      <Toast ref={toast} style={{padding: "20px"}} />

      <div className="container">
      <h1>Lista de Produtos</h1>

        <table className="p-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome do Produto</th>
              <th>Descrição</th>
              <th>Preço</th>
              <th>Caminho da Imagem do Produto</th>
              <th>Email do Vendedor</th>
              <th>Quantidade</th>
              <th>Data</th>
              <th>Opções</th>
            </tr>
          </thead>
          <tbody>
            {data.map((produto, index) => (
              <tr key={produto.id_produto}>
                <td>{produto.id_produto}</td>
                <td>{produto.nome_produto}</td>
                <td>{produto.descricao}</td>
                <td>{produto.preco}</td>
                <td>{produto.imagem_produto}</td>
                <td>{produto.email}</td>
                <td>{produto.quantidade}</td>
                <td>{produto.data}</td>

                <td>
                <td>
                    <div>
                      <Button
                        label="Editar"
                        onClick={() => handleEditar(produto)}
                        icon="pi pi-pencil"
                        className="p-button-sm p-button-warning p-button-block"
                      />
                    </div>
                    <div>
                      <Button
                        label="Remover"
                        onClick={() => handleRemoverProduto(produto.id_produto)}
                        icon="pi pi-trash"
                        className="p-button-sm p-button-danger p-button-block"
                      />
                    </div>
                  </td>

                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="6"></td>
              <td>Total de Produtos: {totalProdutos}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Dialog
        header={<strong>Editar Produto</strong>}
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
            <label htmlFor="nome_produto">
              <strong>Nome do Produto</strong>
            </label>
            <br />
            <input
              id="nome_produto"
              type="text"
              name="nome_produto"
              value={formData.nome_produto || ""}
              onChange={handleChange}
              className="p-inputtext"
            />
          </div>
          <div className="p-field">
            <label htmlFor="descricao">
              <strong>Descrição</strong>
            </label>
            <br />
            <input
              id="descricao"
              type="text"
              name="descricao"
              value={formData.descricao || ""}
              onChange={handleChange}
              className="p-inputtext"
            />
          </div>
          <div className="p-field">
            <label htmlFor="preco">
              <strong>Preço</strong>
            </label>
            <br />
            <input
              id="preco"
              type="text"
              name="preco"
              value={formData.preco || ""}
              onChange={handleChange}
              className="p-inputtext"
            />
          </div>
          <div className="p-field">
            <label htmlFor="imagem_produto">
              <strong>Imagem do Produto</strong>
            </label>
            <br />
            <input
              id="imagem_produto"
              type="text"
              name="imagem_produto"
              value={formData.imagem_produto || ""}
              onChange={handleChange}
              className="p-inputtext"
            />
          </div>
          <div className="p-field">
            <label htmlFor="email">
              <strong>Email do Vendedor</strong>
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
            <label htmlFor="quantidade">
              <strong>Quantidade</strong>
            </label>
            <br />
            <input
              id="quantidade"
              type="number"
              name="quantidade"
              value={formData.quantidade || ""}
              onChange={handleChange}
              className="p-inputtext"
            />
          </div>
          {/* Adicione outros campos conforme necessário */}
          <Button
            label="Salvar"
            onClick={handleEditarProduto}
            className="p-button-success"
          />
          <Button
            label="Cancelar"
            onClick={onHide}
            className="p-button-secondary"
          />
        </div>
      </Dialog>
      <Scroll />
      <Footer />
    </>
  );
}

export default Admin;
