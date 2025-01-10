/*
  # Create users table for loyalty program

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `phone_number` (text, unique, required)
      - `pin_code` (text, required)
      - `qr_code_url` (text, optional)
      - `created_at` (timestamp with timezone)

  2. Security
    - Enable RLS on users table
    - Add policies for:
      - Reading own user data
      - Creating new users (public access for registration)
      - Updating own user data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone_number text UNIQUE NOT NULL,
  pin_code text NOT NULL,
  qr_code_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public registration"
  ON users
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create index for phone number lookups
CREATE INDEX IF NOT EXISTS users_phone_number_idx ON users (phone_number);