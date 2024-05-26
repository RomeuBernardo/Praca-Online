import React from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';


import '../../App.css'; // Importe o arquivo CSS para estilização

function Footer() {
  return (
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
              <li><a href="">Relógios</a></li>
              <li><a href="">Computadores</a></li>
              <li><a href="">Endereços</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Praça Online</h4>
            <div className="form-sub">
              <form>
                <InputText type="email" className='inserir' placeholder="Digite a sua pesquisa" required />
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
  );
}

export default Footer;
