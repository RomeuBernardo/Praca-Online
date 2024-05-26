import React, { useState, useEffect,useRef } from "react";
import { Button } from "primereact/button";
import axios from "axios";
import "./Admin.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Scroll from "../components/Scroll/Scroll";
import { Toast } from 'primereact/toast';

function Admin() {
  const [historicoVenda, setHistoricoVenda] = useState([]);
  const toast = useRef(null);

    const show = (mensagem, estado) => {
        toast.current.show({ severity: estado, detail: mensagem });
    };

  useEffect(() => {
    carregarHistoricoVenda();
  }, []);

  const carregarHistoricoVenda = () => {
    axios.get("http://localhost:5000/carregar_historico_venda")
      .then(response => {
        if (response.data.success) {
          setHistoricoVenda(response.data.historico_venda);
        } else {
          show("Nenhum histórico de venda encontrado.","error");
        }
      })
      .catch(error => {
        console.error("Erro ao carregar histórico de venda:", error);
      });
  };

  const handleRemoverHistorico = (id_Historico_venda) => {
    axios.post("http://localhost:5000/remover_historico_venda", { id_Historico_venda })
      .then(response => {
        if (response.data.success) {
          show("Histórico de venda removido com sucesso!","success");
          setHistoricoVenda(prevHistorico => prevHistorico.filter(item => item.id_Historico_venda !== id_Historico_venda));
        } else {
          show("Erro ao remover histórico de venda:", response.data.message);
        }
      })
      .catch(error => {
        console.error("Erro ao remover histórico de venda:", error);
      });
  };

  const handleDownloadComprovativo = (caminhoComprovativo) => {
    // Fazer uma solicitação para baixar o arquivo associado ao caminhoComprovativo
    window.open(caminhoComprovativo, '_blank');
  };

  return (
    <>
      <div className="mov"><Header/></div>
      <Toast ref={toast} style={{padding: "20px"}} />

      <div className="container">
        <h1>Histórico de Venda</h1>

        <table className="p-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Imagem</th>
              <th>Email do Comprador</th>
              <th>Preço</th>
              <th>Total</th>
              <th>Data</th>
              <th>Comprovativo</th>
              <th>Opções</th>
            </tr>
          </thead>
          <tbody>
            {historicoVenda.map((item) => (
              <tr key={item.id_Historico_venda}>
                <td>{item.nome_produto}</td>
                <td>{item.quantidade}</td>
                <td><img src={item.caminho_imagem} alt={item.nome_produto} style={{ width: '50px', height: '50px' }} /></td>
                <td>{item.email_Comprador}</td>
                <td>{item.preco}</td>
                <td>{parseFloat(item.preco * item.quantidade).toFixed(2)}</td>
                <td>{item.data}</td>
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
                    onClick={() => handleRemoverHistorico(item.id_Historico_venda)}
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
      <Footer/>
    </>
  );
}

export default Admin;
