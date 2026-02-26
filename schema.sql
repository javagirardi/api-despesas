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
  status TEXT NOT NULL DEFAULT 'rascunho'
  CHECK (status IN ('rascunho','enviado','aprovado','rejeitado')),
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

