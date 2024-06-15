# Aplicação de Gerenciamento de Contas

## Link do video

https://drive.google.com/file/d/1jbAERWrS6T3kCy7odst6hvRGKfnIGeBm/view?usp=sharing

## Descrição

Esta é uma aplicação web para gerenciar contas financeiras, permitindo adicionar, editar, excluir e listar contas. A aplicação também atualiza automaticamente o status das contas baseando-se na data de vencimento. O Frontend é construído utilizando Flask, enquanto o banco de dados PostgreSQL é utilizado para armazenamento dos dados.

## Funcionalidades

- **Adicionar Conta**: Permite ao usuário adicionar uma nova conta fornecendo nome, valor, data de vencimento e status.
- **Editar Conta**: Permite ao usuário editar as informações de uma conta existente.
- **Excluir Conta**: Permite ao usuário excluir uma conta.
- **Listar Contas**: Exibe uma lista de todas as contas, mostrando detalhes como nome, valor, data de vencimento e status.
- **Atualização Automática de Status**: Atualiza automaticamente o status das contas para 'vencida' se a data de vencimento passar e a conta não estiver paga.
- **Resetar Banco de Dados**: Função para resetar o banco de dados, útil para testes e desenvolvimento.

## Tecnologias Utilizadas

- **Backend**: Node.js
- **Frontend**: Flask, HTML, CSS (renderizados pelo Flask)
- **Banco de Dados**: PostgreSQL
- **Docker**: Para containerização da aplicação

## Requisitos

- Docker
- Docker Compose

## Estrutura do Projeto

```plaintext
gerenciamento-de-contas/
│
├── backend/
│   ├── Dockerfile             # Arquivo de configuração do Docker para o backend
│   ├── ini.sql                # Script SQL para inicialização do banco de dados
│   └── src/
│       └── index.js           # Arquivo principal do backend em Node.js
│
├── frontend/
│   ├── Dockerfile             # Arquivo de configuração do Docker para o frontend
│   ├── app.py                 # Arquivo principal da aplicação Flask
│   └── templates/
│       ├── index.html         # Template da página inicial
│       ├── inserir.html       # Template do formulário de inserção de conta
│       ├── listar.html        # Template da listagem de contas
│       ├── atualizar.html    # Template de atualizar as contas
│
│
├── docker-compose.yml         # Arquivo de configuração do Docker Compose
└── README.md                  # Este arquivo
```

## Instalação e Configuração

### Passo 1: Clonar o Repositório

```bash
git clone https://github.comJonathan-Stefan/Controle-Financeiro
cd Controle-Financeiro
```

### Passo 2: Configurar o Banco de Dados

Certifique-se de que o PostgreSQL está configurado no `docker-compose.yml` e que o script `ini.sql` está correto para a inicialização do banco de dados.

### Passo 3: Construir e Executar os Containers Docker

```bash
docker-compose up --build
```

A aplicação estará disponível em `http://localhost:3000`.

## Rotas da API

- **`GET /`**: Página inicial.
- **`GET /inserir`**: Formulário de inserção de conta.
- **`POST /inserir`**: Envia dados para inserir uma nova conta.
- **`GET /listar`**: Lista todas as contas.
- **`GET /atualizar/<int:conta_id>`**: Formulário de atualização de conta.
- **`POST /atualizar/<int:conta_id>`**: Envia dados para atualizar uma conta existente.
- **`POST /excluir/<int:conta_id>`**: Exclui uma conta existente.
- **`GET /reset-database`**: Reseta o banco de dados.

## Licença

Este projeto está licenciado sob os termos da licença MIT. Veja o arquivo LICENSE para mais detalhes.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

