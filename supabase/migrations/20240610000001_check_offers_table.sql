-- Check if offers table exists and create it if it doesn't
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'offers') THEN
        -- Create offers table
        CREATE TABLE offers (
            id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
            title VARCHAR(255) NOT NULL,
            company_name VARCHAR(255) NOT NULL,
            description TEXT,
            discount_value INTEGER NOT NULL,
            valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
            category VARCHAR(100),
            image_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    ELSE
        -- Check if the id column is UUID or INTEGER
        RAISE NOTICE 'Offers table already exists, checking id column type...';
        
        -- For informational purposes, let's use an anonymous block to output the type
        DECLARE
            column_type TEXT;
        BEGIN
            SELECT data_type INTO column_type
            FROM information_schema.columns
            WHERE table_name = 'offers' AND column_name = 'id';
            
            RAISE NOTICE 'offers.id column type is: %', column_type;
        END;
    END IF;
END
$$; 