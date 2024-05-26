// Componente Menu.js
import React, { useState,useRef } from 'react';
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { PanelMenu } from 'primereact/panelmenu';
import '../../App.css'; // Crie este arquivo para estilizar o menu se necessário
import logo from '../../imagens/logo1.png';
import { FaShoppingCart } from 'react-icons/fa'; // Importando o ícone FaShoppingCart
import $ from 'jquery';
import { Toast } from 'primereact/toast';

const Menu = ({props}) => {
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [menuLeft, setMenuLeft] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const [cartItems, setCartItems] = useState(0); // Estado para rastrear o número de itens no carrinho
  const sessionEmail = JSON.parse(localStorage.getItem('sessionData'));    // Obtém o session_email do localStorage
  const toast = useRef(null);

  const show = (mensagem, estado) => {
      toast.current.show({ severity: estado, detail: mensagem });
  };
  const items = [
    {
      template: () => (
        <img src={logo} className="App-logo" alt="logo" style={{width:'240px',height:'60px',marginTop: '40px', marginLeft:'14px' }} />
        // Adicionei o estilo pointerEvents: 'none' para desativar eventos de hover
      )
    },
    {
      label: 'Página Principal',
      className: 'p-menuitem-text',
      command: () => { window.location = '/TelaVendedor'; }
    },
    {
      label: 'Serviços',
      className: 'p-menuitem-text',
      items: [
        {
           label: 'Adicionar Produto', command: () => { window.location = '/Vendedor'; }
      },
      {
        label: 'Listar Produtos', command: () => { window.location = '/CRUD_ProdutoVendedor'; }

      },
     
      {
        label: 'Efectuar Pagamento', command: () => { window.location = '/Pagamento'; }

      },
      
      ]
    },
    
    {
      label: 'Ir à Praça',
      className: 'p-menuitem-text',
      command: () => { window.location = '/PracaVendedor' }
    },
    
    {
      label: 'Sobre Nós',
      className: 'p-menuitem-text',
      command: () => { window.location = '/SobreNosvendedor'; }
    },
    {
      // Ícone do carrinho de compras com a funcionalidade de adicionar item ao carrinho
      icon: <FaShoppingCart className="cart-icon" onClick={() => toggleCart()} />,
      command: () => { window.location = '/CarrinhoVendedor'; },
    }
  ];

  const userMenuItems = [
    {
      label: <>{sessionEmail &&
        sessionEmail.user_data &&
        sessionEmail.user_data.email}</>// Aqui o email será mostrado dinamicamente
    
    },
   
  
    {
      label: 'Meu Histórico De Venda',
      command: () => {window.location = '/Historico_Venda' }
    },
    {
      label: 'Meu Histórico De Compras',
      command: () => {window.location = '/HistoricoCompraVend' }
    },
    {
      separator: true // Adiciona um espaço entre os itens do menu
    },
    {
      label: 'Sair',
      command: () => { finalizarSessao() }
    }
  ];

  const finalizarSessao = () => {
    $.ajax({
      url: 'http://localhost:5000/logout',
      method: 'GET',
      dataType: 'json',
      success: function(response) {
        if (response.success) {
          localStorage.removeItem('session_email'); // Limpa os dados do usuário armazenados localmente, se houver
          window.location.href = '/'; // Redireciona para a página de login ou outra página desejada
        } else {
          show(response.message,"error");
        }
      },
      error: function(xhr, status, error) {
        console.error('Erro ao finalizar sessão:', error);
        show("Erro ao finalizar sessão. Por favor, tente novamente.","error");
      }
    });
  };

  const toggleUserMenu = () => {
    setUserMenuVisible(!userMenuVisible);
    if (!userMenuVisible) {
      const avatarElement = document.querySelector('.avatar');
      const avatarRect = avatarElement.getBoundingClientRect();
      setMenuLeft(avatarRect.left);
    }
  };

  const toggleCart = () => {
    // Aqui você pode adicionar a lógica para abrir o carrinho
    console.log('Abrir carrinho');
  };

  

  return (
    <>
          <Toast ref={toast} style={{padding: "20px"}} />

      <div className="custom-menu">
        <Menubar model={items} end={
        <div className='avatar' >
        <div style={{ marginRight: '1rem' }}>
          {userMenuVisible && <PanelMenu model={userMenuItems} className="submenuAvatar" />}
        </div>
        <Avatar icon="pi pi-user" shape="circle" size="large" onClick={toggleUserMenu} />
      </div>
      
        } />
      </div>
    </>
    
  );
}

export default Menu;
