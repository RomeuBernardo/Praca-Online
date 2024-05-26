import React, { useState, useRef } from "react";
import Header from '../Header/MenuDoCadastro';
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import "./Formulario.css";
import { Toast } from 'primereact/toast';

function LoginForm({ handleLoggedIn }) {
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const toast = useRef(null);

  const show = (mensagem, estado) => {
      toast.current.show({ severity: estado, detail: mensagem });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email é obrigatório.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Formato de email inválido.";
      isValid = false;
    }

    if (!formData.senha) {
      newErrors.senha = "Senha é obrigatória.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = (event) => {
    event.preventDefault(); // Impede o comportamento padrão do formulário

    if (!validateForm()) return;

    axios.post("http://localhost:5000/login", formData)
      .then((response) => {
        const data = response.data;
        if (data.session) {
          localStorage.setItem('sessionData', JSON.stringify(data));
          if (data.user_data.user_type === "admin") {
            navigate("/PaginaIniciAdmin", { state: { username: data.session } });
          } else if (data.user_data.user_type === "cliente") {
            navigate("/cliente", { state: { username: data.session } });
          } else if (data.user_data.user_type === "vendedor") {
            navigate("/TelaVendedor", { state: { username: data.session } });
          }
        } else {
          show("Erro: Não foi possível iniciar a sessão senha ou email Invalido","error");
        }
      })
      .catch((error) => {
        console.error("Erro ao fazer login:", error);
      });
  };

  return (
    <body className="formulario-body">

      <div className="mov"><Header /></div>
      <Toast ref={toast} style={{padding: "20px"}} />

      <form onSubmit={handleLogin}>
        <div className="form-group" style={{ marginTop: "100px" }}>
          <label htmlFor="email" style={{ marginBottom: "15px" }}>
            E-mail
          </label>
          <InputText
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Seu e-mail"
            className="inputComponent"
          />
          {errors.email && <div className="errorMessage">{errors.email}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="senha" style={{ marginBottom: "15px" }}>
            Senha
          </label>
          <InputText
            id="senha"
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleInputChange}
            placeholder="Sua senha"
            className="inputComponent"
          />
          {errors.senha && <div className="errorMessage">{errors.senha}</div>}
        </div>
        <div className="form-group">
          <Button label="Entrar" type="submit" />
        </div>
        
      </form>
    </body>
  );
}

export default LoginForm;
