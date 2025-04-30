-- Create company_registration_requests table
CREATE TABLE IF NOT EXISTS company_registration_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    industry TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    website TEXT,
    tax_id TEXT NOT NULL,
    description TEXT,
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    password TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_company_registration_requests_status ON company_registration_requests(status);
CREATE INDEX idx_company_registration_requests_contact_email ON company_registration_requests(contact_email);

-- Add RLS policies
ALTER TABLE company_registration_requests ENABLE ROW LEVEL SECURITY;

-- Allow admins to view all requests
CREATE POLICY "Admins can view all registration requests"
    ON company_registration_requests
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Allow admins to update request status
CREATE POLICY "Admins can update registration requests"
    ON company_registration_requests
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Allow anyone to create registration requests
CREATE POLICY "Anyone can create registration requests"
    ON company_registration_requests
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Create function to handle request approval
CREATE OR REPLACE FUNCTION approve_company_registration(request_id UUID)
RETURNS void AS $$
DECLARE
    request_data company_registration_requests%ROWTYPE;
BEGIN
    -- Get the request data
    SELECT * INTO request_data
    FROM company_registration_requests
    WHERE id = request_id AND status = 'pending';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Request not found or already processed';
    END IF;

    -- Create the company record
    INSERT INTO companies (
        name,
        industry,
        location,
        employees,
        revenue,
        offers,
        status,
        joined,
        address,
        postal_code,
        website,
        tax_id,
        description,
        contact_name,
        contact_phone
    ) VALUES (
        request_data.name,
        request_data.industry,
        CONCAT(request_data.city, ', ', request_data.state, ', ', request_data.country),
        0,
        0,
        0,
        'Active',
        NOW(),
        request_data.address,
        request_data.postal_code,
        request_data.website,
        request_data.tax_id,
        request_data.description,
        request_data.contact_name,
        request_data.contact_phone
    );

    -- Update the request status
    UPDATE company_registration_requests
    SET status = 'approved',
        updated_at = NOW()
    WHERE id = request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 