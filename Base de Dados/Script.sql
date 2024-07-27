Create database IF not exists Praca_Online;
USE Praca_Online;
-- Tabela Cliente
CREATE TABLE IF NOT EXISTS Cliente (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    senha VARCHAR(255) NOT null,
    confirmarSenha VARCHAR(255) NOT null,
    endereco VARCHAR(255)
    caminho_imagem VARCHAR(255)
        data TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

);



-- Tabela Vendedor
CREATE TABLE IF NOT EXISTS Vendedor (
    id_Vendedor INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    senha VARCHAR(255) NOT null,
    confirmarSenha VARCHAR(255) NOT null,
    telefone INT,
    BI VARCHAR(14) unique,
    tipo_de_Produto VARCHAR(255),
    endereco VARCHAR(255)
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

);

select * from Vendedor;
ALTER TABLE Vendedor
ADD CONSTRAINT uk_BI UNIQUE (BI);
-- Tabela Produto
CREATE TABLE IF NOT EXISTS Produto1 (
    id_produto INT AUTO_INCREMENT PRIMARY KEY,
	nome_produto VARCHAR(255),
    descricao TEXT,
    preco DECIMAL(10, 2),
    imagem_produto VARCHAR(255),
	email varchar(255),
    id_vendedor INT,
    FOREIGN KEY (id_Vendedor) REFERENCES Vendedor(id_Vendedor),
    quantidade int
    FOREIGN KEY (id_vendedor) REFERENCES Vendedor(id_vendedor) ON DELETE CASCADE;
	data TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,


);

CREATE TABLE IF NOT EXISTS Comentario (
    id_comentario INT AUTO_INCREMENT PRIMARY KEY,
    email_Emissor VARCHAR(255),
    texto varchar(255),
    id_cliente INT,
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente)
);
CREATE TABLE IF NOT EXISTS AdicionarSlide (
    id_Slide INT AUTO_INCREMENT PRIMARY KEY,
    caminho_imagem VARCHAR(255)
	id_adm INT,
    email_Admin VARCHAR(255),
    FOREIGN KEY (id_adm) REFERENCES Administrador(id_adm)
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

);
CREATE TABLE IF NOT EXISTS Administrador (
    id_adm INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    senha VARCHAR(255) NOT null,
    confirmarSenha VARCHAR(255) NOT null,
    endereco VARCHAR(255)
   data TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

);
CREATE TABLE IF NOT EXISTS Publicacao(
    id_Publicacao INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255),
    texto VARCHAR(255),
    id_adm INT,
    email_Admin VARCHAR(255),
    FOREIGN KEY (id_adm) REFERENCES Administrador(id_adm)
        data TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

);
CREATE TABLE IF NOT EXISTS Carrinho (
    id_Carrinho INT AUTO_INCREMENT PRIMARY KEY,
    nome_produto VARCHAR(255),
    quantidade INT,
    caminho_imagem VARCHAR(255),
    id_produto INT,
    email VARCHAR(255)
    FOREIGN KEY (id_produto) REFERENCES Produto1(id_produto) ON DELETE CASCADE,
     preco DOUBLE,
     quantidade_Estoque int
);  
CREATE TABLE IF NOT EXISTS Historico_venda (
    id_Historico_venda INT AUTO_INCREMENT PRIMARY KEY,
    nome_produto VARCHAR(255),
    quantidade INT,
    caminho_imagem VARCHAR(255),
    email_Vendedor VARCHAR(255),
    email_Comprador VARCHAR(255),
    id_vendedor INT,
    preco DECIMAL(10, 2),
    caminho_Comprovativo VARCHAR(255),
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_vendedor) REFERENCES Vendedor(id_vendedor) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS Historico_Compra (
    id_Historico_Compra INT AUTO_INCREMENT PRIMARY KEY,
    nome_produto VARCHAR(255),
    quantidade INT,
    caminho_imagem VARCHAR(255),
    email_Comprador VARCHAR(255),
     email_Vendedor VARCHAR(255),
    id_cliente INT,
    preco DECIMAL(10, 2),
    estado_compra  VARCHAR(255);
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS Mensalidade(
	id_mensalidade INT AUTO_INCREMENT PRIMARY KEY,
    email_vendedor VARCHAR(255),
    id_Vendedor INT,
    caminho_Comprovativo VARCHAR(255),
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMEST
        FOREIGN KEY (id_Vendedor) REFERENCES Vendedor(id_Vendedor) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS Historico_Compra_Vendedor (
    id_Historico_Compra INT AUTO_INCREMENT PRIMARY KEY,
    nome_produto VARCHAR(255),
    quantidade INT,
    caminho_imagem VARCHAR(255),
    email_Comprador VARCHAR(255),
     email_Vendedor VARCHAR(255),
    id_cliente INT,
    preco DECIMAL(10, 2),
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente) ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS Foto_Perfil (
    id_Foto INT AUTO_INCREMENT PRIMARY KEY,
    caminho_imagem VARCHAR(255),
    email VARCHAR(255),
    id_cliente INT,
    id_Vendedor INT,
    id_adm INT,
    data TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente) ON DELETE CASCADE,
    FOREIGN KEY (id_adm) REFERENCES Administrador(id_adm) ON DELETE CASCADE,
    FOREIGN KEY (id_Vendedor) REFERENCES Vendedor(id_Vendedor) ON DELETE CASCADE
);


