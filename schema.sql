-- Table for Jurisdictions (Provinces/Territories)
CREATE TABLE jurisdictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type TEXT,
    abbreviation TEXT NOT NULL,
    flag_url TEXT,
    municipalities TEXT[]
);

-- Table for Properties
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jurisdiction_id UUID REFERENCES jurisdictions(id),
    address TEXT NOT NULL,
    municipality TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    price NUMERIC,
    market_value TEXT,
    auction_date TIMESTAMPTZ,
    date_posted TIMESTAMPTZ DEFAULT now(),
    sold_price TEXT,
    redeemable_info TEXT,
    status TEXT,
    sale_type TEXT,
    property_type TEXT,
    features TEXT[],
    images TEXT[],
    description TEXT,
    land_description TEXT,
    tax_amount NUMERIC,
    liens TEXT[],
    owner TEXT,
    property_size TEXT,
    coordinates JSONB,
    latitude REAL,
    longitude REAL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table for Property Identifiers (One-to-Many with Properties)
CREATE TABLE property_identifiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    type TEXT,
    value TEXT,
    issuing_authority TEXT
);

-- Table for Assessment Identifiers (One-to-Many with Properties)
CREATE TABLE assessment_identifiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    type TEXT,
    value TEXT,
    authority TEXT
);

-- Table for Tax Sales (One-to-Many with Properties)
CREATE TABLE tax_sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    sale_status TEXT,
    sale_date TIMESTAMPTZ,
    taxes_owing NUMERIC,
    municipality TEXT
);

-- Table for Education Articles
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT,
    excerpt TEXT,
    content TEXT,
    date TIMESTAMPTZ,
    image TEXT,
    pdf_url TEXT,
    video_url TEXT,
    is_qa BOOLEAN DEFAULT false
);

-- Table for FAQs
CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT,
    category TEXT
);

-- Function to automatically update a 'profiles' table when a new user signs up
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- Trigger to call the function when a new user is added to auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Grant permissions on the new trigger
grant execute on function public.handle_new_user() to postgres, anon, authenticated, service_role;

-- Enable Realtime for all tables
alter publication supabase_realtime add table jurisdictions, properties, property_identifiers, assessment_identifiers, tax_sales, articles, faqs;
