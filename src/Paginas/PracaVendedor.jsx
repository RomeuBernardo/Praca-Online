import React, { useState, useEffect,useRef } from "react";
import $ from 'jquery';
import './Produto.css';
import Header from "../components/Header/Header";
import Footer from "../components/Footer/FooterVendedor";
import Scroll from "../components/Scroll/Scroll";
import { Toast } from 'primereact/toast';

function Produto() {
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [mensagem, setMensagem] = useState(""); // Estado para a mensagem de sucesso

  const toast = useRef(null);

    const show = (mensagem, estado) => {
        toast.current.show({ severity: estado, detail: mensagem });
    };
  const sessionEmail = JSON.parse(localStorage.getItem('sessionData')); // Obtém o session_email do localStorage
  
  const isMeuProduto = (produto) => {
    return produto.email === sessionEmail.user_data.email;
  }

  const carregarDadosProduto = () => {
    $.ajax({
      url: 'http://localhost:5000/carregar_dados_produto',
      method: 'GET',
      dataType: 'json',
      success: function(data) {
        if (data.success) {
          setProdutos(data.data);
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error('Erro ao carregar dados do produto:', errorThrown);
      }
    });
  }
  function minhaGestao(){
    window.location = '/CRUD_ProdutoVendedor'
  }
  const handleAdicionarAoCarrinho = (produto) => {
    const itemExistente = carrinho.find(item => item.id_produto === produto.id);
    if (itemExistente) {
      const novoCarrinho = carrinho.map(item => {
        if (item.id_produto === produto.id) {
          return { ...item, quantidade: item.quantidade + 1 };
        }
        return item;
      });
      setCarrinho(novoCarrinho);
    } else {
      const novoItem = {
        id_produto: produto.id_produto,
        caminho_imagem: produto.imagem_produto,
        nome_produto: produto.nome_produto,
        quantidade: 1,
        preco:produto.preco
      };

      // Atualizar o estado do carrinho apenas se o produto for adicionado com sucesso
      $.ajax({
        url: 'http://localhost:5000/adicionar_carrinho',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ carrinho: [...carrinho, novoItem] }),
        dataType: 'json',
        success: function(data) {
          if (data.success) {
            setCarrinho([...carrinho, novoItem]); // Adiciona o novo item ao carrinho
            show("Produto adicionado ao carrinho com sucesso!","success"); // Definindo a mensagem de sucesso
          } else {
            show(data.message,"error");
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.error('Erro ao adicionar carrinho:', errorThrown);
        }
      });
    }
  }

  useEffect(() => {
    carregarDadosProduto();
  }, []);

  useEffect(() => {
    if (mensagem) {
      const timer = setTimeout(() => {
        setMensagem(""); // Limpa a mensagem após alguns segundos
      }, 3000); // 3 segundos
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  function totalProdutosNoCarrinho() {
    return carrinho.reduce((total, item) => total + item.quantidade, 0);
  }
  
  return (
    <>
      <div className='mov'><Header /></div>
      <Toast ref={toast} style={{padding: "20px"}} />

      <div className="container">
        <div className="produtos-container">
          {produtos.map(produto => (
            <div className="card" key={produto.id}>
              <img
                src={produto.imagem_produto}
                alt={produto.nome_produto}
                style={{ width: '250px', height: '100px' }}
              />
              <div className="descricao">
                <h3>{produto.nome_produto}</h3> 
                <p>{produto.descricao}</p>
                <p>Preço: KZ {parseFloat(produto.preco).toFixed(2)}</p>
                {isMeuProduto(produto) ? (
                  <button className="button-meu-produto" onClick={ minhaGestao}>Meu Produto</button>
                ) : (
                  <button className="button-adicionar" onClick={() => handleAdicionarAoCarrinho(produto)}>
                    {carrinho.some(item => item.id_produto === produto.id) ? 'Adicionar Mais' : 'Adicionar ao Carrinho'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Scroll />
      <Footer />
    </>
  );
}

export default Produto;
