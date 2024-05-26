import React, { useState } from 'react';
import { Button } from 'primereact/button';
import CRUD_Carroseu from './CRUD_Carrosse.jsx';
import CRUD_Produto from './CRUD_Produto.jsx';
import CRUD_Cliente from './CRUD_Cliente.jsx';
import CRUD_Vendedor from './CRUD_Vendedor.jsx';
import CRUD_Publicacao from './CRUD_Publicacao.jsx';
import CRUD_Admin from './CRUD_Admin.jsx'; 
import AddS from '../components/ValidaForm/AddS';
import AddPublicacao from '../components/ValidaForm/AdicionarPub';
import AddAdmin from '../components/ValidaForm/CadastroAdmin';
import Header from "../components/Header/MenuAdmin.jsx";
import Scroll from "../components/Scroll/Scroll.jsx";
import Mensalidade from './CRUD_Mensalidade.jsx';

import './Admin.css'
const AdminPanel = () => {
  const [activeButton, setActiveButton] = useState(null);

  const renderContent = (buttonId) => {
    switch (buttonId) {
      case "admin-Carroseu":
        return <CRUD_Carroseu />;
      case "admin-Produto":
        return <CRUD_Produto />;
      case "admin-Cliente":
        return <CRUD_Cliente />;
      case "admin-Vendedor":
        return <CRUD_Vendedor />;
      case "admin-Publicacao":
        return <CRUD_Publicacao />;
      case "admin-Admin":
        return <CRUD_Admin />;
      case "Mensalidade":
        return <Mensalidade />;
      case "add-Slides":
        return <AddS/>;
      case "add-Publicacao":
        return <AddPublicacao />;
      case "add-Admin":
        return <AddAdmin />;
      default:
        return (
          <div className="usuarios-list">
            {/* Coloque aqui o conteúdo padrão que deseja renderizar */}
          </div>
        );
    }
  };

  const handleButtonClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  return (
    <>   
    <div className='mov'><Header/></div>

    <div className="admin-panel">
      {/* Botões para renderizar diferentes componentes */}
      <div className="button-row">
        <Button
          label="Listar Carroseu"
          onClick={() => handleButtonClick("admin-Carroseu")}
          className={activeButton === "admin-Carroseu" ? "active-button" : ""}
        />
        <Button
          label="Listar Produto"
          onClick={() => handleButtonClick("admin-Produto")}
          className={activeButton === "admin-Produto" ? "active-button" : ""}
        />
        <Button
          label="Listar Cliente"
          onClick={() => handleButtonClick("admin-Cliente")}
          className={activeButton === "admin-Cliente" ? "active-button" : ""}
        />
        <Button
          label="Listar Vendedor"
          onClick={() => handleButtonClick("admin-Vendedor")}
          className={activeButton === "admin-Vendedor" ? "active-button" : ""}
        />
        <Button
          label="Listar Publicação"
          onClick={() => handleButtonClick("admin-Publicacao")}
          className={activeButton === "admin-Publicacao" ? "active-button" : ""}
        />
        <Button
          label="Listar Admin"
          onClick={() => handleButtonClick("admin-Admin")}
          className={activeButton === "admin-Admin" ? "active-button" : ""}
        />
         <Button
          label="Listar Pagamentos"
          onClick={() => handleButtonClick("Mensalidade")}
          className={activeButton === "Mensalidade" ? "active-button" : ""}
        />
      </div>
      <div className="button-row">
        <Button
          label="Adicionar Slides"
          onClick={() => handleButtonClick("add-Slides")}
          className={activeButton === "add-Slides" ? "active-button" : ""}
        />
        <Button
          label="Adicionar Publicação"
          onClick={() => handleButtonClick("add-Publicacao")}
          className={activeButton === "add-Publicacao" ? "active-button" : ""}
        />
        <Button
          label="Adicionar Admin"
          onClick={() => handleButtonClick("add-Admin")}
          className={activeButton === "add-Admin" ? "active-button" : ""}
        />
      </div>

      {/* Renderiza o conteúdo com base no botão clicado */}
      <div className="content">
        {renderContent(activeButton)}
      </div>
    </div>
    <Scroll/>
    </>
  );
};

export default AdminPanel;
