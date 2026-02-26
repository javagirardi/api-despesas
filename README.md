# API de Aprovação de Despesas

API REST desenvolvido para desafio técnico que realiza o gerenciamento de despesas com fluxo de aprovação, regras de negócio, autenticação JWT e integração com a API PTAX do Banco Central do Brasil.

**Autor:** Javan Moisés Girardi

---

## Tecnologias Utilizadas

* **Node.js**
* **Express**
* **PostgreSQL**
* **JSON Web Token** (jsonwebtoken)
* **Axios**
* **UUID**
* **Dotenv**
* **Nodemon** (desenvolvimento)
* **API PTAX** – Banco Central do Brasil

---

## Arquitetura

O projeto segue a separação em camadas para melhor manutenção e escalabilidade:

```text
src/
├── modules/
│   ├── auth/
│   ├── despesas/
│   ├── aprovacoes/
│   └── fx/
├── middlewares/
│   ├── auth.middleware.js
│   └── error.middleware.js
├── utils/
│   ├── AppError.js
│   └── cache.js
├── config/
│   └── db.js
├── app.js
└── server.js

```

### Definição das Camadas:

* **Controller:** Responsável pela camada HTTP.
* **Service:** Contém as regras de negócio.
* **Repository:** Acesso ao banco de dados.
* **Middleware:** Autenticação e tratamento global de erros.

---

## Setup do Projeto

1. **Clonar o repositório:**
```bash
git clone https://github.com/javagirardi/api-despesas.git
cd api-despesas

```


2. **Instalar dependências:**
```bash
npm install

```



---

##  Configuração do Banco de Dados

1. **Criar banco:**
```sql
CREATE DATABASE despesas_db;

```


2. **Executar o schema:**
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE despesas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    solicitante_email TEXT NOT NULL,
    centro_custo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    valor NUMERIC(12,2) NOT NULL,
    moeda TEXT DEFAULT 'BRL',
    status TEXT NOT NULL CHECK (status IN ('rascunho','enviado','aprovado','rejeitado')),
    criado_em TIMESTAMP DEFAULT NOW(),
    atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE aprovacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    despesa_id UUID NOT NULL,
    aprovador_email TEXT NOT NULL,
    acao TEXT NOT NULL CHECK (acao IN ('aprovado','rejeitado')),
    comentario TEXT,
    criado_em TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_despesa FOREIGN KEY (despesa_id) REFERENCES despesas(id) ON DELETE CASCADE
);

```



---

##  Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes chaves:

| Variável | Descrição |
| --- | --- |
| **PORT** | Porta da aplicação |
| **DATABASE_URL** | String de conexão com PostgreSQL |
| **JWT_SECRET** | Chave para geração e validação do JWT |
| **FX_CACHE_TTL** | Tempo de cache da cotação em segundos |

---

##  Executando o Projeto

* **Modo desenvolvimento:** `npm run dev`
* **Modo produção:** `npm start`
* **Servidor disponível em:** `http://localhost:3000`

---

##  Autenticação

**Login:** `POST /auth/login`

**Body:**

```json
{
  "email": "admin@email.com",
  "senha": "123456"
}

```

**Resposta:**

```json
{
  "access_token": "jwt_token_aqui"
}

```

> **Nota:** Rotas protegidas exigem o header `Authorization: Bearer <token>`.

---

## Endpoints Principais

### Despesas

* **POST /despesas**: Criar despesa.
* **GET /despesas**: Listar despesas (Filtros: `status`, `centro_custo`, `min_valor`, `max_valor`, `q`).
* **GET /despesas/:id**: Buscar por ID.
* **PUT /despesas/:id**: Editar (apenas se status = rascunho).
* **POST /despesas/:id/enviar**: Enviar para aprovação.

### Aprovação

* **POST /despesas/:id/aprovar**: Aprovar despesa.
* **POST /despesas/:id/rejeitar**: Rejeitar despesa.

---

## Regras de Negócio

* Edição restrita ao status **rascunho**.
* Aprovação permitida apenas para status **enviado**.
* Valores acima de **5000 BRL** exigem comentário obrigatório.
* Toda ação gera registro automático na tabela `aprovacoes`.
* Tratamento global de erros com retornos padronizados (400, 401, 404, 409, 502).

---

## Câmbio e Conversão

* **GET /fx?from=BRL&to=USD**: Integração com API PTAX do Banco Central (com cache).
* **GET /despesas/:id/resumo**: Retorna os dados da despesa com o valor convertido para USD.

---

## Fluxo de Teste Recomendado (Postman)

1. Realizar Login.
2. Criar uma despesa.
3. Editar a despesa criada.
4. Enviar para aprovação.
5. Tentar aprovar/rejeitar (testar validação de > 5000).
6. Testar filtros de busca e resumo de conversão.

---
