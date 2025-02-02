ALTER TABLE purchases
ADD COLUMN receipt_number VARCHAR(255) NOT NULL;

-- Assuming items is a JSONB column, no migration is needed for adding a new field in JSONB.
-- If items is a structured table, you would need to alter the table structure.

ALTER TABLE user_profiles
ADD COLUMN barcode VARCHAR(255) UNIQUE NOT NULL DEFAULT 'N/A';

CREATE OR REPLACE FUNCTION generate_unique_barcode()
RETURNS TRIGGER AS $$
BEGIN
  NEW.barcode := 'BC-' || lpad(nextval('user_profiles_id_seq')::text, 10, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_unique_barcode
BEFORE INSERT ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION generate_unique_barcode();

CREATE OR REPLACE FUNCTION get_user_data_by_barcode(barcode_input VARCHAR)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  points INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.id,
    up.name,
    ul.points
  FROM 
    user_profiles up
  JOIN 
    user_levels ul ON up.user_id = ul.user_id
  WHERE 
    up.barcode = barcode_input;
END;
$$ LANGUAGE plpgsql;
