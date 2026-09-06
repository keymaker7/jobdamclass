CREATE TABLE IF NOT EXISTS teachers (
 id uuid PRIMARY KEY, username text NOT NULL UNIQUE, display_name text NOT NULL,
 password_hash text NOT NULL, enabled boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS sessions (
 id uuid PRIMARY KEY, owner_id uuid NOT NULL REFERENCES teachers(id) ON DELETE CASCADE, expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expires_at);
CREATE TABLE IF NOT EXISTS portfolios (
 owner_id uuid NOT NULL REFERENCES teachers(id) ON DELETE CASCADE, id uuid NOT NULL,
 payload jsonb NOT NULL CHECK(jsonb_typeof(payload)='object'),
 updated_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(owner_id,id)
);
CREATE INDEX IF NOT EXISTS portfolios_owner_updated_idx ON portfolios(owner_id,updated_at DESC);
CREATE TABLE IF NOT EXISTS request_budgets (
 owner_id text NOT NULL, bucket text NOT NULL, count integer NOT NULL CHECK(count>0),
 expires_at timestamptz NOT NULL, PRIMARY KEY(owner_id,bucket)
);
CREATE INDEX IF NOT EXISTS budgets_expiry_idx ON request_budgets(expires_at);

