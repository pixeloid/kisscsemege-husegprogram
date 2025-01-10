/*
  # Loyalty Program Tables

  1. New Tables
    - `purchases`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `purchase_date` (timestamp)
      - `total_amount` (numeric)
      - `items` (jsonb)
      - `created_at` (timestamp)
    
    - `user_levels`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `level` (text)
      - `points` (integer)
      - `updated_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for reading and writing data
    - Add foreign key constraints

  3. Functions
    - Add function to calculate and update user level
    - Add function to calculate points from purchase amount
*/

-- Create purchases table
CREATE TABLE IF NOT EXISTS purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  purchase_date timestamptz NOT NULL DEFAULT now(),
  total_amount numeric(10,2) NOT NULL CHECK (total_amount >= 0),
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create user_levels table
CREATE TABLE IF NOT EXISTS user_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL UNIQUE,
  level text NOT NULL DEFAULT 'bronze' CHECK (level IN ('bronze', 'silver', 'gold', 'platinum')),
  points integer NOT NULL DEFAULT 0 CHECK (points >= 0),
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_levels ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS purchases_user_id_idx ON purchases(user_id);
CREATE INDEX IF NOT EXISTS user_levels_user_id_idx ON user_levels(user_id);


CREATE POLICY "System can insert purchases"
  ON purchases
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create policies for user_levels
CREATE POLICY "Users can view their own level"
  ON user_levels
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can update user levels"
  ON user_levels
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to calculate points from purchase amount
CREATE OR REPLACE FUNCTION calculate_points(amount numeric)
RETURNS integer AS $$
BEGIN
  -- 100 Ft = 1 point
  RETURN floor(amount / 100)::integer;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update user level based on points
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS trigger AS $$
BEGIN
  -- Update user level based on points
  UPDATE user_levels
  SET level = 
    CASE
      WHEN points >= 10000 THEN 'platinum'
      WHEN points >= 5000 THEN 'gold'
      WHEN points >= 2000 THEN 'silver'
      ELSE 'bronze'
    END,
    updated_at = now()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update points and level after purchase
CREATE OR REPLACE FUNCTION process_purchase()
RETURNS trigger AS $$
BEGIN
  -- Insert or update user_levels
  INSERT INTO user_levels (user_id, points)
  VALUES (
    NEW.user_id,
    calculate_points(NEW.total_amount)
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    points = user_levels.points + calculate_points(NEW.total_amount),
    updated_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
CREATE TRIGGER after_purchase_insert
  AFTER INSERT ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION process_purchase();

CREATE TRIGGER after_points_update
  AFTER UPDATE OF points ON user_levels
  FOR EACH ROW
  WHEN (NEW.points <> OLD.points)
  EXECUTE FUNCTION update_user_level();