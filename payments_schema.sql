-- 1. Create the 'payments' table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    amount NUMERIC NOT NULL,
    plan TEXT,
    status TEXT CHECK (status IN ('paid', 'failed', 'refunded')),
    provider TEXT, -- e.g., 'stripe', 'paypal'
    transaction_id TEXT UNIQUE -- The unique ID from the payment provider
);

-- 2. Add comments to explain the columns
COMMENT ON COLUMN payments.user_id IS 'Links to the user who made the payment.';
COMMENT ON COLUMN payments.provider IS 'The external payment provider used.';
COMMENT ON COLUMN payments.transaction_id IS 'The unique transaction ID from the payment provider to prevent duplicate records.';

-- 3. Enable Row Level Security (RLS)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies
CREATE POLICY "Users can view their own payment history."
ON payments FOR SELECT
USING ( auth.uid() = user_id );

CREATE POLICY "Admins can view all payment history."
ON payments FOR SELECT
USING ( get_my_role() = 'admin' );

CREATE POLICY "Admins can manage all payment records."
ON payments FOR ALL
USING ( get_my_role() = 'admin' )
WITH CHECK ( get_my_role() = 'admin' );

-- 5. Add the new table to the realtime publication so you can listen for changes
ALTER PUBLICATION supabase_realtime ADD TABLE payments;
