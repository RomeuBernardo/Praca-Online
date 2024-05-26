import React, { useState, useEffect } from "react";
import $ from 'jquery'; // Importe o jQuery para usar AJAX
import './Produto.css';
import Header from "../components/Header/MenuDoCadastro";
import Footer from "../components/Footer/Footer";
import Scroll from "../components/Scroll/Scroll";
import { Link } from "react-router-dom";

function Produto() {
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);

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

  const handleAdicionarAoCarrinho = () => {
         window.location('/Login');
    
    
  }

  const enviarCarrinhoParaServidor = () => {
    $.ajax({
      url: 'http://localhost:5000/adicionar_carrinho',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ carrinho }),
      dataType: 'json',
      success: function(data) {
        if (data.success) {
          console.log('Carrinho enviado com sucesso:', carrinho);

          // Limpar carrinho após o envio bem-sucedido
          setCarrinho([]);
        } else {
          console.error('Erro ao enviar carrinho:', data.message);
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error('Erro ao enviar carrinho:', errorThrown);
      }
    });
  }

  useEffect(() => {
    carregarDadosProduto();
  }, []);

  return (
    <>
      <div className='mov'><Header/></div>
      
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
                <button className="button-adicionar" onClick={() => window.location.href = '/Login'}>
                  {carrinho.some(item => item.id_produto === produto.id) ? 'Adicionar Mais' : 'Adicionar ao Carrinho'}
                </button> 
              </div>
            </div>
          ))}
        </div>
        <div className="carrinho-container">
          <h2>Carrinho</h2>
          <ul>
            {carrinho.map(item => (
              <li key={item.id_produto}>
                <span>{item.nome_produto}</span>
                <span>{item.quantidade}</span>

              </li>
            ))}
          </ul>
        </div>
      </div>
      <Scroll />
    </>
  );
}
export default Produto;
