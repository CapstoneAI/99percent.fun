CREATE TABLE IF NOT EXISTS tokens (
  id SERIAL PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  ticker VARCHAR(16) NOT NULL,
  contract_address VARCHAR(64) UNIQUE,
  creator_wallet VARCHAR(64) NOT NULL,
  type VARCHAR(8) NOT NULL CHECK (type IN ('human', 'agent')),
  description TEXT,
  image_url TEXT,
  twitter_url TEXT,
  telegram_url TEXT,
  website_url TEXT,
  volume_usd DECIMAL DEFAULT 0,
  market_cap DECIMAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  is_daily_pick BOOLEAN DEFAULT FALSE,
  daily_pick_date DATE
);

CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  token_address VARCHAR(64) NOT NULL,
  wallet VARCHAR(64) NOT NULL,
  content TEXT NOT NULL,
  likes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tokens_type ON tokens(type);
CREATE INDEX IF NOT EXISTS idx_tokens_created ON tokens(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tokens_volume ON tokens(volume_usd DESC);
CREATE INDEX IF NOT EXISTS idx_comments_token ON comments(token_address);
