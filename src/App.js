import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Paginas/PaginaPrincipal';
import Sobre from './Paginas/Sobre';
import CadastrarVendendores from './components/ValidaForm/CadastrarVend';
import Login from './components/ValidaForm/Login';
import Cadastro from './components/ValidaForm/Cadastro';
import AddS from './components/ValidaForm/AddS';
import PlazaPage from './components/Testar/PlazaPage';
import Ir_a_Praca from './Paginas/Praca';
import VendedorPost from './components/ValidaForm/Vendedores';
import AddPub from './components/ValidaForm/AdicionarPub';
import TelaVendedor from './Paginas/TelaVendedor';
import ListarProdutos from './Paginas/Lista/ClienteList';
import Admin from './Paginas/Admin';
import Users from './Paginas/Lista/ListaUsuario';
import PracaVendedor from './Paginas/PracaVendedor';
import SobreNosvendedor from './Paginas/SobreNosvendedor';
import Compra from './Paginas/Compra';
import CRUD_Vendedor from './Paginas/CRUD_Vendedor';
import CRUD_Cliente from './Paginas/CRUD_Cliente';
import PracaAdmin from './Paginas/PracaAdimin';
import CRUD_Produto from './Paginas/CRUD_Produto';
import CRUD_ProdutoVendedor from './Paginas/CRUD_ProdVendedor';
import CRUD_Pub from './Paginas/CRUD_Publicacao';
import CRUD_Admin from './Paginas/CRUD_Admin';
import CRUD_Slide from './Paginas/CRUD_Carrosse';
import Sugestao from './Paginas/Sugestao';
import Operacoes from './Paginas/Operacoes';
import CadastroAdmin from './components/ValidaForm/CadastroAdmin';
import  AddCarinho from './components/ValidaForm/Add_Carrinho';
import Historico_Compra from './Paginas/Historico_Compra';
import Historico_Venda from './Paginas/Historico_De_Venda';
import PaginaIniciAdmin from './Paginas/PaginaIniciaAdmin';
import InicioN from './Paginas/InicioN';
import HistoricoCompraVend from './Paginas/Historico_CompraVen';
import Pagamento from './Paginas/pagamento';
import CarrinhoVendedor from './components/ValidaForm/AddCarrinhoVendedor';
import Mensalidade from './Paginas/CRUD_Mensalidade';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Função para lidar com o login
  const handleLoggedIn = (loggedIn) => {
    setIsLoggedIn(loggedIn);
  };

  // Função para lidar com o logout
  const handleLogout = () => {
    // Lógica para fazer logout, definindo isLoggedIn como false
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas */}
        <Route path="/cliente" element={<Home />} />
        <Route path="/Sobre" element={<Sobre />} />
        <Route path="/CadastrarVendendores" element={<CadastrarVendendores />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/" element={<InicioN />} />
        <Route path="/Cadastro" element={<Cadastro />} />
        <Route path="/PlazaPage" element={<PlazaPage />} />
        <Route path="/Ir_a_Praca" element={<Ir_a_Praca />} />
        <Route path="/Vendedor" element={<VendedorPost />} />
        <Route path="/TelaVendedor" element={<TelaVendedor />} />
        <Route path="/ListarProdutos" element={<ListarProdutos />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/users/*" element={<Users />} />

        <Route path="/PracaVendedor" element={<PracaVendedor />} />
        <Route path="/SobreNosvendedor" element={<SobreNosvendedor />} />
        <Route path="/Compra" element={<Compra />} />
        <Route path="/CRUD_Vendedor" element={<CRUD_Vendedor />} />
        <Route path="/CRUD_Cliente" element={<CRUD_Cliente />} />
        <Route path="/PracaAdmin" element={<PracaAdmin />} />
        <Route path="/CRUD_Produto" element={<CRUD_Produto />} />
        <Route path="/CRUD_ProdutoVendedor" element={<CRUD_ProdutoVendedor />} />
        <Route path="/Sugestao" element={<Sugestao />} />
        <Route path="/AddS" element={<AddS />} />
        <Route path="/CRUD_Slide" element={<CRUD_Slide />} />
        <Route path="/CadastroAdmin" element={<CadastroAdmin />} />
        <Route path="/CRUD_Admin" element={<CRUD_Admin />} />
        <Route path="/AddPub" element={<AddPub />} />
        <Route path="/CRUD_Pub" element={<CRUD_Pub />} />
        <Route path="/Operacoes" element={<Operacoes />} />
        <Route path="/AddCarinho" element={<AddCarinho />} />
        <Route path="/Historico_Compra" element={<Historico_Compra />} />
        <Route path="/Historico_Venda" element={<Historico_Venda />} />
        <Route path="/PaginaIniciAdmin" element={<PaginaIniciAdmin/>} />
        <Route path="/CarrinhoVendedor" element={<CarrinhoVendedor/>} />
        <Route path="/HistoricoCompraVend" element={<HistoricoCompraVend/>} />
        <Route path="/Pagamento" element={<Pagamento/>} />
        <Route path="/Pagamento" element={<Pagamento/>} />
        <Route path="/Mensalidade" element={<Mensalidade/>} />

        
        
        
        {/* Rota para o LoginForm */}
        <Route
          path="/login"
          element={<Login handleLoggedIn={handleLoggedIn} />}
        />

        {/* Rota para o Logout */}
        <Route
          path="/login"
          element={<Login handleLogout={handleLogout} />}
        />

        {/* Rota para redirecionar se estiver logado */}
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/cliente" /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
