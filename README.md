API de Aprovação de Despesas

API para gerenciamento de despesas com fluxo de aprovação, regras de negócio, autenticação JWT e integração com a API do Banco Central (PTAX).
Autor - Javan Moisés Girardi

Tecnologias Utilizadas

Node.js
Express
PostgreSQL
JWT (jsonwebtoken)
Axios
UUID
Dotenv
Nodemon (dev)
API PTAX – Banco Central do Brasil

Arquitetura

O projeto segue separação em camadas:

src/
 ├── modules/
 │    ├── auth/
 │    ├── despesas/
 │    ├── aprovacoes/
 │    └── fx/
 │
 ├── middlewares/
 │    ├── auth.middleware.js
 │    └── error.middleware.js
 │
 ├── utils/
 │    └── AppError.js
      └── cache.js
 │
 ├── config/
 │    └── db.js
 │
 ├── app.js
 └── server.js
 
Camadas: 

Controller → Lida com HTTP
Service → Regras de negócio
Repository → Acesso ao banco

Middleware → Autenticação e tratamento global de erros

Setup do Projeto:
1 - Clonar repositório
git clone <(https://github.com/javagirardi/api-despesas.git)>
cd api-despesas

2 - Instalar dependências
npm install
Dependências utilizadas:
npm install express pg jsonwebtoken bcrypt dotenv axios uuid
npm install --save-dev nodemon

3 - Configurar Banco de Dados

Criar banco:

CREATE DATABASE despesas_db;

Executar o schema.sql:

/*cria a UUID direto no BD*/
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

/*cria a tabela de despesas*/
CREATE TABLE despesas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  solicitante_email TEXT NOT NULL,
  centro_custo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  valor NUMERIC(12,2) NOT NULL,
  moeda TEXT DEFAULT 'BRL',
  status TEXT NOT NULL CHECK (
    status IN ('rascunho','enviado','aprovado','rejeitado')
  ),
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

/*cria a tabela de aprovações com relacionamento entre tabelas*/
CREATE TABLE aprovacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  despesa_id UUID NOT NULL,
  aprovador_email TEXT NOT NULL,
  acao TEXT NOT NULL CHECK (
    acao IN ('aprovado','rejeitado')
  ),
  comentario TEXT,
  criado_em TIMESTAMP DEFAULT NOW(),

  CONSTRAINT fk_despesa
    FOREIGN KEY (despesa_id)
    REFERENCES despesas(id)
    ON DELETE CASCADE
);


Variáveis de Ambiente:

Criar um arquivo .env na raiz do projeto:
PORT=3000
DATABASE_URL=postgres://postgres:[senha]@localhost:5432/despesas_db
JWT_SECRET= [sua_chave_super_secreta]

FX_CACHE_TTL=600
Descrição
Variável	Descrição
PORT	Porta da aplicação
DATABASE_URL	String de conexão com PostgreSQL
JWT_SECRET	Chave para geração do token JWT
FX_CACHE_TTL = 600 (o tempo do cache em segundos) 
 

Executando o Projeto

Modo desenvolvimento:
npm run dev
Modo produção:
npm start

Servidor sobe em:
http://localhost:3000

Autenticação

Endpoint:
POST /auth/login
Body:
{
  "email": "admin@email.com",
  "senha": "123456"
}

Retorna:
{
  "access_token": "jwt_token_aqui"
}

As rotas protegidas exigem:

Authorization: Bearer <token>
Endpoints Principais - 
Despesas:
Criar despesa
POST /despesas
Listar despesas (com filtros)
GET /despesas

Filtros opcionais:
status
centro_custo
min_valor
max_valor
q (busca textual em descricao e centro_custo)

Exemplo:

GET /despesas?status=enviado&min_valor=1000&q=notebook
Buscar por ID
GET /despesas/:id
Editar (apenas se rascunho)
PUT /despesas/:id
Enviar para aprovação
POST /despesas/:id/enviar

Aprovação
Aprovar
POST /despesas/:id/aprovar
Rejeitar
POST /despesas/:id/rejeitar

Regras
Só pode aprovar/rejeitar se status == enviado
Valor > 5000 BRL exige comentário
Registro é salvo na tabela aprovacoes

Câmbio
Cotação
GET /fx?from=BRL&to=USD
Integração com API PTAX do Banco Central.
Possui cache configurável via FX_CACHE_TTL.

Resumo com conversão
GET /despesas/:id/resumo

Retorna valor convertido para USD.

Regras de Negócio Implementadas - 

Edição restrita a status rascunho
Aprovação apenas para status enviado
Registro obrigatório em aprovacoes
Validação de comentário para valores > 5000
Tratamento global de erros
Retorno padronizado de erro
Uso de HTTP status codes conforme documentação

Testes via Postman - 
Fluxo recomendado:

Login
Criar despesa
Editar
Enviar
Aprovar/Rejeitar
Testar valor > 5000
Testar filtros
Testar resumo
Testar /fx
