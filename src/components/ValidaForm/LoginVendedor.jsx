import React, { useState } from "react";
import { isEmpty } from "lodash";
import './Formulario.css';
import $ from 'jquery';
import logo from '../../imagens/logo.png';
import { Toast } from 'primereact/toast';

import Header  from '../Header/MenuDoCadastro';

const MauFormulario = () => {
  const [dadosFormulario, setDadosFormulario] = useState({
    email: "",
    senha: "",
  });

  const [erros, setErros] = useState({
    email: null,
    senha: null,
  });
  const toast = useRef(null);

  const show = (mensagem, estado) => {
      toast.current.show({ severity: estado, detail: mensagem });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let formularioValido = true;

    if (isEmpty(dadosFormulario.email)) {
      setErros((prev) => ({ ...prev, email: "Email é obrigatório." }));
      formularioValido = false;
    } else {
      const padraoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!padraoEmail.test(dadosFormulario.email)) {
        setErros((prev) => ({ ...prev, email: "Formato de email inválido." }));
        formularioValido = false;
      } else {
        setErros((prev) => ({ ...prev, email: null }));
      }
    }

    if (isEmpty(dadosFormulario.senha)) {
      setErros((prev) => ({ ...prev, senha: "Senha é obrigatória." }));
      formularioValido = false;
    } else {
      setErros((prev) => ({ ...prev, senha: null }));
    }

    if (!formularioValido) return;

    // Obter os valores dos campos de formulário
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    $.ajax({
      url: 'http://localhost:5000/login',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      'dataType': 'json',
      data: JSON.stringify({ email: email, password: password }),
      success: function(response) {
        if (response.success) {
          console.log('E-mail do usuário:', response.user.session_email);
          console.log('E-mail do usuário ss:', response.user.email);
          localStorage.setItem('session_email', response.user.session_email);
          const sessionEmail = localStorage.getItem('session_email');
          console.log('Valor de session_email:', sessionEmail);

          // Adicionar a sessão atual do usuário à lista no localStorage
          let sessionsList = JSON.parse(localStorage.getItem('sessionsList')) || [];
          sessionsList.push(sessionEmail);
          localStorage.setItem('sessionsList', JSON.stringify(sessionsList));

          if (response.user.type === 'cliente') {
            window.location.href = '/cliente'; // Redireciona para a página do cliente
          } else if (response.user.type === 'vendedor') {
            window.location.href = '/TelaVendedor'; // Redireciona para a página do vendedor
          } else if (response.user.type === 'admin'){
            window.location.href = '/Admin'; // Redireciona para a página padrão se o tipo não for especificado
          }
        } else {
          alert(response.message);
        }
      },
      error: function(xhr, status, error) {
        console.error('Erro ao realizar requisição:', error);
        show('Erro ao enviar dados. Por favor, tente novamente.',"error");
      }
    });
  };

  return (
    <body className="formulario-body">
      <Header/>
      <Toast ref={toast} style={{padding: "20px"}} />

      <form onSubmit={handleSubmit} className="app-container" id="register-form">
        <div className="form-group">
          <label>Email</label>
          <input
            className={erros?.email && "input-error"}
            type="email" id="email"
            placeholder="Seu email"
            value={dadosFormulario.email}
            onChange={(e) =>
              setDadosFormulario((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          {erros?.email && <p className="error-message">{erros?.email}</p>}
        </div>

        <div className="form-group">
          <label>Senha</label>
          <input
            className={erros?.senha && "input-error"}
            type="password" id="password"
            placeholder="Sua senha" 
            value={dadosFormulario.senha}
            onChange={(e) =>
              setDadosFormulario((prev) => ({ ...prev, senha: e.target.value }))
            }
          />
          {erros?.senha && <p className="error-message">{erros?.senha}</p>}
        </div>
        <div className="form-group">
          <button type="submit">Login</button>
        </div>
        <div className="links">
          <a href="#" className="forgot-password">Esqueceu a senha?</a>
        </div>
      </form>
    </body>
  );
};

export default MauFormulario;
