-- Update assets table to use wallet addresses instead of UUID foreign keys
-- Remove foreign key constraints and change owner_id to VARCHAR

ALTER TABLE assets 
  DROP CONSTRAINT IF EXISTS assets_owner_id_fkey,
  DROP CONSTRAINT IF EXISTS assets_assigned_nominee_id_fkey;

ALTER TABLE assets 
  ALTER COLUMN owner_id TYPE VARCHAR(255),
  ALTER COLUMN assigned_nominee_id TYPE VARCHAR(255);
