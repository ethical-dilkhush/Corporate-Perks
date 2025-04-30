-- Create pending_employee_registrations table
CREATE TABLE IF NOT EXISTS pending_employee_registrations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile VARCHAR(20),
    role VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    company_id UUID REFERENCES companies(id),
    status VARCHAR(20) DEFAULT 'pending',
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT
);

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile VARCHAR(20),
    role VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    company_id UUID REFERENCES companies(id),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Drop existing indexes if they exist
DROP INDEX IF EXISTS idx_pending_employee_registrations_company_id;
DROP INDEX IF EXISTS idx_pending_employee_registrations_status;
DROP INDEX IF EXISTS idx_employees_company_id;
DROP INDEX IF EXISTS idx_employees_status;

-- Create indexes
CREATE INDEX idx_pending_employee_registrations_company_id ON pending_employee_registrations(company_id);
CREATE INDEX idx_pending_employee_registrations_status ON pending_employee_registrations(status);
CREATE INDEX idx_employees_company_id ON employees(company_id);
CREATE INDEX idx_employees_status ON employees(status);

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert pending registrations" ON pending_employee_registrations;
DROP POLICY IF EXISTS "Companies can view their own pending registrations" ON pending_employee_registrations;
DROP POLICY IF EXISTS "Companies can update their own pending registrations" ON pending_employee_registrations;
DROP POLICY IF EXISTS "Companies can view their own employees" ON employees;
DROP POLICY IF EXISTS "Companies can manage their own employees" ON employees;

-- Add RLS policies
ALTER TABLE pending_employee_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Policy for pending_employee_registrations
CREATE POLICY "Anyone can insert pending registrations"
    ON pending_employee_registrations
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Companies can view their own pending registrations"
    ON pending_employee_registrations
    FOR SELECT
    USING (company_id = auth.uid());

CREATE POLICY "Companies can update their own pending registrations"
    ON pending_employee_registrations
    FOR UPDATE
    USING (company_id = auth.uid());

-- Policy for employees
CREATE POLICY "Companies can view their own employees"
    ON employees
    FOR SELECT
    USING (company_id = auth.uid());

CREATE POLICY "Companies can manage their own employees"
    ON employees
    FOR ALL
    USING (company_id = auth.uid()); 