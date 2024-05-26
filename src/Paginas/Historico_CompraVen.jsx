import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import axios from "axios";
import $ from "jquery";
import "./Admin.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Scroll from "../components/Scroll/Scroll";
import jsPDF from "jspdf";
import { Toast } from 'primereact/toast';

function Admin() {
  const [historicoCompra, setHistoricoCompra] = useState([]);
  const toast = useRef(null);

  const show = (mensagem, estado) => {
    toast.current.show({ severity: estado, detail: mensagem });
  };
  const sessionEmail = JSON.parse(localStorage.getItem('sessionData')); // Obtém o session_email do localStorage

  useEffect(() => {
    carregarHistoricoCompra();
  }, []);

  const carregarHistoricoCompra = () => {
    $.ajax({
      url: "http://localhost:5000/carregar_historico_compra",
      type: "GET",
      dataType: "json",
      success: function (response) {
        if (response.success) {
          const historicoCompra = response.historico_compra;
          setHistoricoCompra(historicoCompra);
        } else {
          show("Nenhum histórico de compra encontrado.","error");
        }
      },
      error: function (xhr, status, error) {
        show("Erro ao carregar histórico de compra:", error);
      },
    });
  };

  const handleRemoverHistorico = (id_Historico_Compra) => {
    $.ajax({
      url: "http://localhost:5000/remover_historico_compra",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ id_Historico_Compra: id_Historico_Compra }),
      dataType: "json",
      success: function (response) {
        if (response.success) {
          show("Histórico de compra removido com sucesso!","success");
          setHistoricoCompra((prevHistorico) =>
            prevHistorico.filter(
              (item) => item.id_Historico_Compra !== id_Historico_Compra
            )
          );
        } else {
          console.error(
            "Erro ao remover histórico de compra:",
            response.message
          );
        }
      },
      error: function (xhr, status, error) {
        show("Erro ao remover histórico de compra:", error);
      },
    });
  };

  // Função para gerar a fatura em PDF com todos os produtos do histórico de compras
  const gerarFaturaProdutoPDF = (item) => {
    const doc = new jsPDF();
    doc.text(`Produto: ${item.nome_produto}`, 20, 20);
    doc.text(`Quantidade: ${item.quantidade}`, 20, 30);
    doc.text(`Email do Cliente: ${sessionEmail.user_data.email}`, 20, 40);
    doc.text(`Email do Vendedor: ${item.email_vendedor}`, 20, 50);
    doc.text(`Preço: ${item.preco}`, 20, 60);
    doc.text(`Total: ${(item.preco * item.quantidade).toFixed(2)}`, 20, 70);
    doc.save(`fatura_${item.id_Historico_Compra}.pdf`);
  };
  

 
  return (
    <>
      <div className="mov">
        <Header />
      </div>
      <Toast ref={toast} style={{padding: "20px"}} />
      <div className="container">
        <h1>Histórico de Compra</h1>

        <table className="p-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Imagem</th>
              <th>Email do Vendedor</th>
              <th>Preço</th>
              <th>Total</th>
              <th>Data</th>
              <th>Opções</th>
            </tr>
          </thead>
          <tbody>
            {historicoCompra.map((item) => (
              <tr key={item.id_Historico_Compra}>
                <td>{item.nome_produto}</td>
                <td>{item.quantidade}</td>
                <td>
                  <img
                    src={item.caminho_imagem}
                    alt={item.nome_produto}
                    style={{ width: "50px", height: "50px" }}
                  />
                </td>
                <td>{item.email_vendedor}</td>
                <td>{item.preco}</td>
                <td>{parseFloat(item.preco * item.quantidade).toFixed(2)}</td>
                <td>{item.data}</td>
                <td>
                  <div>
                    <Button
                      label="Remover"
                      onClick={() =>
                        handleRemoverHistorico(item.id_Historico_Compra)
                      }
                      icon="pi pi-trash"
                      className="p-button-sm p-button-danger"
                      style={{ marginRight: '5px' }}
                    />
                    <Button
                      label="Fatura"
                      onClick={() => gerarFaturaProdutoPDF(item)}
                      icon="pi pi-download"
                      className="p-button-sm p-button-success"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
      </div>
      <Scroll />
      <Footer />
    </>
  );
}

export default Admin;
