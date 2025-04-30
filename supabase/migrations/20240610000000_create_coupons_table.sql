-- Check the type of id in offers table to determine offer_id type in coupons
DO $$
DECLARE
    offer_id_type TEXT;
BEGIN
    -- Get the data type of the id column in the offers table
    SELECT data_type INTO offer_id_type
    FROM information_schema.columns
    WHERE table_name = 'offers' AND column_name = 'id';
    
    -- Create the coupons table with the appropriate type for offer_id
    IF offer_id_type = 'uuid' THEN
        -- Create coupons table with UUID offer_id
        CREATE TABLE IF NOT EXISTS coupons (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            code VARCHAR(20) NOT NULL UNIQUE,
            employee_id INTEGER NOT NULL REFERENCES employees(id),
            offer_id UUID NOT NULL REFERENCES offers(id),
            status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, USED, EXPIRED
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
            used_at TIMESTAMP WITH TIME ZONE,
            CONSTRAINT unique_coupon_code UNIQUE (code)
        );
        RAISE NOTICE 'Created coupons table with UUID offer_id';
    ELSE
        -- Create coupons table with INTEGER offer_id
        CREATE TABLE IF NOT EXISTS coupons (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            code VARCHAR(20) NOT NULL UNIQUE,
            employee_id INTEGER NOT NULL REFERENCES employees(id),
            offer_id INTEGER NOT NULL REFERENCES offers(id),
            status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, USED, EXPIRED
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
            used_at TIMESTAMP WITH TIME ZONE,
            CONSTRAINT unique_coupon_code UNIQUE (code)
        );
        RAISE NOTICE 'Created coupons table with INTEGER offer_id';
    END IF;
END
$$;

-- Create indexes for faster queries if they don't already exist
DO $$
BEGIN
    -- Check if employee_id index exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_coupons_employee_id'
    ) THEN
        CREATE INDEX idx_coupons_employee_id ON coupons(employee_id);
        RAISE NOTICE 'Created index idx_coupons_employee_id';
    ELSE
        RAISE NOTICE 'Index idx_coupons_employee_id already exists';
    END IF;

    -- Check if offer_id index exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_coupons_offer_id'
    ) THEN
        CREATE INDEX idx_coupons_offer_id ON coupons(offer_id);
        RAISE NOTICE 'Created index idx_coupons_offer_id';
    ELSE
        RAISE NOTICE 'Index idx_coupons_offer_id already exists';
    END IF;

    -- Check if status index exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'idx_coupons_status'
    ) THEN
        CREATE INDEX idx_coupons_status ON coupons(status);
        RAISE NOTICE 'Created index idx_coupons_status';
    ELSE
        RAISE NOTICE 'Index idx_coupons_status already exists';
    END IF;
END
$$;

-- Add a function to set the valid_until date based on the offers table
CREATE OR REPLACE FUNCTION set_coupon_expiry()
RETURNS TRIGGER AS $$
BEGIN
  -- If valid_until is not provided, get it from the offer
  IF NEW.valid_until IS NULL THEN
    SELECT o.valid_until INTO NEW.valid_until
    FROM offers o
    WHERE o.id = NEW.offer_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add a trigger to automatically set valid_until when a coupon is created
-- Drop the trigger if it exists to avoid errors
DROP TRIGGER IF EXISTS tr_set_coupon_expiry ON coupons;

-- Create the trigger
CREATE TRIGGER tr_set_coupon_expiry
BEFORE INSERT ON coupons
FOR EACH ROW
EXECUTE FUNCTION set_coupon_expiry(); 