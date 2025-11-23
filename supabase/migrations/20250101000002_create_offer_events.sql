-- Create table to capture offer analytics events (impressions, clicks, etc.)
CREATE TABLE IF NOT EXISTS offer_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL,
    offer_id UUID NOT NULL,
    employee_id INTEGER,
    event_type TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_offer_events_company ON offer_events(company_id);
CREATE INDEX IF NOT EXISTS idx_offer_events_offer ON offer_events(offer_id);
CREATE INDEX IF NOT EXISTS idx_offer_events_event_type ON offer_events(event_type);
CREATE INDEX IF NOT EXISTS idx_offer_events_created_at ON offer_events(created_at);

ALTER TABLE offer_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employees can log offer events"
    ON offer_events
    FOR INSERT
    TO authenticated
    WITH CHECK (true);


