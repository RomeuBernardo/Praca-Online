import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import axios from "axios"; // Importar o axios para fazer requisições HTTP
import $ from "jquery";
import "./Admin.css"; // Importando arquivo de estilos CSS
import Header from "../components/Header/Menu";
import Footer from "../components/Footer/Footer";
import Scroll from "../components/Scroll/Scroll";
import { Toast } from 'primereact/toast';

function Admin() {
  const [data, setData] = useState([]);
  const [totalProdutos, setTotalProdutos] = useState(0); // Estado para armazenar o total de produtos
  const [comprovativo, setComprovativo] = useState(null); // Estado para armazenar o comprovativo
  const toast = useRef(null);

  const show = (mensagem, estado) => {
      toast.current.show({ severity: estado, detail: mensagem });
  };
  useEffect(() => {
    handleListarProdutosCarrinho();
  }, []);

  // Funcao para listar produtos no carrinho
  const handleListarProdutosCarrinho = () => {
    $.ajax({
      url: "http://localhost:5000/carregar_produtosCarrinho",
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.success) {
          const produtos = response.produtos;
          setData(produtos);
          setTotalProdutos(produtos.length);
        } else {
          show("Nenhum produto encontrado no carrinho","error");
        }
      },
      error: function (xhr, status, error) {
        console.error("Erro ao carregar produtos do carrinho:", error);
      },
    });
  };

  // Funcao para editar a quantidade de um produto
  const handleEditarQuantidade = (id_Carrinho, nova_quantidade) => {
    const data = {
      id_Carrinho: id_Carrinho,
      nova_quantidade: nova_quantidade
      
    };

    $.ajax({
      url: "http://localhost:5000/editar_quantidade",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(data),
      dataType: "json",
      success: function (response) {
        
        if (response.success) {
          show("Quantidade do produto atualizada com sucesso!","success");
          handleListarProdutosCarrinho(); // Atualizar a lista de produtos após a edição
        } else {
          console.error("Erro ao editar quantidade:", response.message);
        }
      },
      error: function (xhr, status, error) {
        console.error("Erro ao editar quantidade:", error);
      },
    });
  };

  // Funcao para remover um produto do carrinho
  const handleRemoverProduto = (id_Carrinho) => {
    $.ajax({
      url: "http://localhost:5000/remover_produtoCarinho",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ id_Carrinho: id_Carrinho }),
      dataType: "json",
      success: function (response) {
        if (response.success) {
          show("Produto removido do carrinho com sucesso!","success");
          // Remover o produto da lista localmente
          const newData = data.filter(produto => produto.id_Carrinho !== id_Carrinho);
          setData(newData);
        } else {
          console.error("Erro ao remover produto:", response.message);
        }
      },
      error: function (xhr, status, error) {
        console.error("Erro ao remover produto:", error);
      },
    });
  };

  // Funcao para enviar o comprovativo
  const handleEnviarComprovativo = async () => {
    if (!comprovativo) {
      show("Selecione um comprovativo antes de enviar.","error");
      return; 
    }

    // Obtenha o id_produto do primeiro produto na lista (você pode adaptar isso conforme necessário)
    const id_produto = data.length > 0 ? data[0].id_produto : null;

    if (!id_produto) {
      show("Nenhum produto selecionado.","error");
      return;
    }

    const formData = new FormData();
    formData.append("file", comprovativo);
    formData.append("id_produto", id_produto);

    try {
      // Enviar a solicitação para efetuar a compra
      const response = await axios.post("http://localhost:5000/efectuarCompra", formData);

      if (response.data.success) {
        show("Compra efetuada com sucesso!","success");
        // Redirecione para a página de login ou qualquer outra página desejada
        setTimeout(() => {
          // Redirecione para a página de login ou qualquer outra página desejada
        }, 3000); 
      } else {
        show(response.data.message,"error" );
      }
    } catch (error) {
      console.error("Erro ao efetuar compra:", error);
      show("Erro ao efetuar compra. Verifique o console para mais detalhes.","error");
    }
  };

  // Funcao para lidar com a mudanca no campo de upload do comprovativo
  const handleComprovativoChange = (event) => {
    setComprovativo(event.target.files[0]);
  };

  return (
    <>
      <div className="mov"><Header/></div>
      <Toast ref={toast} style={{padding: "20px"}} />

      <div className="container">
        <h1>Carrinho de Compras</h1>

        <table className="p-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Imagem</th>
              <th>Quantidade</th>
              <th>Preço</th>
              <th>Total</th>
              <th>Opções</th>
            </tr>
          </thead>
          <tbody>
            {data.map((produto, index) => (
              <tr key={produto.id_Carrinho}>
                <td>{produto.nome_produto}</td>
                <td>
                  <img src={produto.caminho_imagem} alt={produto.nome_produto} className="product-image" style={{ maxWidth: "50px", maxHeight: "50px" }} />
                </td>
                <td>
                <input
          type="number"
          value={produto.quantidade}
          onChange={(e) => {
            const newQuantidade = parseInt(e.target.value); // Converter o valor para um número inteiro
            const limiteQuantidade = produto.quantidade_Estoque; // Defina aqui o limite de quantidade disponível do produto

            // Verificar se a nova quantidade está dentro do limite
            if (newQuantidade <= limiteQuantidade) {
              setData(prevData => {
                const newData = prevData.map(item => {
                  if (item.id_Carrinho === produto.id_Carrinho) {
                    handleEditarQuantidade(item.id_Carrinho, newQuantidade); // Chamar a função para editar a quantidade
                    return { ...item, quantidade: newQuantidade }; // Atualizar a quantidade do produto
                  }
                  return item;
                });
                return newData;
              });
            } else {
              // Se a nova quantidade exceder o limite, defina-a como o limite
              setData(prevData => {
                const newData = prevData.map(item => {
                  if (item.id_Carrinho === produto.id_Carrinho) {
                    handleEditarQuantidade(item.id_Carrinho, limiteQuantidade); // Chamar a função para editar a quantidade com o limite
                    return { ...item, quantidade: limiteQuantidade }; // Atualizar a quantidade do produto com o limite
                  }
                  return item;
                });
                return newData;
              });
            }
          }}
/>
                </td>
                <td>{produto.preco}</td> 
                <td>{parseFloat(produto.preco * produto.quantidade).toFixed(2)}</td>
            
                <td>
                  <Button
                    label="Remover"
                    onClick={() => handleRemoverProduto(produto.id_Carrinho)}
                    icon="pi pi-trash"
                    className="p-button-sm p-button-danger"
                  />
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="2"></td>
              <td>Total de Produtos: {totalProdutos}</td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <div className="comprovativo-container">
          <input type="file" onChange={handleComprovativoChange} className="image" />
          <Button label="Efectuar Compra" onClick={handleEnviarComprovativo} />
        </div>
      </div>
      <Scroll/>
      <Footer/>
    </>
  );
}

export default Admin;
