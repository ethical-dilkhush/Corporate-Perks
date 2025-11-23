-- Add company_id column to partners table to track the originating company
ALTER TABLE partners
ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);

-- Ensure lookups are fast and duplicates are prevented
CREATE INDEX IF NOT EXISTS idx_partners_company_id ON partners(company_id);

CREATE UNIQUE INDEX IF NOT EXISTS uniq_partners_company_id
ON partners(company_id)
WHERE company_id IS NOT NULL;

