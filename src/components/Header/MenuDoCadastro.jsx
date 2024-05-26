import React, { useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { PanelMenu } from 'primereact/panelmenu';
import '../../App.css'; // Crie este arquivo para estilizar o menu se necessário
import logo from '../../imagens/logo1.png';
import { Link } from 'react-router-dom';

const Menu = () => {
  const [userMenuVisible, setUserMenuVisible] = useState(false);

  // Defina a variável 'userMenuItems' aqui
  const userMenuItems = [
    { label: 'Perfil', icon: 'pi pi-user-edit' },
    { label: 'Configurações', icon: 'pi pi-cog' },
    { separator: true },
    { label: 'Sair', icon: 'pi pi-sign-out', command: () => { console.log('Sair'); } }
  ];

  const items = [
    {
      template: () => (
        <img src={logo} className="App-logo" alt="logo" style={{width:'240px',height:'60px',marginTop: '40px', marginLeft:'14px' }} />
      )
    },
    {
      label: 'Pagina Principal',
      className: 'p-menuitem-text',
      command: () => { window.location = '/'; }
    },
    {
      label: 'Login',
      className: 'p-menuitem-text',
      command: () => { window.location = '/Login'; }
    },
    {
      label: 'Cadastro de Clientes',
      className: 'p-menuitem-text',
      command: () => { window.location = '/Cadastro'; }
    },
    {
      label: 'Cadastro de Vendedores',
      className: 'p-menuitem-text',
      command: () => { window.location = '/CadastrarVendendores'; }
    }
  ];

  const toggleUserMenu = () => {
    setUserMenuVisible(!userMenuVisible);
  };

  return (
    <div className="custom-menu">
      <Menubar model={items} end={
        <div>
          {userMenuVisible && <PanelMenu model={userMenuItems} className="submenuAvatar" style={{ left: `1050px` }} />}
        </div>
      } />
    </div>
  );

}

export default Menu;
