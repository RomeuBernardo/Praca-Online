import React, { useState, useEffect,useRef } from "react";
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import $ from 'jquery'; // Importe o jQuery para usar AJAX
import '../../Paginas/Produto.css';
import { Toast } from 'primereact/toast';

import '../../App.css'; // Importe o arquivo CSS para estilização

function Footer() {
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const toast = useRef(null);

    const show = (mensagem, estado) => {
        toast.current.show({ severity: estado, detail: mensagem });
    };

  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [pesquisaValida, setPesquisaValida] = useState(true); // Estado para validar a pesquisa
  const handlePesquisaSubmit = (e) => {
    e.preventDefault(); // Evita o comportamento padrão do formulário
    if (termoPesquisa.trim() === '') {
      setPesquisaValida(false); // Atualiza o estado para indicar que a pesquisa não é válida
    } else {
      setPesquisaValida(true); // Reseta o estado para indicar que a pesquisa é válida
      // Envie a solicitação de pesquisa aqui
    }
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
      setCarrinho([...carrinho, novoItem]);
    }
    enviarCarrinhoParaServidor(); // Enviar carrinho para o servidor sempre que um produto for adicionado
    
  }

  const enviarCarrinhoParaServidor = () => {
    $.ajax({
      url: 'http://localhost:5000/adicionar_carrinho',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ carrinho }), // Convertendo o objeto carrinho para JSON
      dataType: 'json',
      success: function(data) {
        if (data.success) {
          console.log('Carrinho enviado com sucesso:', carrinho);
          // Limpar carrinho após o envio bem-sucedido
          setCarrinho([]);
          show("Item adicionado ao carrinho com sucesso!","success");
        } else {
          show(data.message,"error");
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

  const produtosFiltrados = produtos.filter(produto =>
    produto.nome_produto.toLowerCase().includes(termoPesquisa.toLowerCase())
  );
  useEffect(() => {
    if (mensagem) {
      const timer = setTimeout(() => {
        setMensagem("");
      }, 3000); // Remova a mensagem após 3 segundos (ajuste conforme necessário)
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  return (
      <>
      <Toast ref={toast} style={{padding: "20px"}} />

        <div className="pegarPesq" style={{ marginTop: '100px' }}>
          {termoPesquisa.length > 0 ? (
         <div>   
          <h1 style={{ textAlign: 'center', color: '#415aca', marginBottom: '50px', marginTop: '10px' }}>Resultados da Pesquisa</h1>

            <div className="produtos-container">
                {produtosFiltrados.length > 0 ? (
                produtosFiltrados.map(produto => (
                  <div className="card" key={produto.id}>
                    <img
                      src={produto.imagem_produto}
                      alt={produto.nome_produto}
                      style={{ width: '250px', height: '100px' }}
                    />
                    <div className="descricao">
                      <p>{produto.id_produto}</p>
                      <h3>{produto.nome_produto}</h3>
                      <p>{produto.descricao}</p>
                      <p>Preço: KZ {parseFloat(produto.preco).toFixed(2)}</p>
                      <button className="button-adicionar" onClick={() => handleAdicionarAoCarrinho(produto)}>
                        {carrinho.some(item => item.id_produto === produto.id) ? 'Adicionar Mais' : 'Adicionar ao Carrinho'}
                      </button>
                    </div>

                  </div>
                ))
              ) : (
                <h3  style={{marginBottom:'130px',display:'flex', marginLeft:'500px',marginTop:'40px'}}>Nenhum produto encontrado.</h3>
              )}
            </div>
            </div>
          ) : (
            <div className="sem-pesquisa-mensagem"></div>
          )}
  

   
    </div>
    <footer>
      <div className="conteiner-footer">
        <div className="row-footer">
          <div className="footer-col">
            <h4>Empresa</h4>
            <ul>
              <li><a href="/Sobre">Quem somos</a></li>
              <li><a href="">Nossos Serviços</a></li>
              <li><a href="">Políticas de Privacidades</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Obter Ajuda</h4>
            <ul>
              <li><a href="">Status de Pedidos</a></li>
              <li><a href="">Opções de Pagamentos</a></li>
              <li><a href="">Transportes</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Praça Online</h4>
            <ul>
              <li><a href="/Ir_a_Praca">Mochilas</a></li>
              <li><a href="/Ir_a_Praca">Acessorios Electronico</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Praça Online</h4>
            <div className="form-sub">
            <form onSubmit={handlePesquisaSubmit}>
            <InputText type="text" className='inserir' placeholder="Digite o nome do Produto" 
                       value={termoPesquisa} onChange={(e) => setTermoPesquisa(e.target.value)}  />
              {!pesquisaValida && (<span style={{ color: 'red' }}>Campo Obrigatório</span>
        )} 
            <Button label="Pesquisar" className="p-button-primary" />
          </form>
            </div>
            <div className="medias-sociais">
              <div className="botton">
                <div className="icon"><a href="https://www.facebook.com/profile.php?id=61557366782079"><i className="pi pi-facebook"></i></a></div>
                <span>Facebook</span>
              </div>
              <div className="botton">
                <div className="icon"><a href=""><i className="pi pi-instagram"></i></a></div>
                <span>Instagram</span>
              </div>
              <div className="botton">
                <div className="icon"><a href="seu-link-do-whatsapp"><i className="pi pi-whatsapp"></i></a></div>
                <span>WhatsApp</span>
              </div>
              <div className="botton">
                <div className="icon"><a href=""><i className="pi pi-linkedin"></i></a></div>
                <span>Linkedin</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </footer>
    
</>

  );
}

export default Footer;
