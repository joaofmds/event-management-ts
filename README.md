# Event Management API

Esta é uma API REST desenvolvida com **TypeScript** e **MongoDB** para o gerenciamento de eventos. A aplicação oferece funcionalidades de cadastro, atualização, remoção e listagem de eventos, além do gerenciamento de usuários (registro, login) e operações de inscrição (subscribe) e desinscrição (unsubscribe) em eventos.

## Features

- **Eventos**:
  - Criar, atualizar, deletar e listar eventos.
  - Buscar um evento específico por ID.
  - Inscrever e desinscrever usuários em eventos.
- **Usuários**:
  - Cadastro e autenticação via JWT.
  - Retorno de informações do usuário autenticado.
- **Autenticação**:
  - Uso de tokens JWT para proteger rotas sensíveis.
- **Testes**:
  - Testes de integração com [Jest](https://jestjs.io/) e [Supertest](https://github.com/visionmedia/supertest).
  - Utilização do [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server) para testes isolados sem depender de um banco real.

## Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [JSON Web Token (JWT)](https://jwt.io/)
- [Jest](https://jestjs.io/)
- [Supertest](https://github.com/visionmedia/supertest)

## Estrutura do Projeto

```
├── src
│   ├── config
│   │   └── database.ts           # Configuração e conexão com o MongoDB
│   ├── controllers
│   │   ├── event.controller.ts   # Lógica para operações de eventos
│   │   └── user.controller.ts    # Lógica para operações de usuários
│   ├── middlewares
│   │   └── authMiddleware.ts     # Middleware para verificação do token JWT
│   ├── models
│   │   ├── event.model.ts        # Modelo Mongoose para eventos
│   │   └── user.model.ts         # Modelo Mongoose para usuários
│   ├── routes
│   │   ├── event.routes.ts       # Rotas para eventos
│   │   └── user.routes.ts        # Rotas para usuários
│   └── server.ts                 # Configuração do Express (sem o listen)
├── test
│   ├── routes
│   │   ├── event.routes.spec.ts  # Testes de integração para eventos
│   │   └── user.routes.spec.ts   # Testes de integração para usuários
│   └── config
│       └── database.spec.ts      # Testes para a conexão com o MongoDB
├── .env                        # Variáveis de ambiente (ex: PORT, MONGO_URI, JWT_SECRET)
├── package.json
├── tsconfig.json
└── README.md
```

## Instalação e Execução

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Um servidor MongoDB (local ou remoto)

### Passos para Instalação

1. **Clone o repositório:**

   ```bash
   git clone git@github.com:joaofmds/event-scheduler-ts.git
   cd event-scheduler-ts
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**

   Crie um arquivo `.env` na raiz do projeto e defina as seguintes variáveis:

   ```env
   MONGO_URI=mongodb://localhost:27017/event-management
   JWT_SECRET=your_secret_key
   ```

4. **Executar a API:**

   Para rodar em ambiente de desenvolvimento (usando [ts-node-dev](https://github.com/wclr/ts-node-dev) ou similar):

   ```bash
   npm run dev
   ```

   Para compilar e rodar o projeto:

   ```bash
   npm run build
   npm start
   ```

   A API será iniciada na porta definida na variável `PORT` (por padrão, 3000).

## Endpoints

### Usuários

- **POST /users/register**
  Registra um novo usuário.
  **Body:**
  ```json
  {
    "name": "Fulano",
    "email": "fulano@gmail.com",
    "password": "senha123"
  }
  ```

- **POST /users/login**
  Realiza login e retorna um token JWT.
  **Body:**
  ```json
  {
    "email": "fulano@gmail.com",
    "password": "senha123"
  }
  ```

### Eventos

- **POST /events/create**
  Cria um novo evento.
  **Body:**
  ```json
  {
    "title": "Meu Evento",
    "description": "Descrição do evento",
    "date": "2025-12-31",
    "local": "Auditório 1"
  }
  ```
  *Protegido: necessita do token JWT no header (Authorization: Bearer \<token\>)*

- **GET /events**
  Lista todos os eventos.

- **GET /events/:id**
  Retorna um evento específico por ID.

- **POST /events/update/:id**
  Atualiza um evento existente.
  **Body:** Campos que deseja atualizar.
  *Protegido*

- **DELETE /events/:id**
  Deleta um evento específico por ID.
  *Protegido*

- **POST /events/subscribe/:eventId**
  Inscreve um usuário em um evento.
  **Body:**
  ```json
  {
    "userId": "<ID_DO_USUARIO>"
  }
  ```
  *Protegido*

- **POST /events/unsubscribe/:eventId**
  Remove a inscrição de um usuário em um evento.
  **Body:**
  ```json
  {
    "userId": "<ID_DO_USUARIO>"
  }
  ```
  *Protegido*

## Testes

Os testes de integração foram desenvolvidos com **Jest** e **Supertest**. Para executá-los, basta rodar:

```bash
npm test
```

Os testes utilizam um servidor MongoDB em memória para isolar os cenários de teste.
