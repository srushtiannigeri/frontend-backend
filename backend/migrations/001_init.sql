-- Enable pgcrypto for gen_random_uuid
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Core users table with protocol roles
CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,     -- bcrypt hash
  role VARCHAR(30) NOT NULL,       -- OWNER/NOMINEE/ACCESS_NOMINEE/VERIFIER/ISSUER/REVIEWER
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);

-- Minimal assets table for encrypted objects stored on IPFS
CREATE TABLE IF NOT EXISTS assets (
  asset_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  encrypted_cid TEXT NOT NULL,   -- IPFS CID for ciphertext
  content_hash TEXT,             -- hash of ciphertext (integrity)
  assigned_nominee_id UUID REFERENCES users(user_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assets_owner ON assets (owner_id);
CREATE INDEX IF NOT EXISTS idx_assets_nominee ON assets (assigned_nominee_id);


