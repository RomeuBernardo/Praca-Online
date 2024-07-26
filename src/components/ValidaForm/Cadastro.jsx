import React, { useState, useEffect,useRef } from 'react';
import { isEmpty } from "lodash";
import './Formulario.css';
import $ from 'jquery';
import Header  from '../Header/MenuDoCadastro';
import { Toast } from 'primereact/toast';


const MauFormulario = () => {
  const [dadosFormulario, setDadosFormulario] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    endereco: "",
  });
  
  const toast = useRef(null);

  const show = (mensagem, estado) => {
      toast.current.show({ severity: estado, detail: mensagem });
  };

  const [erros, setErros] = useState({
    nome: null,
    email: null,
    senha: null,
    confirmarSenha: null,
    endereco: null,
  });

  const handleSubmit = (e) => {
    let formularioValido = true;
    e.preventDefault();
    if (isEmpty(dadosFormulario.nome)) {
      setErros((prev) => ({ ...prev, nome: "Nome é obrigatório." }));
      formularioValido = false;
    } else {
      setErros((prev) => ({ ...prev, nome: null }));
    }

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

    if (isEmpty(dadosFormulario.confirmarSenha)) {
      setErros((prev) => ({ ...prev, confirmarSenha: "Confirmação de senha é obrigatória." }));
      formularioValido = false;
    } else if (dadosFormulario.confirmarSenha !== dadosFormulario.senha) {
      setErros((prev) => ({ ...prev, confirmarSenha: "As senhas não coincidem." }));
      formularioValido = false;
    } else {
      setErros((prev) => ({ ...prev, confirmarSenha: null }));
    }

   


    if (isEmpty(dadosFormulario.endereco)) {
      setErros((prev) => ({ ...prev, endereco: "Endereço é obrigatório." }));
      formularioValido = false;
    } else {
      setErros((prev) => ({ ...prev, endereco: null }));
    }

   

    if (!formularioValido) return;

    //alert(JSON.stringify(dadosFormulario));
 
 



      // Fazendo Uma Requisicao AJAX para o Cadastro


      // Obtenha todos os dados do formulário de cadastro
      let email = document.getElementById('email').value;
      let nome = document.getElementById('nome').value;
      let endereco = document.getElementById('endereco').value;
      let password = document.getElementById('password').value;
      let passconfirmation = document.getElementById('passconfirmation').value;

      // Realize uma requisição Ajax para o backend
      $.ajax({
          url: 'http://localhost:5000/CadastrarCliente', // URL ajustada para apontar para o backend
          method: 'POST',
          headers:{ 
              'Accept': 'application/json',
              'Content-Type': 'application/json' 
          },
          dataType: 'json',
          data: JSON.stringify({nome: nome,email: email, password: password, passconfirmation: passconfirmation,endereco: endereco }),
          success: function(response) {
              if (response.success) {
                  // Se o cadastro for bem-sucedido, exiba uma mensagem de sucesso
                  console.log("SSSSSSSSSSS")
                  show("Usuário Cadastrado com sucesso","success");
                  setTimeout(() => {
                    // Redirecione para a página de login ou qualquer outra página desejada
                    window.location.href = '/';
                }, 3000); // 2000 milissegundos = 2 segundos
              } else {
                  // Em caso de falha no cadastro, exiba uma mensagem de erro
                  show("Erro: Este Usuário já Existe","error");
                }
          }
      });
    }
  





 
  return (
    
    <body className="formulario1-body">

           <div className='mov'><Header/></div> 
           <Toast ref={toast} style={{padding: "20px"}} />

        <form onSubmit={handleSubmit} className="app-container" id="register-form">
          <div className="form-group">
            <label>Nome</label>
            <input
              className={erros?.nome && "input-error"} id="nome"
              type="text"
              placeholder="Seu nome"
              value={dadosFormulario.nome}
              onChange={(e) =>
                setDadosFormulario((prev) => ({ ...prev, nome: e.target.value }))
              }
            />
            {erros?.nome && <p className="error-message">{erros?.nome}</p>}
          </div>

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
              placeholder="Senha"
              value={dadosFormulario.senha}
              onChange={(e) =>
                setDadosFormulario((prev) => ({ ...prev, senha: e.target.value }))
              }
            />
            {erros?.senha && (
              <p className="error-message">{erros?.senha}</p>
            )}
          </div>

          <div className="form-group">
            <label>Confirmar Senha</label>
            <input
              className={erros?.confirmarSenha && "input-error"}
              type="password" id="passconfirmation"
              placeholder="Confirmar Senha"
              value={dadosFormulario.confirmarSenha}
              onChange={(e) =>
                setDadosFormulario((prev) => ({ ...prev, confirmarSenha: e.target.value }))
              }
            />
            {erros?.confirmarSenha && (
              <p className="error-message">{erros?.confirmarSenha}</p>
            )}
          </div>

          <div className="form-group">
            <label>Endereço</label>
            <input
              className={erros?.endereco && "input-error"}
              type="text"  id="endereco"
              placeholder="Seu endereço"
              value={dadosFormulario.endereco}
              onChange={(e) =>
                setDadosFormulario((prev) => ({ ...prev, endereco: e.target.value }))
              }
            />
            {erros?.endereco && <p className="error-message">{erros?.endereco}</p>}
          </div>

    

          <div className="form-group">
               <button type="submit">Criar Conta</button>
        </div>
           
      </form>
      </body>  
  );
};

export default MauFormulario;
