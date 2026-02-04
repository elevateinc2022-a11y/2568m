-- Function to update 'updated_at' column, used by multiple tables
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- 1. profiles table (stores user data and roles)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text UNIQUE NOT NULL,
  role text DEFAULT 'user'::text NOT NULL,
  favorites jsonb DEFAULT '[]'::jsonb NOT NULL,
  saved_searches jsonb DEFAULT '[]'::jsonb NOT NULL,
  subscription_status text DEFAULT 'trial'::text NOT NULL,
  subscription_plan text DEFAULT 'monthly'::text NOT NULL,
  subscription_start_date timestamptz DEFAULT now() NOT NULL,
  subscription_next_billing_date timestamptz DEFAULT now() NOT NULL,
  subscription_trial_end_date timestamptz DEFAULT (now() + '7 days'::interval) NOT NULL,
  subscription_auto_renew boolean DEFAULT false NOT NULL,
  subscription_cancel_at_period_end boolean DEFAULT false NOT NULL,
  payment_history jsonb DEFAULT '[]'::jsonb NOT NULL,
  billing_address jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX profiles_email_idx ON public.profiles USING btree (email);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view and update their own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update any profile" ON public.profiles
  FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can insert profiles" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Allow new authenticated users to create a profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- 2. jurisdictions table
CREATE TABLE public.jurisdictions (
  id text NOT NULL PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL,
  abbreviation text NOT NULL,
  flag_url text,
  municipalities jsonb DEFAULT '[]'::jsonb NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX jurisdictions_abbreviation_idx ON public.jurisdictions USING btree (abbreviation);
CREATE INDEX jurisdictions_name_idx ON public.jurisdictions USING btree (name);
ALTER TABLE public.jurisdictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.jurisdictions
  FOR SELECT USING (TRUE);
CREATE POLICY "Admins can insert jurisdictions" ON public.jurisdictions
  FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update jurisdictions" ON public.jurisdictions
  FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete jurisdictions" ON public.jurisdictions
  FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE TRIGGER update_jurisdictions_updated_at BEFORE UPDATE ON public.jurisdictions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- 3. properties table
CREATE TABLE public.properties (
  id text NOT NULL PRIMARY KEY,
  jurisdiction_id text REFERENCES public.jurisdictions(id) ON DELETE CASCADE,
  address text NOT NULL,
  municipality text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text,
  price real NOT NULL,
  market_value text,
  auction_date date,
  date_posted date DEFAULT now() NOT NULL,
  sold_price text,
  redeemable_info text,
  status text NOT NULL,
  sale_type text NOT NULL,
  property_type text NOT NULL,
  features jsonb DEFAULT '[]'::jsonb NOT NULL,
  images jsonb DEFAULT '[]'::jsonb NOT NULL,
  description text,
  land_description text,
  tax_amount real,
  liens jsonb DEFAULT '[]'::jsonb NOT NULL,
  owner text,
  property_size text,
  coordinates jsonb,
  latitude real,
  longitude real,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX properties_status_idx ON public.properties USING btree (status);
CREATE INDEX properties_jurisdiction_id_idx ON public.properties USING btree (jurisdiction_id);
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.properties
  FOR SELECT USING (TRUE);
CREATE POLICY "Admins can insert properties" ON public.properties
  FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update properties" ON public.properties
  FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete properties" ON public.properties
  FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- 4. articles table
CREATE TABLE public.articles (
  id text NOT NULL PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  date date NOT NULL,
  image text,
  pdf_url text,
  video_url text,
  is_qa boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.articles
  FOR SELECT USING (TRUE);
CREATE POLICY "Admins can insert articles" ON public.articles
  FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update articles" ON public.articles
  FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete articles" ON public.articles
  FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- 5. faqs table
CREATE TABLE public.faqs (
  id text NOT NULL PRIMARY KEY,
  question text NOT NULL,
  answer text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.faqs
  FOR SELECT USING (TRUE);
CREATE POLICY "Admins can insert faqs" ON public.faqs
  FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update faqs" ON public.faqs
  FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete faqs" ON public.faqs
  FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- 6. site_config table (single row configuration)
CREATE TABLE public.site_config (
  id text NOT NULL PRIMARY KEY DEFAULT 'main_config',
  logo_url text,
  brand_name text NOT NULL,
  brand_accent text NOT NULL,
  hero_title text NOT NULL,
  hero_subtitle text,
  hero_image_url text,
  stats_badge1_title text,
  stats_badge1_subtitle text,
  stats_badge2_title text,
  stats_badge2_subtitle text,
  support_email text,
  office_hours text,
  footer_description text,
  newsletter_headline text,
  footer_copyright text,
  news_items jsonb DEFAULT '[]'::jsonb,
  login_headline text,
  login_subheadline text,
  signup_headline text,
  signup_subheadline text,
  signup_benefits jsonb DEFAULT '[]'::jsonb,
  facebook_url text,
  instagram_url text,
  tiktok_url text,
  twitter_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.site_config
  FOR SELECT USING (TRUE);
CREATE POLICY "Admins can update site config" ON public.site_config
  FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can insert site config" ON public.site_config
  FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE TRIGGER update_site_config_updated_at BEFORE UPDATE ON public.site_config
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- 7. legal_content table (single row legal documents)
CREATE TABLE public.legal_content (
  id text NOT NULL PRIMARY KEY DEFAULT 'main_legal',
  privacy_policy text NOT NULL,
  terms_conditions text NOT NULL,
  cookie_policy text NOT NULL,
  disclaimer text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.legal_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.legal_content
  FOR SELECT USING (TRUE);
CREATE POLICY "Admins can update legal content" ON public.legal_content
  FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can insert legal content" ON public.legal_content
  FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE TRIGGER update_legal_content_updated_at BEFORE UPDATE ON public.legal_content
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- 8. about_content table (single row about us content)
CREATE TABLE public.about_content (
  id text NOT NULL PRIMARY KEY DEFAULT 'main_about',
  introduction text NOT NULL,
  what_we_do text NOT NULL,
  why_we_exist text NOT NULL,
  our_approach text NOT NULL,
  vision text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.about_content
  FOR SELECT USING (TRUE);
CREATE POLICY "Admins can update about content" ON public.about_content
  FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can insert about content" ON public.about_content
  FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE TRIGGER update_about_content_updated_at BEFORE UPDATE ON public.about_content
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- 9. payments table
CREATE TABLE public.payments (
  id text NOT NULL PRIMARY KEY,
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount real NOT NULL,
  plan text NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert their own payments" ON public.payments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Admins can view all payments" ON public.payments
  FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update payments" ON public.payments
  FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete payments" ON public.payments
  FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- 10. property_identifiers table
CREATE TABLE public.property_identifiers (
  id text NOT NULL PRIMARY KEY,
  property_id text REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  value text NOT NULL,
  issuing_authority text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.property_identifiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.property_identifiers
  FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage property identifiers" ON public.property_identifiers
  FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE TRIGGER update_property_identifiers_updated_at BEFORE UPDATE ON public.property_identifiers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- 11. assessment_identifiers table
CREATE TABLE public.assessment_identifiers (
  id text NOT NULL PRIMARY KEY,
  property_id text REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  value text NOT NULL,
  authority text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.assessment_identifiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.assessment_identifiers
  FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage assessment identifiers" ON public.assessment_identifiers
  FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE TRIGGER update_assessment_identifiers_updated_at BEFORE UPDATE ON public.assessment_identifiers
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- 12. tax_sales table
CREATE TABLE public.tax_sales (
  id text NOT NULL PRIMARY KEY,
  property_id text REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  sale_status text NOT NULL,
  sale_date date NOT NULL,
  taxes_owing real NOT NULL,
  municipality text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.tax_sales ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.tax_sales
  FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage tax sales" ON public.tax_sales
  FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE TRIGGER update_tax_sales_updated_at BEFORE UPDATE ON public.tax_sales
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
