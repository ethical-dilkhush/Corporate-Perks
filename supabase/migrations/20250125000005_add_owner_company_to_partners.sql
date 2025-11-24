-- Rename company_id to partner_company_id to better reflect stored data
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'partners'
      AND column_name = 'company_id'
  ) THEN
    EXECUTE 'ALTER TABLE partners RENAME COLUMN company_id TO partner_company_id';
  END IF;
END $$;

-- Track which company created the partnership
ALTER TABLE partners
  ADD COLUMN IF NOT EXISTS owner_company_id UUID REFERENCES companies(id) ON DELETE CASCADE;

-- Backfill existing rows by assuming the recorded company is also the owner
UPDATE partners
SET owner_company_id = COALESCE(owner_company_id, partner_company_id)
WHERE owner_company_id IS NULL;

-- Clean up old indexes and create new ones for the updated schema
DROP INDEX IF EXISTS idx_partners_company_id;
DROP INDEX IF EXISTS uniq_partners_company_id;

CREATE INDEX IF NOT EXISTS idx_partners_owner_company_id ON partners(owner_company_id);
CREATE INDEX IF NOT EXISTS idx_partners_partner_company_id ON partners(partner_company_id);

CREATE UNIQUE INDEX IF NOT EXISTS uniq_partners_owner_partner_pair
ON partners(owner_company_id, partner_company_id)
WHERE owner_company_id IS NOT NULL AND partner_company_id IS NOT NULL;

-- Update the RLS policy so companies only read their own partnerships
DROP POLICY IF EXISTS "allow_partner_select" ON partners;

CREATE POLICY "allow_partner_select"
ON partners
FOR SELECT
TO authenticated
USING (owner_company_id = auth.uid());

