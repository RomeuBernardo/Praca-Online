// ClienteList.tsx
import React from 'react';
import { List, Datagrid, TextField, EmailField } from 'react-admin';

const ClienteList: React.FC = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" label="ID" />
            <TextField source="nome" label="Nome" />
            <EmailField source="email" label="Email" />
            <TextField source="endereco" label="Endereço" />
        </Datagrid>
    </List>
);

export default ClienteList;
