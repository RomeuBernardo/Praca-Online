import React, { useState, useEffect } from "react";
import Header from "../components/Header/MenuAdmin";
import Footer from "../components/Footer/FooterAdmin";
import Scroll from "../components/Scroll/Scroll";
import $ from "jquery";
import './Produto.css';
import a from '../imagens_produtos/8-89409_3d-heart-png-transparent.png'

function Produto() {
  const [produtos, setProdutos] = useState([]) ;

  const carregarDadosProduto = () => {
    $.ajax({
      url: 'http://localhost:5000/carregar_dados_produto',
      type: 'GET',
      success: function(response) {
        if (response.success) {
            console.log(response.data)
            setProdutos(response.data);
        }
      },
      error: function(xhr, status, error) {
        console.error('Erro ao carregar dados do produto:', error);
      }
    });
  }

  const handleAdicionarAoCarrinho = (produtoId) => {
    // Aqui você pode adicionar a lógica para adicionar o produto ao carrinho
    console.log('Produto adicionado ao carrinho:', produtoId);
  }

  // Chamando a função para carregar os dados do produto quando o componente for montado
  useEffect(() => {
    carregarDadosProduto();
  }, []); // O array de dependências vazio garante que o useEffect seja executado apenas uma vez

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
                <button className="button-adicionar" onClick={() => handleAdicionarAoCarrinho(produto.id)}>
                  Adicionar ao Carrinho
                </button> 
              </div>
            </div>
          ))}
        </div>
      </div>
      <Scroll />
    </>
  );
}
export default Produto;
