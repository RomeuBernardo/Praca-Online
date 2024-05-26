import React, { useState, useEffect, useRef } from "react";
import { isEmpty } from "lodash";
import './Formulario.css';
import Header from '../Header/MenuDoCadastro';
  import { Toast } from 'primereact/toast';

const MauFormulario = () => {
  const [dadosFormulario, setDadosFormulario] = useState({
    nomeEmpresa: "",
    email: "",
    telefone: "",
    endereco: "",
    numeroBI: "",
    tipoProduto: "0",
    senha: "",
    confirmarSenha: ""
  });

  const toast = useRef(null);

  const show = (mensagem, estado) => {
      toast.current.show({ severity: estado, detail: mensagem });
  };
  const [erros, setErros] = useState({
    nomeEmpresa: null,
    email: null,
    telefone: null,
    endereco: null,
    numeroBI: null,
    tipoProduto: null,
    senha: null,
    confirmarSenha: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    let formularioValido = true;

    if (isEmpty(dadosFormulario.nomeEmpresa)) {
      setErros((prev) => ({ ...prev, nomeEmpresa: "Nome da empresa é obrigatório." }));
      formularioValido = false;
    } else {
      setErros((prev) => ({ ...prev, nomeEmpresa: null }));
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

    if (isEmpty(dadosFormulario.telefone)) {
      setErros((prev) => ({ ...prev, telefone: "Telefone é obrigatório." }));
      formularioValido = false;
    } else {
      setErros((prev) => ({ ...prev, telefone: null }));
    }

    if (isEmpty(dadosFormulario.endereco)) {
      setErros((prev) => ({ ...prev, endereco: "Endereço é obrigatório." }));
      formularioValido = false;
    } else {
      setErros((prev) => ({ ...prev, endereco: null }));
    }

    if (isEmpty(dadosFormulario.numeroBI)) {
      setErros((prev) => ({ ...prev, numeroBI: "Número do BI é obrigatório." }));
      formularioValido = false;
    } else {
      // Validação do número do BI
      const padraoBI = /^[0-9A-Z]{14}$/;
      if (!padraoBI.test(dadosFormulario.numeroBI)) {
        setErros((prev) => ({ ...prev, numeroBI: "Número do BI inválido." }));
        formularioValido = false;
      } else {
        setErros((prev) => ({ ...prev, numeroBI: null }));
      }
    }

    if (dadosFormulario.tipoProduto === "0") {
      setErros((prev) => ({ ...prev, tipoProduto: "Tipo de produto é obrigatório." }));
      formularioValido = false;
    } else {
      setErros((prev) => ({ ...prev, tipoProduto: null }));
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
    } else if (dadosFormulario.senha !== dadosFormulario.confirmarSenha) {
      setErros((prev) => ({ ...prev, confirmarSenha: "As senhas não coincidem." }));
      formularioValido = false;
    } else {
      setErros((prev) => ({ ...prev, confirmarSenha: null }));
    }

    if (!formularioValido) return;

  


      // Obtenha todos os dados do formulário de cadastro
      let email = dadosFormulario.email;
      let nomeEmpresa = dadosFormulario.nomeEmpresa;
      let endereco = dadosFormulario.endereco;
      let password = dadosFormulario.senha;
      let confirmarSenha = dadosFormulario.confirmarSenha;
      let telefone = dadosFormulario.telefone;
      let numeroBI = dadosFormulario.numeroBI;
      let tipoProduto = dadosFormulario.tipoProduto;

      // Realize uma requisição Ajax para o backend
      fetch('http://localhost:5000/CadastrarVendedor', {
        method: 'POST',
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            nomeEmpresa: nomeEmpresa,
            email: email,
            senha: password,
            confirmarSenha: confirmarSenha,
            endereco: endereco,
            telefone: telefone,
            numeroBI: numeroBI,
            tipoProduto: tipoProduto
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Se o cadastro for bem-sucedido, exiba uma mensagem de sucesso
          show(data.message,"success");
          setTimeout(() => {
            // Redirecione para a página de login ou qualquer outra página desejada
            window.location.href = '/';
        }, 3000); // 2000 milissegundos = 2 segundos        } else {
        } else {
          // Em caso de falha no cadastro, exiba uma mensagem de erro
          show("Erro: Este Usuário já Existe","error");
        }
      })
      .catch(error => {
        console.error('Erro:', error);
        show("Erro ao cadastrar. Por favor, tente novamente.","error");
      });
    };
  

  return (
    <body className="formulario1-body" id="formBody">
      
      <div className="mov"><Header/></div>
      <Toast ref={toast} style={{padding: "20px"}} />

    <form onSubmit={handleSubmit} className="app-container" id="register-form">
      <div className="form-group">
        <label>Nome do Vendedor</label>
        <input
          className={erros?.nomeEmpresa && "input-error"}
          type="text"
          placeholder="Nome da empresa"
          value={dadosFormulario.nomeEmpresa}
          onChange={(e) =>
            setDadosFormulario((prev) => ({ ...prev, nomeEmpresa: e.target.value }))
          }
        />
        {erros?.nomeEmpresa && <p className="error-message">{erros?.nomeEmpresa}</p>}
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          className={erros?.email && "input-error"}
          type="email"
          placeholder="Seu email"
          value={dadosFormulario.email}
          onChange={(e) =>
            setDadosFormulario((prev) => ({ ...prev, email: e.target.value }))
          }
        />
        {erros?.email && <p className="error-message">{erros?.email}</p>}
      </div>

      <div className="form-group">
        <label>Número de Telefone</label>
        <input
          className={erros?.telefone && "input-error"}
          type="text"
          placeholder="Seu número de telefone"
          value={dadosFormulario.telefone}
          onChange={(e) =>
            setDadosFormulario((prev) => ({ ...prev, telefone: e.target.value }))
          }
        />
        {erros?.telefone && <p className="error-message">{erros?.telefone}</p>}
      </div>

      <div className="form-group">
        <label>Endereço</label>
        <input
          className={erros?.endereco && "input-error"}
          type="text"
          placeholder="Seu endereço"
          value={dadosFormulario.endereco}
          onChange={(e) =>
            setDadosFormulario((prev) => ({ ...prev, endereco: e.target.value }))
          }
        />
        {erros?.endereco && <p className="error-message">{erros?.endereco}</p>}
      </div>

      <div className="form-group">
        <label>Número do BI (Bilhete de Identidade)</label>
        <input
          className={erros?.numeroBI && "input-error"}
          type="text"
          placeholder="Seu número do BI"
          value={dadosFormulario.numeroBI}
          onChange={(e) =>
            setDadosFormulario((prev) => ({ ...prev, numeroBI: e.target.value.toUpperCase() })) // Converte para maiúsculas
          }
        />
        {erros?.numeroBI && <p className="error-message">{erros?.numeroBI}</p>}
      </div>

      <div className="form-group">
        <label>Senha</label>
        <input
          className={erros?.senha && "input-error"}
          type="password"
          placeholder="Sua senha"
          value={dadosFormulario.senha}
          onChange={(e) =>
            setDadosFormulario((prev) => ({ ...prev, senha: e.target.value }))
          }
        />
        {erros?.senha && <p className="error-message">{erros?.senha}</p>}
      </div>

      <div className="form-group">
        <label>Confirmar Senha</label>
        <input
          className={erros?.confirmarSenha && "input-error"}
          type="password"
          placeholder="Confirmar senha"
          value={dadosFormulario.confirmarSenha}
          onChange={(e) =>
            setDadosFormulario((prev) => ({ ...prev, confirmarSenha: e.target.value }))
          }
        />
        {erros?.confirmarSenha && <p className="error-message">{erros?.confirmarSenha}</p>}
      </div>

      <div className="form-group">
        <label>Tipo de Produto</label>
        <select
          className={erros?.tipoProduto && "input-error"}
          value={dadosFormulario.tipoProduto}
          onChange={(e) =>
            setDadosFormulario((prev) => ({ ...prev, tipoProduto: e.target.value }))
          }
        >
          <option value="Escolher">Escolher</option>
          <option value="Roupas">Roupas</option>
          <option value="Acessórios Eletrônicos">Acessórios Eletrônicos</option>
          <option value="Outros">Outros</option>
        </select>
        {erros?.tipoProduto && <p className="error-message">{erros?.tipoProduto}</p>}
      </div>

      <div className="form-group">
        <button type="submit">Cadastrar Vendedor</button>
      </div>
    </form>
    </body>
  );
};

export default MauFormulario;
