/*
  # Create transactions table

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `description` (text)
      - `amount` (numeric)
      - `type` (text)
      - `date` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `transactions` table
    - Add policies for authenticated users to manage their own transactions
*/

CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  description text NOT NULL,
  amount numeric NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  date timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
  ON transactions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
  ON transactions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- =========================
-- TABELAS DE CONTAS E CARTÕES
-- =========================

-- Criação da tabela de contas bancárias
CREATE TABLE accounts (
  id serial PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  bank text NOT NULL,
  balance numeric NOT NULL DEFAULT 0,
  type text NOT NULL CHECK (type IN ('checking', 'savings')),
  created_at timestamptz DEFAULT now()
);

-- Criação da tabela de cartões
CREATE TABLE cards (
  id serial PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  bank text NOT NULL,
  limit numeric NOT NULL,
  available_limit numeric NOT NULL,
  closing_day integer NOT NULL CHECK (closing_day >= 1 AND closing_day <= 31),
  due_day integer NOT NULL CHECK (due_day >= 1 AND due_day <= 31),
  created_at timestamptz DEFAULT now()
);

-- Habilita RLS nas duas tabelas
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- Policies para accounts
CREATE POLICY "Users can view their own accounts"
  ON accounts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own accounts"
  ON accounts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own accounts"
  ON accounts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own accounts"
  ON accounts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies para cards
CREATE POLICY "Users can view their own cards"
  ON cards
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cards"
  ON cards
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cards"
  ON cards
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cards"
  ON cards
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);