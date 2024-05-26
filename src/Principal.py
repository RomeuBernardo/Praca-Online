from flask import Flask, render_template, redirect, request, flash, jsonify, session
import base64
import datetime
from datetime import timedelta 
import jwt ,hashlib
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity,create_refresh_token
from werkzeug.utils import secure_filename
import mysql.connector
import os
#import uuid

from flask_cors import CORS
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
CORS(app, origins='*')  # Permitir todas as origens
CORS(app, origins='http://localhost:3000')
CORS(app)

app.secret_key = 'romeu'
from werkzeug.utils import secure_filename
# Configuração do JWTManager
app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'
jwt = JWTManager(app)
getemail = None
getid = None
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
def hash_password(password):
    hashed_password = hashlib.sha256(password.encode()).hexdigest()
    return hashed_password





# Rota para receber o email do usuário
#@app.route('/enviarEmailUsuario', methods=['POST'])
def enviar_email_usuario(email):
    # Recebe os dados JSON da requisição
    print("ASWWWWWWW", email)
    # Aqui você pode adicionar a lógica para enviar o email, por exemplo, usando uma biblioteca como Flask-Mail
    # Exemplo de envio de email usando Flask-Mail:
    # from flask_mail import Mail, Message
    # mail = Mail(app)
    # msg = Message('Assunto do Email', recipients=[email])
    # msg.body = 'Corpo do Email'
    # mail.send(msg)
    return email
    # Responde ao cliente com uma mensagem de sucesso
   
# Função para cadastrar um novo vendedor
@app.route('/CadastrarVendedor', methods=['POST'])
def CadastrarVendedor():
    try:
        dados = request.get_json()
        nomeEmpresa = dados['nomeEmpresa']  # Mudança de 'nome' para 'nomeEmpresa'
        senha = dados['senha']  # Mudança de 'password' para 'senha'
        email = dados['email']
        passconfirmation = dados['confirmarSenha']  # Mudança de 'passconfirmation' para 'confirmarSenha'
        telefone = dados['telefone']  # Adicionado campo telefone
        BI = dados['numeroBI']  # Adicionado campo numeroBI
        tipo_de_Produto = dados['tipoProduto']  # Adicionado campo tipoProduto
        endereco = dados['endereco']

        conect_BD = mysql.connector.connect(
            host='localhost', database='Praca_Online', user='root', password='romeu2001'
        )

        if conect_BD.is_connected():
            cursor = conect_BD.cursor()
            
            # Verificar se o email já está cadastrado como cliente
            cursor.execute('SELECT * FROM Cliente WHERE email = %s', (email,))
            clienteBD = cursor.fetchall()
            if clienteBD:
                return jsonify({'success': False, 'message': f'O E-mail {email} já está cadastrado como cliente. Escolha outro email.'})
            # Verificar se o email já está cadastrado como vendedor
            cursor.execute('SELECT * FROM Vendedor WHERE email = %s', (email,))
            vendedorBD = cursor.fetchall()
            if vendedorBD:
                return jsonify({'success': False, 'message': f'O E-mail {email} já está cadastrado como vendedor. Escolha outro email.'})
              # Verificar se o BI já está cadastrado como vendedor
            cursor.execute('SELECT * FROM Vendedor WHERE BI = %s', (BI,))
            if cursor.fetchone():
                return jsonify({'success': False, 'message': f'O BI {BI} já está cadastrado. Escolha outro BI.'})
            # Se o email não estiver em nenhuma das tabelas, proceda com o cadastro
            cursor.execute("INSERT INTO Vendedor (nome, email, senha, confirmarSenha, telefone, BI, tipo_de_Produto, endereco) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                            (nomeEmpresa, email, hash_password(senha),hash_password(passconfirmation), telefone, BI, tipo_de_Produto, endereco))
            conect_BD.commit()
            print("mAAAAAAAAAAAAAAAh")

            return jsonify({'success': True, 'message': f'{nomeEmpresa} cadastrado com sucesso como vendedor.'})
        else:
            return jsonify({'success': False, 'message': 'Erro de conexão ao banco de dados'})
    except mysql.connector.Error as err:
        return jsonify({'success': False, 'message': 'Erro ao conectar ao banco de dados', 'error': str(err)})
    except Exception as e:
        return jsonify({'success': False, 'message': 'Erro ao cadastrar vendedor. Por favor, tente novamente.', 'error': str(e)})
    finally:
        if 'conect_BD' in locals() and conect_BD.is_connected():
            cursor.close()
            conect_BD.close()


# Função para cadastrar um novo cliente
@app.route('/CadastrarCliente', methods=['POST'])
def CadastrarCliente():
    try:
        dados = request.get_json()
        dados = request.get_json()
        nome = dados['nome']
        senha = dados['password']
        email = dados['email']
        passconfirmation = dados['passconfirmation']  # Ajuste aqui
        endereco = dados['endereco']
    
        print("AAAAAAAAAAAAAAAAAAAAAAAA")

        conect_BD = mysql.connector.connect(
            host='localhost', database='Praca_Online', user='root', password='romeu2001'
        )

        if conect_BD.is_connected():
            cursor = conect_BD.cursor()
            
            # Verificar se o email já está cadastrado como vendedor
            cursor.execute('SELECT * FROM Vendedor  WHERE email = %s', (email,))
            vendedorBD = cursor.fetchall()
            if vendedorBD:
                return jsonify({'success': False, 'message': f'O E-mail {email} já está cadastrado como vendedor. Escolha outro email.'})
           
            # Verificar se o email já está cadastrado como cliente
            cursor.execute('SELECT * FROM Cliente WHERE email = %s', (email,))
            clienteBD = cursor.fetchall()
            if clienteBD:
                return jsonify({'success': False, 'message': f'O E-mail {email} já está cadastrado como cliente. Escolha outro email.'})
            # Se o email não estiver em nenhuma das tabelas, proceda com o cadastro
            cursor.execute("INSERT INTO Cliente (nome, email, senha, confirmarSenha, endereco) VALUES (%s, %s, %s, %s, %s)",
                            (nome, email,  hash_password(senha), hash_password(passconfirmation) , endereco))
            conect_BD.commit()

            return jsonify({'success': True, 'message': f'{nome} cadastrado com sucesso como cliente.'})
        else:
            return jsonify({'success': False, 'message': 'Erro de conexão ao banco de dados'})
    except mysql.connector.Error as err:
        return jsonify({'success': False, 'message': 'Erro ao conectar ao banco de dados', 'error': str(err)})
    except Exception as e:
        return jsonify({'success': False, 'message': 'Erro ao cadastrar cliente. Por favor, tente novamente.', 'error': str(e)})
    finally:
        if 'conect_BD' in locals() and conect_BD.is_connected():
            cursor.close()
            conect_BD.close()


            
# Função para cadastrar um novo Administrador
@app.route('/CadastrarAdmin', methods=['POST'])
def CadastrarAdmin():
    try:
        dados = request.get_json()
        dados = request.get_json()
        nome = dados['nome']
        senha = dados['password']
        email = dados['email']
        passconfirmation = dados['passconfirmation']  # Ajuste aqui
        endereco = dados['endereco']

        print("AAAAAAAAAAAAAAAAAAAAAAAA")

        conect_BD = mysql.connector.connect(
            host='localhost', database='Praca_Online', user='root', password='romeu2001'
        )

        if conect_BD.is_connected():
            cursor = conect_BD.cursor()
            
            # Verificar se o email já está cadastrado como vendedor
            cursor.execute('SELECT * FROM Vendedor  WHERE email = %s', (email,))
            vendedorBD = cursor.fetchall()
            if vendedorBD:
                return jsonify({'success': False, 'message': f'O E-mail {email} já  existe. Escolha outro email.'})
            # Verificar se o email já está cadastrado como Cliente
            cursor.execute('SELECT * FROM Cliente  WHERE email = %s', (email,))
            vendedorBD = cursor.fetchall()
            if vendedorBD:
                return jsonify({'success': False, 'message': f'O E-mail {email} já  existe. Escolha outro email.'})
           
            # Verificar se o email já está cadastrado como cliente
            cursor.execute('SELECT * FROM Administrador WHERE email = %s', (email,))
            clienteBD = cursor.fetchall()
            if clienteBD:
                return jsonify({'success': False, 'message': f'O E-mail {email} já  existe . Escolha outro email.'})
            # Se o email não estiver em nenhuma das tabelas, proceda com o cadastro
            cursor.execute("INSERT INTO Administrador (nome, email, senha, confirmarSenha, endereco) VALUES (%s, %s, %s, %s, %s)",
                            (nome, email, hash_password(senha), hash_password(passconfirmation) , endereco))
            conect_BD.commit()

            return jsonify({'success': True, 'message': f'{email} cadastrado com sucesso .'})
        else:
            return jsonify({'success': False, 'message': 'Erro de conexão ao banco de dados'})
    except mysql.connector.Error as err:
        return jsonify({'success': False, 'message': 'Erro ao conectar ao banco de dados', 'error': str(err)})
    except Exception as e:
        return jsonify({'success': False, 'message': 'Erro ao cadastrar cliente. Por favor, tente novamente.', 'error': str(e)})
    finally:
        if 'conect_BD' in locals() and conect_BD.is_connected():
            cursor.close()
            conect_BD.close()
# Function to perform login
@app.route('/login', methods=['POST'])
def efetuar_login():
    
    dados = request.get_json()
    
    email = dados['email']
    senha = dados['senha']
    senha = hash_password(senha)
    global getemail
    global getid
    try:
        conect_BD = mysql.connector.connect(
            host='localhost', database='Praca_Online', user='root', password='romeu2001'
        )
        cursor = conect_BD.cursor()
        
        # Verify if it's a client
        cursor.execute("SELECT * FROM Cliente WHERE email = %s", (email,))
        cliente = cursor.fetchone()
        
       
        if cliente:
            cliente_email = cliente[2]
            cliente_senha = cliente[3]
            
            cliente_id = cliente[0]
            cliente_nome = cliente[1]

            if senha == cliente_senha and cliente_email == email:
                # Store client information in session
                
                session['email'] = request.json['email']
                
                user_data = {
                    'id': cliente[0],
                    'username': cliente[1],
                    'email': cliente[2],
                    'user_type': 'cliente'
                }
                
                print(session)
                getemail= cliente[2]
                getid = cliente[0]

                return jsonify({"session":session['email'], "user_data":user_data})

            else:
                return jsonify({'success': False, 'message': 'Senha Invalida ou email Invalido'})

        # Verify if it's a vendor
        cursor.execute("SELECT * FROM Vendedor WHERE email = %s", (email,))
        vendedor = cursor.fetchone()

        if vendedor:
            vendedor_email = vendedor[2]
            vendedor_senha = vendedor[3]
            vendedor_id = vendedor[0]
            vendedor_nome = vendedor[1]

            if senha == vendedor_senha and vendedor_email == email:
                # Store vendor information in session
                session['email'] = request.json['email']
                user_data = {
                    'id': vendedor[0],
                    'username': vendedor[1],
                    'email': vendedor[2],
                    'user_type': 'vendedor'
                }
                print("AAAANNNNNNN")
                print(session)

                getemail = vendedor[2]
                getid = vendedor[0]
                return jsonify({"session":session['email'], "user_data":user_data})
            
            else:
                return jsonify({'success': False, 'message': 'Senha Invalida ou email Invalido'})

        
        cursor.execute("SELECT * FROM Administrador WHERE email = %s", (email,))
        administrador = cursor.fetchone()

        if administrador:
            administrador_email = administrador[2]
            administrador_senha = administrador[3]
            administrador_id = administrador[0]
            administrador_nome = administrador[1]
            
            if senha == administrador_senha and administrador_email == email:
                # Store Admin information in session
               
                session['email'] = request.json['email']
                user_data = {
                    'id': administrador[0],
                    'username': administrador[1],
                    'email': administrador[2],
                    'user_type': 'admin'
                }
                print(session)

                getemail = administrador[2]
                getid = administrador[0]
                return jsonify({"session":session['email'], "user_data":user_data})
            else:
                return jsonify({'success': False, 'message': 'Senha Invalida ou email Invalido'})

    except Exception as e:
        return jsonify({'success': False, 'message': 'Database connection error', 'error': str(e)})

    finally:
        if conect_BD.is_connected():
            cursor.close()
            conect_BD.close()


@app.route('/mostraEmail', methods=['GET'])
def mostrar_email():
    try:
       # email = request.args.get('email')  # Obtém o email do parâmetro da consulta (query parameter)
        email = enviar_email_usuario()
        print(email)
        if email:
            # Se o email foi passado como parâmetro, você pode usá-lo diretamente
            print("Aqui está o email:", email)
            return jsonify({'success': True, 'email': email})
        else:
            return jsonify({'success': False, 'message': 'Nenhum email foi passado como parâmetro'})
    except Exception as e:
        return jsonify({'success': False, 'message': 'Erro ao obter email', 'error': str(e)})



# Função para finalizar a sessão do usuário
@app.route('/logout', methods=['GET'])
def finalizar_sessao():
    try:
        # Limpa as informações da sessão
        session.pop('id', None)
        session.pop('nome', None)
        session.pop('email', None)

        return jsonify({'success': True, 'message': 'Sessão finalizada com sucesso.'})
    except Exception as e:
        return jsonify({'success': False, 'message': 'Erro ao finalizar sessão.', 'error': str(e)})










@app.route('/Consultaclientes', methods=['GET'])
def ConsultarClientes():
    try:
        # Conectar ao banco de dados
        conect_BD = mysql.connector.connect(
            host='localhost',
            database='Praca_Online',
            user='root',
            password='romeu2001'
        )

        if conect_BD.is_connected():
            cursor = conect_BD.cursor()

            # Executar a consulta na tabela Cliente
            cursor.execute("SELECT * FROM Cliente")

            # Obter os resultados da consulta
            clientes = cursor.fetchall()

            # Montar a resposta em formato JSON
            response = [{'id': cliente[0], 'nome': cliente[1], 'email': cliente[2], 'endereco': cliente[4],'senha': cliente[4],} for cliente in clientes]
            print(response)
            return jsonify({'success': True, 'clientes': response})

    except Exception as e:
        return jsonify({'success': False, 'message': 'Erro ao consultar clientes.', 'error': str(e)})
    finally:
        # Fechar a conexão com o banco de dados
        if conect_BD.is_connected():
            cursor.close()
            conect_BD.close()


#################################

@app.route('/adicionar_produto', methods=['POST'])
def adicionar_produto():
    try:
        # Receber os dados do formulário
        name = request.form['name']
        description = request.form['description']
        price = request.form['price']
        quantity = request.form['quantity']        
       
        # Obter o caminho absoluto da pasta public
        pasta_public_absoluta = os.path.abspath(os.path.join(os.getcwd(), '..', 'public'))

        # Salvar a imagem enviada pelo formulário na pasta public
        image_file = request.files['image']
        if image_file:
            # Gerar um nome único para o arquivo de imagem
            nome_arquivo = secure_filename(image_file.filename)
            caminho_imagem_absoluto = os.path.join(pasta_public_absoluta, nome_arquivo)
            # Salvar a imagem no caminho absoluto
            image_file.save(caminho_imagem_absoluto)
            # Obter o caminho relativo da imagem em relação à pasta public
            caminho_imagem_relativo = os.path.join('/', nome_arquivo)
        else:
            caminho_imagem_relativo = None

        # Obter o ID do vendedor da sessão
        global  getemail

        vendedor_Email = getemail
        print("YYYYYYYYYYYY",vendedor_Email)
        # Conectar ao banco de dados
        connection = mysql.connector.connect(
            host='localhost',
            database='Praca_Online',
            user='root',
            password='romeu2001'
        )
        
        # Criar um cursor para executar consultas SQL
        cursor = connection.cursor()

        # Consulta para obter o e-mail do vendedor
        if vendedor_Email:
            email = vendedor_Email
        else:
            return jsonify({'success': False, 'message': 'Vendedor não encontrado'})
        print("AAAAAAAAAAAAKKKKKK",vendedor_Email)

        cursor.execute("SELECT id_Vendedor FROM Vendedor WHERE email = %s", (email,))
        vendedor_id = cursor.fetchone()
        connection.commit()
        print("CGHHHHHHHJJJ")
        if vendedor_id:
        
            # Inserir os dados na tabela Produto, incluindo o caminho da imagem
            cursor.execute("INSERT INTO Produto1 (nome_produto, descricao, preco, imagem_produto, email, id_vendedor,quantidade) VALUES (%s, %s, %s, %s, %s, %s, %s)",
                        (name, description, price, caminho_imagem_relativo, email, vendedor_id[0],quantity))
            
            # Confirmar a inserção
            connection.commit()
        
        # Fechar o cursor e a conexão
        cursor.close()
        connection.close()

        return jsonify({
            'success': True,
            'message': 'Produto adicionado com sucesso'
        })
    except mysql.connector.Error as err:
        return jsonify({'success': False, 'message': f'Erro ao adicionar produto: {err}'})

# Rota para carregar os dados básicos dos produtos
@app.route('/carregar_dados_produto', methods=['GET'])
def carregar_dados_produto():
    try:
        # Conectar ao banco de dados
        connection = mysql.connector.connect(
            host='localhost',
            database='Praca_Online',
            user='root',
            password='romeu2001'
        )
        
        # Criar um cursor para executar consultas SQL
        cursor = connection.cursor()
        
        # Consulta para buscar os dados do produto
        cursor.execute("SELECT nome_produto, descricao, preco, imagem_produto,email,id_produto,quantidade FROM Produto1")
        produtos = []
        for produto_result in cursor.fetchall():
            nome_produto, descricao, preco, imagem_produto ,email,id_produto, quantidade = produto_result
            produto = {
                'nome_produto': nome_produto,
                'descricao': descricao,
                'preco': preco,
                'imagem_produto': imagem_produto,
                 'email': email,
                'id_produto':id_produto,
                'quantidade': quantidade
               
            }   
            produtos.append(produto)

        if produtos:
            return jsonify({'success': True, 'data': produtos})
        else:
            return jsonify({'success': False, 'message': 'Nenhum produto encontrado'})

    except mysql.connector.Error as err:
        return jsonify({'success': False, 'message': f'Erro ao carregar dados do produto: {err}'})

    finally:
        # Fechar o cursor e a conexão
        cursor.close()
        connection.close()

# Função para listar todos os vendedores cadastrados
@app.route('/ListarVendedores', methods=['GET'])
def ListarVendedores():
    try:
        # Conectar ao banco de dados
        connection = mysql.connector.connect(
            host='localhost',
            database='Praca_Online',
            user='root',
            password='romeu2001'
        )

        # Verificar se a conexão foi estabelecida com sucesso
        if connection.is_connected():
            # Criar um cursor para executar consultas SQL
            cursor = connection.cursor(dictionary=True)
            # Consulta para buscar todos os dados dos vendedores
            cursor.execute("SELECT * FROM Vendedor")
            vendedores = cursor.fetchall()
            # Verificar se há vendedores cadastrados
            if vendedores:
                # Retornar a lista de vendedores em formato JSON
                return jsonify({'success': True, 'vendedores': vendedores})
            else:
                # Se não houver vendedores cadastrados, retornar uma mensagem de erro
                return jsonify({'success': False, 'message': 'Nenhum vendedor encontrado'})
        else:
            # Se a conexão não foi estabelecida com sucesso, retornar uma mensagem de erro
            return jsonify({'success': False, 'message': 'Erro de conexão ao banco de dados'})

    except mysql.connector.Error as err:
        # Em caso de erro ao executar a consulta SQL, retornar uma mensagem de erro
        return jsonify({'success': False, 'message': f'Erro ao listar vendedores: {err}'})

    finally:
        # Fechar o cursor e a conexão com o banco de dados
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/removerVendedor', methods=['POST'])
def removerVendedor():
    try:
        dados = request.get_json()
        id_Vendedor = dados['id_Vendedor']

        # Conectar ao banco de dados
        conect_BD = mysql.connector.connect(
            host='localhost', database='Praca_Online', user='root', password='romeu2001'
        )

        if conect_BD.is_connected():
            cursor = conect_BD.cursor()

            # Passo 1: Remover as entradas relacionadas na tabela 'carrinho'
            cursor.execute('DELETE FROM carrinho WHERE id_produto IN (SELECT id_produto FROM Produto1 WHERE id_vendedor = %s)', (id_Vendedor,))
            conect_BD.commit()

            # Passo 2: Remover os produtos associados ao vendedor
            cursor.execute('DELETE FROM Produto1 WHERE id_vendedor = %s', (id_Vendedor,))
            conect_BD.commit()

            # Passo 3: Remover o vendedor
            cursor.execute('DELETE FROM Vendedor WHERE id_Vendedor = %s', (id_Vendedor,))
            conect_BD.commit()

            return jsonify({'success': True, 'message': 'Vendedor e produtos associados removidos com sucesso.'})
        else:
            return jsonify({'success': False, 'message': 'Erro de conexão ao banco de dados'})
    except mysql.connector.Error as err:
        return jsonify({'success': False, 'message': 'Erro ao conectar ao banco de dados', 'error': str(err)})
    except Exception as e:
        return jsonify({'success': False, 'message': 'Erro ao remover Vendedor. Por favor, tente novamente.', 'error': str(e)})
    finally:
        if 'conect_BD' in locals() and conect_BD.is_connected():
            cursor.close()
            conect_BD.close()

#Funcao para editar vendedores 
@app.route('/editarVendedor', methods=['POST'])
def editarUsuario():
    try:
        dados = request.get_json()
        id_Vendedor = dados['id_Vendedor']
        novoNome = dados['nome']
        novoEmail = dados['email']
        novoTelefone = dados['telefone']
        novoBI = dados['BI']
        novoTipoDeProduto = dados['tipo_de_Produto']
        novoEndereco = dados['endereco']
        senha = dados['senha']
        confirmarSenha = dados['confirmarSenha']
        conect_BD = mysql.connector.connect(
            host='localhost', database='Praca_Online', user='root', password='romeu2001'
        )

        if conect_BD.is_connected():
            cursor = conect_BD.cursor()

            # Verificar se o usuário existe
            cursor.execute('SELECT * FROM Vendedor WHERE id_Vendedor = %s', (id_Vendedor,))
            usuario = cursor.fetchone()
            if not usuario:
                return jsonify({'success': False, 'message': 'Vendedor não encontrado.'})

            # Atualizar os dados do usuário
            cursor.execute('UPDATE Vendedor SET nome = %s, email = %s, telefone = %s, BI = %s, tipo_de_Produto = %s, endereco = %s, senha = %s, confirmarSenha = %s WHERE id_Vendedor = %s',
                           (novoNome, novoEmail, novoTelefone, novoBI, novoTipoDeProduto, novoEndereco, senha, confirmarSenha, id_Vendedor))
            conect_BD.commit()

            return jsonify({'success': True, 'message': 'Vendedor atualizado com sucesso.'})
        else:
            return jsonify({'success': False, 'message': 'Erro de conexão ao banco de dados'})
    except mysql.connector.Error as err:
        return jsonify({'success': False, 'message': 'Erro ao conectar ao banco de dados', 'error': str(err)})
    except Exception as e:
        return jsonify({'success': False, 'message': 'Erro ao editar Vendedor. Por favor, tente novamente.', 'error': str(e)})
    finally:
        if 'conect_BD' in locals() and conect_BD.is_connected():
            cursor.close()
            conect_BD.close()









########Cliente##
# Função para listar todos os clientes cadastrados
@app.route('/ListarClientes', methods=['GET'])
def ListarClientes():
    try:
        # Conectar ao banco de dados
        connection = mysql.connector.connect(
            host='localhost',
            database='Praca_Online',
            user='root',
            password='romeu2001'
        )

        # Verificar se a conexão foi estabelecida com sucesso
        if connection.is_connected():
            # Criar um cursor para executar consultas SQL
            cursor = connection.cursor(dictionary=True)
            # Consulta para buscar todos os dados dos clientes
            cursor.execute("SELECT * FROM Cliente")
            clientes = cursor.fetchall()
            # Verificar se há clientes cadastrados
            if clientes:
                # Retornar a lista de clientes em formato JSON
                return jsonify({'success': True, 'clientes': clientes})
            else:
                # Se não houver clientes cadastrados, retornar uma mensagem de erro
                return jsonify({'success': False, 'message': 'Nenhum cliente encontrado'})
        else:
            # Se a conexão não foi estabelecida com sucesso, retornar uma mensagem de erro
            return jsonify({'success': False, 'message': 'Erro de conexão ao banco de dados'})

    except mysql.connector.Error as err:
        # Em caso de erro ao executar a consulta SQL, retornar uma mensagem de erro
        return jsonify({'success': False, 'message': f'Erro ao listar clientes: {err}'})

    finally:
        # Fechar o cursor e a conexão com o banco de dados
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

# Função para remover um cliente
@app.route('/removerCliente', methods=['POST'])
def removerCliente():
    try:
        dados = request.get_json()
        id_cliente = dados['id_cliente']

        conect_BD = mysql.connector.connect(
            host='localhost', database='Praca_Online', user='root', password='romeu2001'
        )

        if conect_BD.is_connected():
            cursor = conect_BD.cursor()

            # Verificar se o cliente existe
            cursor.execute('SELECT * FROM Cliente WHERE id_cliente = %s', (id_cliente,))
            cliente = cursor.fetchone()
            if not cliente:
                return jsonify({'success': False, 'message': 'Cliente não encontrado.'})

            # Remover o cliente
            cursor.execute('DELETE FROM Cliente WHERE id_cliente = %s', (id_cliente,))
            conect_BD.commit()

            return jsonify({'success': True, 'message': 'Cliente removido com sucesso.'})
        else:
            return jsonify({'success': False, 'message': 'Erro de conexão ao banco de dados'})
    except mysql.connector.Error as err:
        return jsonify({'success': False, 'message': 'Erro ao conectar ao banco de dados', 'error': str(err)})
    except Exception as e:
        return jsonify({'success': False, 'message': 'Erro ao remover cliente. Por favor, tente novamente.', 'error': str(e)})
    finally:
        if 'conect_BD' in locals() and conect_BD.is_connected():
            cursor.close()
            conect_BD.close()

# Função para editar clientes
@app.route('/editarCliente', methods=['POST'])
def editarCliente():
    try:
        dados = request.get_json()
        novoNome = dados['nome']
        novoEmail = dados['email']
        novoEndereco = dados['endereco']
        senha = dados['senha']
        confirmarSenha = dados['confirmarSenha']
        id_cliente = dados['id_cliente']
        print("dadossssssssssssss",senha,novoEmail,novoEndereco,confirmarSenha)

        conect_BD = mysql.connector.connect(
            host='localhost', database='Praca_Online', user='root', password='romeu2001'
        )

        if conect_BD.is_connected():
            cursor = conect_BD.cursor()

            # Verificar se o cliente existe
            cursor.execute('SELECT * FROM Cliente WHERE id_cliente = %s', (id_cliente,))
            cliente = cursor.fetchone()
            if not cliente:
                return jsonify({'success': False, 'message': 'Cliente não encontrado.'})

            # Atualizar os dados do cliente
            cursor.execute('UPDATE Cliente SET nome = %s, email = %s, endereco = %s, senha = %s, confirmarSenha = %s WHERE id_cliente = %s',
                           (novoNome, novoEmail,novoEndereco, senha, confirmarSenha, id_cliente))
            conect_BD.commit()

            return jsonify({'success': True, 'message': 'Cliente atualizado com sucesso.'})
        else:
            return jsonify({'success': False, 'message': 'Erro de conexão ao banco de dados'})
    except mysql.connector.Error as err:
        return jsonify({'success': False, 'message': 'Erro ao conectar ao banco de dados', 'error': str(err)})
    except Exception as e:
        return jsonify({'success': False, 'message': 'Erro ao editar cliente. Por favor, tente novamente.', 'error': str(e)})
    finally:
        if 'conect_BD' in locals() and conect_BD.is_connected():
            cursor.close()
            conect_BD.close()

#Funcoes para o CRUD dos Produtos

# Função para listar todos os produtos cadastrados
@app.route('/ListarProdutos', methods=['GET'])
def ListarProdutos():
    try:
        global getemail
        email = getemail
        # Conectar ao banco de dados
        connection = mysql.connector.connect(
            host='localhost',
            database='Praca_Online',
            user='root',
            password='romeu2001'
        )

        # Verificar se a conexão foi estabelecida com sucesso
        if connection.is_connected():
            # Criar um cursor para executar consultas SQL
            cursor = connection.cursor(dictionary=True)
            # Consulta para buscar todos os dados dos produtos
            cursor.execute("SELECT * FROM Produto1")
            produtos = cursor.fetchall()
            # Verificar se há produtos cadastrados
            if produtos:
                # Retornar a lista de produtos em formato JSON
                return jsonify({'success': True, 'produtos': produtos})
            else:
                # Se não houver produtos cadastrados, retornar uma mensagem de erro
                return jsonify({'success': False, 'message': 'Nenhum produto encontrado'})
        else:
            # Se a conexão não foi estabelecida com sucesso, retornar uma mensagem de erro
            return jsonify({'success': False, 'message': 'Erro de conexão ao banco de dados'})

    except mysql.connector.Error as err:
        # Em caso de erro ao executar a consulta SQL, retornar uma mensagem de erro
        return jsonify({'success': False, 'message': f'Erro ao listar produtos: {err}'})

    finally:
        # Fechar o cursor e a conexão com o banco de dados
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()


# Função para listar todos os produtos cadastrados
@app.route('/ListarProdutosVendedor', methods=['GET'])
def ListarProdutosPP():
    try:
        global getemail
        email = getemail
        # Conectar ao banco de dados
        connection = mysql.connector.connect(
            host='localhost',
            database='Praca_Online',
            user='root',
            password='romeu2001'
        )

        # Verificar se a conexão foi estabelecida com sucesso
        if connection.is_connected():
            # Criar um cursor para executar consultas SQL
            cursor = connection.cursor(dictionary=True)
            # Consulta para buscar todos os dados dos produtos
            
            cursor.execute("SELECT * FROM Produto1 WHERE email = %s ", (email,))
            produtos = cursor.fetchall()
            # Verificar se há produtos cadastrados
            if produtos:
                # Retornar a lista de produtos em formato JSON
                print("AAAANNbbbSIOIOI")
                return jsonify({'success': True, 'produtos': produtos})
            else:
                # Se não houver produtos cadastrados, retornar uma mensagem de erro
                return jsonify({'success': False, 'message': 'Nenhum produto encontrado'})
        else:
            # Se a conexão não foi estabelecida com sucesso, retornar uma mensagem de erro
            return jsonify({'success': False, 'message': 'Erro de conexão ao banco de dados'})

    except mysql.connector.Error as err:
        # Em caso de erro ao executar a consulta SQL, retornar uma mensagem de erro
        return jsonify({'success': False, 'message': f'Erro ao listar produtos: {err}'})

    finally:
        # Fechar o cursor e a conexão com o banco de dados
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()




# Função para remover um produto
@app.route('/removerProduto', methods=['POST'])
def removerProduto():
    try:
        dados = request.get_json()
        id_produto = dados['id_produto']

        conect_BD = mysql.connector.connect(
            host='localhost', database='Praca_Online', user='root', password='romeu2001'
        )

        if conect_BD.is_connected():
            cursor = conect_BD.cursor()

            # Verificar se o produto existe
            cursor.execute('SELECT * FROM Produto1 WHERE id_produto = %s', (id_produto,))
            produto = cursor.fetchone()
            if not produto:
                return jsonify({'success': False, 'message': 'Produto não encontrado.'})

            # Remover o produto
            cursor.execute('DELETE FROM Produto1 WHERE id_produto = %s', (id_produto,))
            conect_BD.commit()

            return jsonify({'success': True, 'message': 'Produto removido com sucesso.'})
        else:
            return jsonify({'success': False, 'message': 'Erro de conexão ao banco de dados'})
    except mysql.connector.Error as err:
        return jsonify({'success': False, 'message': 'Erro ao conectar ao banco de dados', 'error': str(err)})
    except Exception as e:
        return jsonify({'success': False, 'message': 'Erro ao remover produto. Por favor, tente novamente.', 'error': str(e)})
    finally:
        if 'conect_BD' in locals() and conect_BD.is_connected():
            cursor.close()
            conect_BD.close()

# Função para editar produtos
@app.route('/editarProduto', methods=['POST'])
def editarProduto():
    try:
        dados = request.get_json()
        novoNomeProduto = dados['nome_produto']
        novaDescricao = dados['descricao']
        novoPreco = dados['preco']
        novaImagemProduto = dados['imagem_produto']
        novoEmailVendedor = dados['email']
        id_produto = dados['id_produto']
        editar_quantidade = dados['quantidade']
        print("ASS",editar_quantidade)
        conect_BD = mysql.connector.connect(
            host='localhost', database='Praca_Online', user='root', password='romeu2001'
        )

        if conect_BD.is_connected():
            cursor = conect_BD.cursor()

            # Verificar se o produto existe
            cursor.execute('SELECT * FROM Produto1 WHERE id_produto = %s', (id_produto,))
            produto = cursor.fetchone()
            if not produto:
                return jsonify({'success': False, 'message': 'Produto não encontrado.'})
            # Atualizar os dados do produto
            cursor.execute('UPDATE Produto1 SET nome_produto = %s, descricao = %s, preco = %s, imagem_produto = %s, email = %s, quantidade = %s WHERE id_produto = %s',
                           (novoNomeProduto, novaDescricao, novoPreco, novaImagemProduto, novoEmailVendedor,editar_quantidade,id_produto))
            conect_BD.commit()
            return jsonify({'success': True, 'message': 'Produto atualizado com sucesso.'})
        else:
            return jsonify({'success': False, 'message': 'Erro de conexão ao banco de dados'})
    except mysql.connector.Error as err:
        return jsonify({'success': False, 'message': 'Erro ao conectar ao banco de dados', 'error': str(err)})
    except Exception as e:
        return jsonify({'success': False, 'message': 'Erro ao editar produto. Por favor, tente novamente.', 'error': str(e)})
    finally:
        if 'conect_BD' in locals() and conect_BD.is_connected():
            cursor.close()
            conect_BD.close()

#######Trabalhar o Slider ########

@app.route('/adicionar_imagem_slide', methods=['POST'])
def adicionar_imagem_slide():
    try:
        # Salvar a imagem enviada pelo formulário na pasta public
        image_file = request.files['image']
       
        if image_file:
            # Gerar um nome único para o arquivo de imagem
            nome_arquivo = secure_filename(image_file.filename)
            # Obter o caminho absoluto da pasta public
            pasta_public_absoluta = os.path.abspath(os.path.join(os.getcwd(), '..', 'public'))
            # Garantir que a pasta de uploader exista dentro da pasta public, se não, criá-la
            pasta_uploader_absoluta = os.path.join(pasta_public_absoluta, UPLOAD_FOLDER)
            os.makedirs(pasta_uploader_absoluta, exist_ok=True)
            caminho_imagem_absoluto = os.path.join(pasta_uploader_absoluta, nome_arquivo)
            # Salvar a imagem no caminho absoluto
            image_file.save(caminho_imagem_absoluto)
            # Obter o caminho relativo da imagem em relação à pasta public
            caminho_imagem_relativo = os.path.join('/', UPLOAD_FOLDER, nome_arquivo)
        else:
            return jsonify({'success': False, 'message': 'Nenhuma imagem recebida'})

        # Conectar ao banco de dados
        connection = mysql.connector.connect(
            host='localhost',
            database='Praca_Online',
            user='root',
            password='romeu2001'
        )
        global  getemail
        email_Admin = getemail
        # Criar um cursor para executar consultas SQL
        cursor = connection.cursor()
        cursor.execute("SELECT id_adm FROM Administrador WHERE email = %s",(email_Admin,))
        id_adm = cursor.fetchone()
        if(id_adm):
            # Inserir o caminho da imagem na tabela AdicionarSlide
            cursor.execute("INSERT INTO AdicionarSlide (caminho_imagem, id_adm, email_Admin) VALUES (%s, %s, %s)", (caminho_imagem_relativo, id_adm[0], email_Admin))
             # Confirmar a inserção
            connection.commit()
            return jsonify({
            'success': True,
            'message': 'Imagem adicionada com sucesso'
             })
        else:
            return jsonify({
            'success': False,
            'message': 'Erro ao Adicionar'
             })
        # Fechar o cursor e a conexão
        

       
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro ao adicionar imagem: {str(e)}'})
#Carregar  Slide
@app.route('/carregar_slides', methods=['GET'])
def carregar_slides():
    try:
        # Conectar ao banco de dados
        connection = mysql.connector.connect(
                       host='localhost', database='Praca_Online', user='root', password='romeu2001'

        )

        # Criar um cursor para executar consultas SQL
        cursor = connection.cursor()

        # Consulta para obter os caminhos das imagens dos slides
        cursor.execute("SELECT caminho_imagem FROM AdicionarSlide")

        # Recuperar os caminhos das imagens dos slides
        slides = [slide[0] for slide in cursor.fetchall()]

        # Fechar o cursor e a conexão
        cursor.close()
        connection.close()

        return jsonify({
            'success': True,
            'slides': slides
        })
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro ao carregar slides: {str(e)}'})




# Função para remover uma imagem
@app.route('/removerSlide', methods=['POST'])
def removerSlide():
    try:
        dados = request.get_json()
        id_Slide = dados['id_Slide']

        conect_BD = mysql.connector.connect(
            host='localhost', database='Praca_Online', user='root', password='romeu2001'
        )

        if conect_BD.is_connected():
            cursor = conect_BD.cursor()

            # Verificar se o slide existe
            cursor.execute('SELECT * FROM AdicionarSlide  WHERE id_Slide = %s', (id_Slide,))
            image = cursor.fetchone()
            if not image:
                return jsonify({'success': False, 'message': 'Imagem não encontrada.'})

            # Remover o slide
            cursor.execute('DELETE FROM AdicionarSlide  WHERE id_Slide = %s', (id_Slide,))
            conect_BD.commit()

            return jsonify({'success': True, 'message': 'Imagem removida com sucesso.'})
        else:
            return jsonify({'success': False, 'message': 'Erro de conexão ao banco de dados'})
    except mysql.connector.Error as err:
        return jsonify({'success': False, 'message': 'Erro ao conectar ao banco de dados', 'error': str(err)})
    except Exception as e:
        return jsonify({'success': False, 'message': 'Erro ao remover imagem. Por favor, tente novamente.', 'error': str(e)})
    finally:
        if 'conect_BD' in locals() and conect_BD.is_connected():
            cursor.close()
            conect_BD.close()

# Função para editar imagem
@app.route('/editarSlide', methods=['POST'])
def editarSlide():
    try:
        dados = request.get_json()
        caminho_imagem = dados['caminho_imagem']
        id_Slide = dados['id_Slide']
        email_Admin = dados['email_Admin']
        conect_BD = mysql.connector.connect(
            host='localhost', database='Praca_Online', user='root', password='romeu2001'
        )

        if conect_BD.is_connected():
            cursor = conect_BD.cursor()

            # Verificar se o slide existe
            cursor.execute('SELECT * FROM AdicionarSlide WHERE id_Slide = %s', (id_Slide,))
            produto = cursor.fetchone()
            if not produto:
                return jsonify({'success': False, 'message': 'Imagem não encontrada.'})

            # Atualizar os dados do slide
            cursor.execute('UPDATE AdicionarSlide SET  caminho_imagem = %s,  email_Admin= %s WHERE id_Slide = %s',
                           (caminho_imagem, email_Admin, id_Slide))
            conect_BD.commit()

            return jsonify({'success': True, 'message': 'Imagem atualizada com sucesso.'})
        else:
            return jsonify({'success': False, 'message': 'Erro de conexão ao banco de dados'})
    except mysql.connector.Error as err:
        return jsonify({'success': False, 'message': 'Erro ao conectar ao banco de dados', 'error': str(err)})
    except Exception as e:
        return jsonify({'success': False, 'message': 'Erro ao editar imagem. Por favor, tente novamente.', 'error': str(e)})
    finally:
        if 'conect_BD' in locals() and conect_BD.is_connected():
            cursor.close()
            conect_BD.close()

# Função para listar todos os slides
@app.route('/ListarSlides', methods=['GET'])
def ListarSlides():
    try:
        # Conectar ao banco de dados
        connection = mysql.connector.connect(
            host='localhost',
            database='Praca_Online',
            user='root',
            password='romeu2001'
        )

        # Verificar se a conexão foi estabelecida com sucesso
        if connection.is_connected():
            # Criar um cursor para executar consultas SQL
            cursor = connection.cursor(dictionary=True)
            # Consulta para buscar todos os dados dos slides
            cursor.execute("SELECT * FROM AdicionarSlide")
            slides = cursor.fetchall()
            # Verificar se há slides cadastrados
            if slides:
                # Retornar a lista de slides em formato JSON
                return jsonify({'success': True, 'slides': slides})
            else:
                # Se não houver slides cadastrados, retornar uma mensagem de erro
                return jsonify({'success': False, 'message': 'Nenhum slide encontrado'})
        else:
            # Se a conexão não foi estabelecida com sucesso, retornar uma mensagem de erro
            return jsonify({'success': False, 'message': 'Erro de conexão ao banco de dados'})

    except mysql.connector.Error as err:
        # Em caso de erro ao executar a consulta SQL, retornar uma mensagem de erro
        return jsonify({'success': False, 'message': f'Erro ao listar slides: {err}'})

    finally:
        # Fechar o cursor e a conexão com o banco de dados
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()



########Admin##
# Função para  todos os Admins cadastrados
@app.route('/ListarAdministrador', methods=['GET'])
def ListarAdministrador():
    try:
        # Conectar ao banco de dados
        connection = mysql.connector.connect(
            host='localhost',
            database='Praca_Online',
            user='root',
            password='romeu2001'
        )

        # Verificar se a conexão foi estabelecida com sucesso
        if connection.is_connected():
            # Criar um cursor para executar consultas SQL
            cursor = connection.cursor(dictionary=True)
            # Consulta para buscar todos os dados dos clientes
            cursor.execute("SELECT * FROM Administrador")
            Administrador = cursor.fetchall()
            # Verificar se há clientes cadastrados
            if Administrador:
                # Retornar a lista de clientes em formato JSON
                return jsonify({'success': True, 'Administrador': Administrador})
            else:
                # Se não houver clientes cadastrados, retornar uma mensagem de erro
                return jsonify({'success': False, 'message': 'Nenhum Administrador encontrado'})
        else:
            # Se a conexão não foi estabelecida com sucesso, retornar uma mensagem de erro
            return jsonify({'success': False, 'message': 'Erro de conexão ao banco de dados'})

    except mysql.connector.Error as err:
        # Em caso de erro ao executar a consulta SQL, retornar uma mensagem de erro
        return jsonify({'success': False, 'message': f'Erro ao listar Administradores: {err}'})

    finally:
        # Fechar o cursor e a conexão com o banco de dados
        if 'connection' in locals() and connection.is_connected():
            cursor.close()
            connection.close()

# Função para remover um Administrador
@app.route('/removerAdministrador', methods=['POST'])
def removerAdministrador():
    try:
        dados = request.get_json()
        id_adm = dados['id_adm']

        conect_BD = mysql.connector.connect(
            host='localhost', database='Praca_Online', user='root', password='romeu2001'
        )

        if conect_BD.is_connected():
            cursor = conect_BD.cursor()

            # Verificar se o Administrador existe
            cursor.execute('SELECT * FROM Administrador WHERE id_adm = %s', (id_adm,))
            cliente = cursor.fetchone()
            if not cliente:
                return jsonify({'success': False, 'message': 'Administrador não encontrado.'})

            # Remover o Administrador
            cursor.execute('DELETE FROM Administrador WHERE id_adm = %s', (id_adm,))
            conect_BD.commit()

            return jsonify({'success': True, 'message': 'Administrador removido com sucesso.'})
        else:
            return jsonify({'success': False, 'message': 'Erro de conexão ao banco de dados'})
    except mysql.connector.Error as err:
        return jsonify({'success': False, 'message': 'Erro ao conectar ao banco de dados', 'error': str(err)})
    except Exception as e:
        return jsonify({'success': False, 'message': 'Erro ao remover Administrador. Por favor, tente novamente.', 'error': str(e)})
    finally:
        if 'conect_BD' in locals() and conect_BD.is_connected():
            cursor.close()
            conect_BD.close()

# Função para editar Administrador
@app.route('/editarAdministrador', methods=['POST'])
def editarAdministrador():
    try:
        dados = request.get_json()
        novoNome = dados['nome']
        novoEmail = dados['email']
        novoEndereco = dados['endereco']
        senha = dados['senha']
        confirmarSenha = dados['confirmarSenha']
        id_adm = dados['id_adm']
        print("dadossssssssssssss",senha,novoEmail,novoEndereco,confirmarSenha)

        conect_BD = mysql.connector.connect(
            host='localhost', database='Praca_Online', user='root', password='romeu2001'
        )

        if conect_BD.is_connected():
            cursor = conect_BD.cursor()

            # Verificar se o cliente existe
            cursor.execute('SELECT * FROM Administrador WHERE id_adm = %s', (id_adm,))
            cliente = cursor.fetchone()
            if not cliente:
                return jsonify({'success': False, 'message': 'Administrador não encontrado.'})

            # Atualizar os dados do cliente
            cursor.execute('UPDATE Administrador SET nome = %s, email = %s, endereco = %s, senha = %s, confirmarSenha = %s WHERE id_adm = %s',
                           (novoNome, novoEmail,novoEndereco, senha, confirmarSenha, id_adm))
            conect_BD.commit()

            return jsonify({'success': True, 'message': 'Administrador atualizado com sucesso.'})
        else:
            return jsonify({'success': False, 'message': 'Erro de conexão ao banco de dados'})
    except mysql.connector.Error as err:
        return jsonify({'success': False, 'message': 'Erro ao conectar ao banco de dados', 'error': str(err)})
    except Exception as e:
        return jsonify({'success': False, 'message': 'Erro ao editar Dministrador. Por favor, tente novamente.', 'error': str(e)})
    finally:
        if 'conect_BD' in locals() and conect_BD.is_connected():
            cursor.close()
            conect_BD.close()


##############Publicacao########

#######Trabalhar na Publicacao ########

# Adicionar Publicação
@app.route('/AddPublicacao', methods=['POST'])
def AddPublicacao():
    try:
        data = request.get_json()
        titulo = data['titulo']
        texto = data['texto']
       
        global getemail 
        global getid
        email_Admin = getemail
        id_adm =  getid
        print("Email Admin", email_Admin, id_adm)
        connection = mysql.connector.connect(
            host='localhost',
            database='Praca_Online',
            user='root',
            password='romeu2001'
        )
        cursor = connection.cursor()

        cursor.execute("INSERT INTO Publicacao (titulo, texto, id_adm, email_Admin) VALUES (%s, %s, %s, %s)", (titulo, texto, id_adm, email_Admin))
        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({
            'success': True,
            'message': 'Publicação adicionada com sucesso'
        })
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro ao adicionar publicação: {str(e)}'})

# Rota para carregar as publicações
@app.route('/carregar_publicacoes', methods=['GET'])
def carregar_publicacoes():
    try:
        # Conectar ao banco de dados
        connection = mysql.connector.connect(
            host='localhost',
            database='Praca_Online',
            user='root',
            password='romeu2001'
        )
        
        # Criar um cursor para executar consultas SQL
        cursor = connection.cursor()
        
        # Consulta para buscar as publicações
        cursor.execute("SELECT titulo, texto, id_adm, email_Admin FROM Publicacao")
        publicacoes = []
        for publicacao_result in cursor.fetchall():
            titulo, texto, id_adm, email_Admin = publicacao_result
            publicacao = {
                'titulo': titulo,
                'texto': texto,
                'id_adm': id_adm,
                'email_Admin': email_Admin
            }   
            publicacoes.append(publicacao)

        # Fechar o cursor e a conexão
        cursor.close()
        connection.close()

        if publicacoes:
            return jsonify({'success': True, 'publicacoes': publicacoes})
        else:
            return jsonify({'success': False, 'message': 'Nenhuma publicação encontrada'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro ao carregar publicações: {str(e)}'})
# Remover Publicação
@app.route('/removerPublicacao', methods=['POST'])
def removerPublicacao():
    try:
        data = request.get_json()
        id_Publicacao = data['id_Publicacao']

        connection = mysql.connector.connect(
            host='localhost',
            database='Praca_Online',
            user='root',
            password='romeu2001'
        )
        cursor = connection.cursor()

        cursor.execute('DELETE FROM Publicacao WHERE id_Publicacao = %s', (id_Publicacao,))
        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({'success': True, 'message': 'Publicação removida com sucesso.'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro ao remover publicação: {str(e)}'})



# Listar publicações
@app.route('/listarPublicacoes', methods=['GET'])
def listarPublicacoes():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='Praca_Online',
            user='root',
            password='romeu2001'
        )
        cursor = connection.cursor(dictionary=True)

        cursor.execute('SELECT * FROM Publicacao')
        publicacoes = cursor.fetchall()

        cursor.close()
        connection.close()

        return jsonify({'success': True, 'publicacoes': publicacoes})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro ao listar publicações: {str(e)}'})


# Rota para editar uma publicação
@app.route('/editarPublicacao', methods=['POST'])
def editarPublicacao():
    try:
        data = request.get_json()
        id_Publicacao = data['id_Publicacao']
        novo_titulo = data['titulo']
        novo_texto = data['texto']
        novo_id_adm = data['id_adm']
        novo_email_Admin = data['email_Admin']

        connection = mysql.connector.connect(
            host='localhost',
            database='Praca_Online',
            user='root',
            password='romeu2001'
        )
        cursor = connection.cursor()

        cursor.execute('UPDATE Publicacao SET titulo = %s, texto = %s, id_adm = %s, email_Admin = %s WHERE id_Publicacao = %s',
                       (novo_titulo, novo_texto, novo_id_adm, novo_email_Admin, id_Publicacao))
        connection.commit()

        cursor.close()
        connection.close()

        return jsonify({'success': True, 'message': 'Publicação editada com sucesso.'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro ao editar publicação: {str(e)}'})


@app.route('/adicionar_carrinho', methods=['POST'])
def adicionar_carrinho():
    dados = request.get_json()
    carrinho = dados.get('carrinho')
    global getemail 
    email = getemail
    global getid
    if carrinho:
        try:
            conect_BD = mysql.connector.connect(
                host='localhost', database='Praca_Online', user='root', password='romeu2001'
            )
            if conect_BD.is_connected():
                cursor = conect_BD.cursor()
                for item in carrinho:
                    v = ["nome_produto", "caminho_imagem", "id_produto", "quantidade", "preco"]
                    dados = {}

                    for c in v:
                        dados[c] = item.get(c)

                    cursor.execute("SELECT email,quantidade FROM Produto1 WHERE id_produto = %s", (dados["id_produto"] ,))
                    email_quantidade = cursor.fetchone()
                    email_produto = email_quantidade[0]
                    quantidade_produto = email_quantidade[1]
                    
                    if email_produto == email:
                       return jsonify({'success': False, 'message': 'Um Vendedor nao pode adicionar seu proprio Produto no Carrinho'})
                    
                    cursor.execute("SELECT quantidade FROM Carrinho WHERE id_produto = %s and email= %s", (dados['id_produto'],email,))
                    quantidade_retorno = cursor.fetchone()

                    if quantidade_produto == 0:
                        return jsonify({'success': False, 'message': 'Produto esgotou.'})

                    if quantidade_retorno != None:
                        nova_quantidade = quantidade_retorno[0] + dados['quantidade']

                        if quantidade_produto < nova_quantidade:
                            return jsonify({'success': False, 'message': 'A quantidade solicitada excede a quantidade disponível em estoque.'})

                        cursor.execute("UPDATE Carrinho SET quantidade=%s, preco=%s WHERE id_produto=%s AND email=%s",
                                    (nova_quantidade, str(dados['preco']), str(dados['id_produto']), email))
                    else:
                        dados["email"] = email
                        dados["quantidade_estoque"] = quantidade_produto
                        
                        for k, v in dados.items():
                            dados[k] = str(v)

                        cursor.execute("INSERT INTO Carrinho (nome_produto, caminho_imagem, id_produto, quantidade, preco, email, quantidade_Estoque) VALUES (%s, %s,%s, %s, %s, %s, %s)",
                                       (dados['nome_produto'], dados['caminho_imagem'], dados['id_produto'], dados['quantidade'], dados['preco'], dados['email'], dados['quantidade_estoque'],))
                conect_BD.commit()
                return jsonify({'success': True, 'message': 'Carrinho adicionado com sucesso.'})
        except Exception as e:
            print("Erro:", e)
            return jsonify({'success': False, 'message': 'Erro ao adicionar carrinho. Por favor, tente novamente.', 'error': str(e)})
        finally:
            if 'conect_BD' in locals() and conect_BD.is_connected():
                cursor.close()
                conect_BD.close()

    return jsonify({'success': False, 'message': 'Nenhum item no carrinho.'})



# Função para carregar todos os dados do produto do usuário com a sessão iniciada
@app.route('/carregar_produtosCarrinho', methods=['GET'])
def carregar_produtos_DO_Carrinho():
    try:
        global getemail 
        email = getemail
        if email:
            conect_BD = mysql.connector.connect(
                host='localhost', database='Praca_Online', user='root', password='romeu2001'
            )
            if conect_BD.is_connected():
                cursor = conect_BD.cursor()
                cursor.execute("SELECT * FROM Carrinho WHERE email = %s", (email,))
                produtos = cursor.fetchall()
                produtos_list = []
                for produto in produtos:
                    produto_dict = {
                        'id_Carrinho': produto[0],
                        'nome_produto': produto[1],
                        'quantidade': produto[2],
                        'caminho_imagem': produto[3],
                         'id_produto': produto[4],
                        'email': produto[5],
                        'preco': produto[6],
                        'quantidade_Estoque': produto[7],
                    }
                    produtos_list.append(produto_dict)
                    
                return jsonify({'success': True, 'produtos': produtos_list})
            else:
                return jsonify({'success': False, 'message': 'Erro ao conectar ao banco de dados'})
        else:
            return jsonify({'success': False, 'message': 'Nenhum usuário logado'})
    except Exception as e:
        return jsonify({'success': False, 'message': 'Erro ao carregar produtos', 'error': str(e)})
    finally:
        if 'conect_BD' in locals() and conect_BD.is_connected():
            cursor.close()
            conect_BD.close()

# Função para editar apenas a quantidade do produto do usuário com a sessão iniciada
@app.route('/editar_quantidade', methods=['POST'])
def editar_quantidade():
    try:
        global getemail 
        email = getemail
        if email:
            dados = request.get_json()
            id_Carrinho = dados.get('id_Carrinho')
            nova_quantidade = dados.get('nova_quantidade')

            conect_BD = mysql.connector.connect(
                host='localhost', database='Praca_Online', user='root', password='romeu2001'
            )
            if conect_BD.is_connected():
                cursor = conect_BD.cursor()
                cursor.execute("UPDATE Carrinho SET quantidade=%s WHERE id_Carrinho=%s AND email=%s",
                               (nova_quantidade, id_Carrinho, email))
                conect_BD.commit()
                return jsonify({'success': True, 'message': 'Quantidade do produto atualizada com sucesso.'})
            else:
                return jsonify({'success': False, 'message': 'Erro ao conectar ao banco de dados'})
        else:
            return jsonify({'success': False, 'message': 'Nenhum usuário logado'})
    except Exception as e:
        return jsonify({'success': False, 'message': 'Erro ao editar quantidade', 'error': str(e)})
    finally:
        if 'conect_BD' in locals() and conect_BD.is_connected():
            cursor.close()
            conect_BD.close()


# Função para remover um produto do carrinho
@app.route('/remover_produtoCarinho', methods=['POST'])
def remover_produto():
    try:
        global getemail 
        email = getemail        
        if email:
            data = request.get_json()
            id_Carrinho = data['id_Carrinho']
            print(id_Carrinho)
            conect_BD = mysql.connector.connect(
                host='localhost', database='Praca_Online', user='root', password='romeu2001'
            )
            if conect_BD.is_connected():
                cursor = conect_BD.cursor()
                cursor.execute("DELETE FROM Carrinho WHERE email=%s AND id_Carrinho=%s", (email, id_Carrinho))
                conect_BD.commit()
                return jsonify({'success': True, 'message': 'Produto removido do carrinho com sucesso.'})
            else:
                return jsonify({'success': False, 'message': 'Erro ao conectar ao banco de dados'})
        else:
            return jsonify({'success': False, 'message': 'Nenhum usuário logado'})
    except Exception as e:
        return jsonify({'success': False, 'message': 'Erro ao remover produto', 'error': str(e)})
    finally:
        if 'conect_BD' in locals() and conect_BD.is_connected():
            cursor.close()
            conect_BD.close()



@app.route('/efectuarCompra', methods=['POST'])
def efectuarCompra():
    try:
        global getemail 
        global getid
        email = getemail
        id = getid
        # Verificar se o arquivo foi enviado pelo formulário
        if 'file' not in request.files:
            return jsonify({'success': False, 'message': 'Nenhum arquivo recebido'})

        file = request.files['file']

        # Verificar se o arquivo possui um nome válido
        if file.filename == '':
            return jsonify({'success': False, 'message': 'Nome de arquivo inválido'})

        # Verificar se a extensão do arquivo é PDF
        if not file.filename.endswith('.pdf'):
            return jsonify({'success': False, 'message': 'Por favor, envie um arquivo PDF'})

        # Gerar um nome único para o arquivo
        nome_arquivo = secure_filename(file.filename)

        # Obter o caminho absoluto da pasta public
        pasta_public_absoluta = os.path.abspath(os.path.join(os.getcwd(), '..', 'public'))

        # Garantir que a pasta de uploads exista dentro da pasta public, se não, criá-la
        pasta_upload_absoluta = os.path.join(pasta_public_absoluta, UPLOAD_FOLDER)
        os.makedirs(pasta_upload_absoluta, exist_ok=True)

        # Salvar o arquivo no caminho absoluto
        caminho_arquivo_absoluto = os.path.join(pasta_upload_absoluta, nome_arquivo)
        file.save(caminho_arquivo_absoluto)

        # Obter o caminho relativo do arquivo em relação à pasta public

        caminho_Comprovativo = os.path.join('/', UPLOAD_FOLDER, nome_arquivo)

        # Obter o id_produto enviado pelo front-end
        id_produto = request.form.get('id_produto')
        # Verificar se o id_produto é válido
        if not id_produto:
            return jsonify({'success': False, 'message': 'ID do produto inválido'})

        # Conectar ao banco de dados
        connection = mysql.connector.connect(
            host='localhost',
            database='Praca_Online',
            user='root',
            password='romeu2001'
        )

        # Criar um cursor para executar consultas SQL
        cursor = connection.cursor()
        email_comprador = getemail
        print("TTTT",id_produto)
        # Consultar o email do vendedor e o id do vendedor usando o id_produto na tabela Produto1
        cursor.execute("SELECT email,id_vendedor FROM Produto1 WHERE id_produto = %s", (id_produto,))
        result = cursor.fetchone()

        # Verificar se o id_produto é válido e se o email do vendedor foi encontrado
        if not result:
            return jsonify({'success': False, 'message': 'ID do produto não encontrado ou email do vendedor não encontrado'})

        email_vendedor = result[0]
        id_vendedor = result[1]
        if email_vendedor ==  email_comprador:
            return jsonify({'success': False, 'message': 'Um vendedor não Pode adicionar seu produto no Carrinho'})

        # Consultar os itens no carrinho do comprador
        cursor.execute("SELECT nome_produto, quantidade, caminho_imagem, preco, quantidade_Estoque FROM Carrinho WHERE email = %s", (email_comprador,))
        carrinho_items = cursor.fetchall()

        # Verificar se há itens no carrinho
        if not carrinho_items:
            return jsonify({'success': False, 'message': 'Carrinho vazio'})

        # Inserir os itens do carrinho na tabela Historico_venda
        for item in carrinho_items:
            nome_produto = item[0]
            quantidade = item[1]
            caminho_imagem = item[2]
            preco = item[3]

            # Inserir os dados na tabela Historico_venda
            cursor.execute("INSERT INTO Historico_venda (nome_produto, quantidade, caminho_imagem, email_Vendedor, email_Comprador, id_vendedor, preco,caminho_Comprovativo) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)", (nome_produto, quantidade, caminho_imagem, email_vendedor, email_comprador, id_vendedor, preco,caminho_Comprovativo))

        # Confirmar a inserção
        connection.commit()
        print("TESTESEEEE")
        print("TESTESEEEE23")

        # Inserir os itens do carrinho na tabela Historico_Compra
        print(carrinho_items)
        for item in carrinho_items:
            nome_produto = item[0]
            quantidade = item[1]
            caminho_imagem = item[2]
            preco = item[3]

            # Inserir os dados na tabela Historico_Compra
            cursor.execute("INSERT INTO Historico_Compra (nome_produto, quantidade, caminho_imagem, email_Comprador, email_Vendedor, id_cliente, preco) VALUES (%s, %s, %s, %s, %s, %s, %s)", (nome_produto, quantidade, caminho_imagem, email_comprador, email_vendedor, id, preco))
        connection.commit()

        for item in carrinho_items:
            nome_produto = item[0]
            quantidade = item[1]
            caminho_imagem = item[2]
            preco = item[3]
            quantidade_Estoque = item[4]
            if(quantidade<=quantidade_Estoque):
              cursor.execute("UPDATE Produto1 SET quantidade= quantidade - %s WHERE id_produto = %s", (quantidade, id_produto,))
            else:  
                return jsonify({'success': False, 'message': 'Quantidade Em Estoque Indisponivel '})

        connection.commit()

        # Limpar o carrinho após a conclusão da compra
        cursor.execute("DELETE FROM Carrinho where email = %s", (email_comprador,))
        connection.commit()

        # Fechar o cursor e a conexão
        cursor.close()
        connection.close()

        return jsonify({
            'success': True,
            'message': 'Compra efetuada com sucesso'
        })
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro ao efetuar compra: {str(e)}'})








# Rota para carregar o histórico de compras
@app.route('/carregar_historico_compra', methods=['GET'])
def carregar_historico_compra():
    try:
        # Conectar ao banco de dados
        connection = mysql.connector.connect(
            host='localhost',
            database='Praca_Online',
            user='root',
            password='romeu2001'
        )
        
        # Criar um cursor para executar consultas SQL
        cursor = connection.cursor()
        global getemail
        # Obtém o email do comprador da sessão (supondo que esteja armazenado na sessão)
        email_comprador = getemail

        # Consulta para buscar o histórico de compras do comprador
        cursor.execute("SELECT * FROM Historico_Compra WHERE email_Comprador = %s", (email_comprador,))
        historico_compra = []
        for compra_result in cursor.fetchall():
            # Você pode personalizar os dados que deseja retornar conforme necessário
            id_Historico_Compra, nome_produto, quantidade, caminho_imagem, email_comprador, email_vendedor, id_cliente, preco, estado_compra, data = compra_result
            compra = {
                'id_Historico_Compra': id_Historico_Compra,
                'nome_produto': nome_produto,
                'quantidade': quantidade,
                'caminho_imagem': caminho_imagem,
                'email_comprador': email_comprador,
                'email_vendedor': email_vendedor,
                'id_cliente': id_cliente,
                'preco': preco,
                'estado_compra': estado_compra,
                'data': data.strftime("%Y-%m-%d %H:%M:%S") if data else None  # Formata a data como string
            }
            historico_compra.append(compra)

        # Fechar o cursor e a conexão
        cursor.close()
        connection.close()

        if historico_compra:
            return jsonify({'success': True, 'historico_compra': historico_compra})
        else:
            return jsonify({'success': False, 'message': 'Nenhum histórico de compra encontrado'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro ao carregar histórico de compra: {str(e)}'})










# Rota para remover um item do histórico de compra
@app.route('/remover_historico_compra', methods=['POST'])
def remover_historico_compra():
    try:
        data = request.json
        id_Historico_Compra = data.get('id_Historico_Compra')

        # Conectar ao banco de dados
         # Conectar ao banco de dados
        connection = mysql.connector.connect(
            host='localhost',
            database='Praca_Online',
            user='root',
            password='romeu2001'
        )
        cursor = connection.cursor()
        print("IDIDID:", id_Historico_Compra)
        # Executar a query para remover o item do histórico de compra
        cursor.execute("DELETE FROM Historico_Compra WHERE id_Historico_Compra = %s", (id_Historico_Compra,))
        connection.commit()

        # Fechar o cursor e a conexão
        cursor.close()
        connection.close()

        return jsonify({'success': True, 'message': 'Histórico de compra removido com sucesso!'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro ao remover histórico de compra: {str(e)}'})










# Rota para carregar o histórico de vendas
@app.route('/carregar_historico_venda', methods=['GET'])
def carregar_historico_venda():
    global getemail
    email = getemail
    try:
       
        # Conectar ao banco de dados
        connection = mysql.connector.connect(
            host='localhost',
            database='Praca_Online',
            user='root',
            password='romeu2001'
        )
        
        # Criar um cursor para executar consultas SQL
        cursor = connection.cursor()
        print("WWWWffn",email)
        # Consulta para buscar o histórico de vendas
        cursor.execute("SELECT * FROM Historico_venda WHERE email_Vendedor = %s ",(email,))


        historico_venda = []
        for venda_result in cursor.fetchall():
            # Você pode personalizar os dados que deseja retornar conforme necessário
            id_historico_venda, nome_produto, quantidade, caminho_imagem, email_Vendedor, email_Comprador, id_vendedor, preco, data, caminho_Comprovativo = venda_result
            venda = {
                'id_Historico_venda': id_historico_venda,
                'nome_produto': nome_produto,
                'quantidade': quantidade,
                'caminho_imagem': caminho_imagem,
                'email_Vendedor': email_Vendedor,
                'email_Comprador': email_Comprador,
                'id_vendedor': id_vendedor,
                'preco': preco,
                'data': data.strftime("%Y-%m-%d %H:%M:%S") if data else None , # Formata a data como string
                'caminho_Comprovativo': caminho_Comprovativo

            }
            historico_venda.append(venda)
            print(historico_venda)
        # Fechar o cursor e a conexão
        cursor.close()
        connection.close()

        if historico_venda:
            return jsonify({'success': True, 'historico_venda': historico_venda})
        else:
            return jsonify({'success': False, 'message': 'Nenhum histórico de venda encontrado'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro ao carregar histórico de venda: {str(e)}'})


# Rota para remover um item do histórico de venda
@app.route('/remover_historico_venda', methods=['POST'])
def remover_historico_venda():
    try:
        data = request.json
        id_Historico_venda = data.get('id_Historico_venda')

        # Conectar ao banco de dados
        connection = mysql.connector.connect(
            host='localhost',
            database='Praca_Online',
            user='root',
            password='romeu2001'
        )
        cursor = connection.cursor()

        # Executar a query para remover o item do histórico de venda
        cursor.execute("DELETE FROM Historico_venda WHERE id_Historico_venda = %s", (id_Historico_venda,))
        connection.commit()

        # Fechar o cursor e a conexão
        cursor.close()
        connection.close()

        return jsonify({'success': True, 'message': 'Histórico de venda removido com sucesso!'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Erro ao remover histórico de venda: {str(e)}'})





@app.route('/pagamento', methods=['POST'])
def pagamentoSistema():
    try:
        global getemail 
        global getid
        email = getemail
        id = getid
        # Verificar se o arquivo foi enviado pelo formulário
        if 'file' not in request.files:
            return jsonify({'success': False, 'message': 'Nenhum arquivo recebido'})

        file = request.files['file']

        # Verificar se o arquivo possui um nome válido
        if file.filename == '':
            return jsonify({'success': False, 'message': 'Nome de arquivo inválido'})

        # Verificar se a extensão do arquivo é PDF
        if not file.filename.endswith('.pdf'):
            return jsonify({'success': False, 'message': 'Por favor, envie um arquivo PDF'})

        # Gerar um nome único para o arquivo
        nome_arquivo = secure_filename(file.filename)

        # Obter o caminho absoluto da pasta public
        pasta_public_absoluta = os.path.abspath(os.path.join(os.getcwd(), '..', 'public'))

        # Garantir que a pasta de uploads exista dentro da pasta public, se não, criá-la
        UPLOAD_FOLDER = 'uploads'
        pasta_upload_absoluta = os.path.join(pasta_public_absoluta, UPLOAD_FOLDER)
        os.makedirs(pasta_upload_absoluta, exist_ok=True)

        # Salvar o arquivo no caminho absoluto
        caminho_arquivo_absoluto = os.path.join(pasta_upload_absoluta, nome_arquivo)
        file.save(caminho_arquivo_absoluto)

        # Obter o caminho relativo do arquivo em relação à pasta public
        caminho_Comprovativo = os.path.join('/', UPLOAD_FOLDER, nome_arquivo)
        
        # Conectar ao banco de dados
        connection = mysql.connector.connect(
            host='localhost',
            database='Praca_Online',
            user='root',
            password='romeu2001'
        )
        cursor = connection.cursor()
        print("AAAAAAAAASSSSSSSS")

        # Inserir dados na tabela Mensalidade
        cursor.execute("INSERT INTO Mensalidade(email_vendedor, id_Vendedor, caminho_Comprovativo) VALUES (%s, %s, %s)", (email,id, caminho_Comprovativo))

        connection.commit()  # É necessário fazer o commit para salvar as alterações no banco de dados

        return jsonify({'success': True, 'message': 'Pagamento efetuado com sucesso'})

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

    finally:
        cursor.close()
        connection.close()  # Fechar a conexão com o banco de dados no bloco finally
# Rota para carregar as mensalidades
@app.route('/carregar_mensalidades', methods=['GET'])
def carregar_mensalidades():
    try:
        # Conectar ao banco de dados
        connection = mysql.connector.connect(
            host='localhost',
            database='Praca_Online',
            user='root',
            password='romeu2001'
        )
        cursor = connection.cursor()

        # Consulta SQL para buscar as mensalidades
        cursor.execute("SELECT * FROM Mensalidade")

        # Executar a consulta
        

        # Obter todas as mensalidades do cursor
        mensalidades = cursor.fetchall()

        # Formatar os dados das mensalidades para JSON
        mensalidades_json = [{'id_mensalidade': mensalidade[0], 'email_vendedor': mensalidade[1], 'id_Vendedor': mensalidade[2], 'caminho_Comprovativo': mensalidade[3], 'Data':  mensalidade[4] } for mensalidade in mensalidades]

        return jsonify({'success': True, 'mensalidades': mensalidades_json})

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

    finally:
        cursor.close()
        connection.close()


# Função para remover uma mensalidade
@app.route('/remover_mensalidade', methods=['POST'])
def remover_mensalidade():
    try:
        # Obter o ID da mensalidade a ser removida do corpo da solicitação
        id_mensalidade = request.json.get('id_mensalidade')

        # Conectar ao banco de dados
        connection = mysql.connector.connect(
            host='localhost',
            database='Praca_Online',
            user='root',
            password='romeu2001'
        )
        cursor = connection.cursor()

        # Executar a consulta SQL para remover a mensalidade com o ID especificado
        cursor.execute("DELETE FROM Mensalidade WHERE id_mensalidade = %s",(id_mensalidade,))
       

        # Confirmar as alterações no banco de dados
        connection.commit()

        return jsonify({'success': True, 'message': 'Mensalidade removida com sucesso'})

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})

    finally:
        cursor.close()
        connection.close()

if __name__ == '__main__':
    app.run(debug=True)
