-- Ensure the partners table exists with all expected columns used by the app
CREATE TABLE IF NOT EXISTS partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT,
    business_type TEXT,
    email TEXT,
    phone TEXT,
    website TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    country TEXT,
    pincode TEXT,
    employee_count INTEGER,
    partnership_type TEXT,
    image_url TEXT,
    additional_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE partners
    ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id) ON DELETE SET NULL;

ALTER TABLE partners
    ADD COLUMN IF NOT EXISTS company_name TEXT;

ALTER TABLE partners
    ADD COLUMN IF NOT EXISTS business_type TEXT;

ALTER TABLE partners
    ADD COLUMN IF NOT EXISTS email TEXT;

ALTER TABLE partners
    ADD COLUMN IF NOT EXISTS phone TEXT;

ALTER TABLE partners
    ADD COLUMN IF NOT EXISTS website TEXT;

ALTER TABLE partners
    ADD COLUMN IF NOT EXISTS address TEXT;

ALTER TABLE partners
    ADD COLUMN IF NOT EXISTS city TEXT;

ALTER TABLE partners
    ADD COLUMN IF NOT EXISTS state TEXT;

ALTER TABLE partners
    ADD COLUMN IF NOT EXISTS country TEXT;

ALTER TABLE partners
    ADD COLUMN IF NOT EXISTS pincode TEXT;

ALTER TABLE partners
    ADD COLUMN IF NOT EXISTS employee_count INTEGER;

ALTER TABLE partners
    ADD COLUMN IF NOT EXISTS partnership_type TEXT DEFAULT 'Standard';

ALTER TABLE partners
    ADD COLUMN IF NOT EXISTS image_url TEXT;

ALTER TABLE partners
    ADD COLUMN IF NOT EXISTS additional_note TEXT;

ALTER TABLE partners
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_partner_select" ON partners;

CREATE POLICY "allow_partner_select"
ON partners
FOR SELECT
TO authenticated
USING (true);

