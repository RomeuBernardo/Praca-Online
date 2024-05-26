import React, { useState, useEffect,useRef } from "react";
import { Button } from "primereact/button";
import axios from "axios";
import "./Admin.css";
import Header from "../components/Header/MenuAdmin";
import Footer from "../components/Footer/Footer";
import Scroll from "../components/Scroll/Scroll";
  import { Toast } from 'primereact/toast';

function Admin() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);
  const toast = useRef(null);
  
    const show = (mensagem, estado) => {
        toast.current.show({ severity: estado, detail: mensagem });
    };
  const carregarDados = () => {
    axios.get("http://localhost:5000/carregar_mensalidades")
      .then(response => {
        if (response.data.success) {
          setDados(response.data.mensalidades);
        } else {
          console.error("Nenhuma mensalidade encontrada.");
        }
      })
      .catch(error => {
        console.error("Erro ao carregar mensalidades:", error);
      });
  };

  const handleRemoverDados = (id_mensalidade) => {
    axios.post("http://localhost:5000/remover_mensalidade", { id_mensalidade })
      .then(response => {
        if (response.data.success) {
          show("Mensalidade removida com sucesso!","success");
          setDados(prevDados => prevDados.filter(item => item.id_mensalidade !== id_mensalidade));
        } else {
          console.error("Erro ao remover mensalidade:", response.data.message);
        }
      })
      .catch(error => {
        console.error("Erro ao remover mensalidade:", error);
      });
  };

  const handleDownloadComprovativo = (caminhoComprovativo) => {
    window.open(caminhoComprovativo, '_blank');
  };

  return (
    <>
          <Toast ref={toast} style={{padding: "20px"}} />

      <div className="mov"><Header/></div>
      <div className="container">
        <h1>Mensalidades</h1>

        <table className="p-table">
          <thead>
            <tr>
              <th>Email do Vendedor</th>
              <th>Data</th>
              <th>Comprovativo</th>
              <th>Opções</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((item) => (
              <tr key={item.id_mensalidade}>
                <td>{item.email_vendedor}</td>
                <td>{item.Data}</td>
                <td>
                  {item.caminho_Comprovativo && (
                    <Button
                      label="Baixar Comprovativo"
                      onClick={() => handleDownloadComprovativo(item.caminho_Comprovativo)}
                      icon="pi pi-download"
                      className="p-button-sm p-button-secondary"
                    />
                  )}
                </td>
                <td>
                  <Button
                    label="Remover"
                    onClick={() => handleRemoverDados(item.id_mensalidade)}
                    icon="pi pi-trash"
                    className="p-button-sm p-button-danger"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Scroll/>
    </>
  );
}

export default Admin;
