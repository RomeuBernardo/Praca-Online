import React, { useState, useEffect,useRef } from 'react';
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import { PanelMenu } from 'primereact/panelmenu';
import '../../App.css'; // Crie este arquivo para estilizar o menu se necessário
import logo from '../../imagens/logo1.png';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { FaShoppingCart } from 'react-icons/fa'; 
import { Toast } from 'primereact/toast';

const Menu = () => {
  const [userMenuVisible, setUserMenuVisible] = useState(false);
  const [menuLeft, setMenuLeft] = useState(0);
  const [userEmail, setUserEmail] = useState('');
const [quantidadeTotal, setQuantidadeTotal] = useState(0); // Estado para armazenar a quantidade total de produtos no carrinho
// Mostrar email na tela assim que a página for carregada
const sessionEmail = JSON.parse(localStorage.getItem('sessionData'));    // Obtém o session_email do localStorage
const toast = useRef(null);

const show = (mensagem, estado) => {
    toast.current.show({ severity: estado, detail: mensagem });
};
/*$(document).ready(function() {
  // Fazer a solicitação ao servidor
    $.ajax({
      url: 'http://localhost:5000/mostraEmail', // Endpoint da sua aplicação Flask
      method: 'GET', // Método GET para obter o email da sessão
      dataType: 'json', // Tipo de dados esperado na resposta
      data: { email: sessionEmail }, // Passar o email da sessão como parâmetro de consulta
      success: function(response) {
        if (response.success) {
          // Se a solicitação for bem-sucedida, exibir o email do usuário na página
          console.log(response.email);
          setUserEmail(response.email);
        } else {
          // Se houver um erro, exibir a mensagem de erro na página
          alert(response.message);
        }
      },
      error: function(xhr, status, error) {
        // Em caso de erro na solicitação AJAX, exibir uma mensagem de erro
        alert('Erro ao enviar solicitação ao servidor.');
        console.error(xhr.responseText);
      }
    });
});
*/


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
      command: () => { window.location = '/cliente'; }
    },
    {
      label: 'Ir à Praça',
      className: 'p-menuitem-text',
      command: () => { window.location = '/Ir_a_Praca'; }
    },
    {
      label: 'Sobre Nós',
      className: 'p-menuitem-text',
      command: () => { window.location = '/Sobre'; }
    },
    {
      // Ícone do carrinho de compras com a funcionalidade de adicionar item ao carrinho
      icon: <FaShoppingCart className="cart-icon" onClick={() => toggleCart()} />,
      command: () => { window.location = '/Compra'; }

    }
  ];

  const userMenuItems = [
    {
      label: <>{sessionEmail &&
        sessionEmail.user_data &&
        sessionEmail.user_data.email}</>// Aqui o email será mostrado dinamicamente
    
    },
    {
      separator: true // Adiciona um espaço entre os itens do menu
    },
    
    {
      label: 'Históricos de Compras',
      command: () => {window.location ='/Historico_Compra' }
    },
    
    {
      label: 'Sair',
      command: () => { finalizarSessao()}
    }
  ];

  const finalizarSessao = () => {
    $.ajax({
        url: 'http://localhost:5000/logout',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.success) {
                localStorage.removeItem('user'); // Limpa os dados do usuário armazenados localmente, se houver
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
        <div className='avatar'>
          <div style={{ marginRight: '1rem' }}>
            {userMenuVisible && <PanelMenu model={userMenuItems} className="submenuAvatar" style={{ left: `${menuLeft}px`}} />}
          </div>
          <Avatar icon="pi pi-user" shape="circle" size="large" onClick={toggleUserMenu} />
        </div>
      } />
    </div>
     </>
  );
}

export default Menu;
