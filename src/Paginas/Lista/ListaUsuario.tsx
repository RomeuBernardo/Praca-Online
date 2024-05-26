import React, { useEffect, useState } from 'react';
import { Admin, Resource, ListGuesser, Datagrid, TextField, EmailField } from "react-admin";
import jsonServerProvider from 'ra-data-json-server';
import axios from 'axios';

function ListaUsuario() {
    const API_URL = 'http://localhost:5000/Consultaclientes';
    const [clientes, setClientes] = useState([]);

    const fetchClientes = async () => {
        try {
            const response = await axios.get(API_URL);
            console.log('Dados dos clientes:', response.data);

            // Ajuste dos dados recebidos para o formato esperado pelo jsonServerProvider
            const data = response.data.clientes.map(cliente => ({
                id: cliente.id,
                data: cliente // Coloque os dados do cliente dentro de um objeto 'data'
            }));
            
            setClientes(data);

        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []); // Executa uma vez no início

    const dataProvider = jsonServerProvider(API_URL);

    return (
        <Admin dataProvider={dataProvider}>
            <Resource name="users" list={ClienteList}/>
        </Admin>
        
    );
}

const ClienteList = (props) => (
    <ListGuesser {...props}>
        <Datagrid>
            <TextField source="data.id" /> {/* Acessa os dados do cliente dentro de 'data' */}
            <TextField source="data.nome" />
            <EmailField source="data.email" />
            <TextField source="data.endereco" />
        </Datagrid>
    </ListGuesser>
);

export default ListaUsuario;
