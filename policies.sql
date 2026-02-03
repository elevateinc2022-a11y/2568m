-- Enable Row Level Security (RLS) for all relevant tables
ALTER TABLE jurisdictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_identifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_identifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- POLICIES FOR: jurisdictions
CREATE POLICY "Public can view jurisdictions" ON jurisdictions FOR SELECT USING (true);
CREATE POLICY "Admins can manage jurisdictions" ON jurisdictions FOR ALL USING (get_my_role() = 'admin') WITH CHECK (get_my_role() = 'admin');

-- POLICIES FOR: properties
CREATE POLICY "Public can view properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Admins can manage properties" ON properties FOR ALL USING (get_my_role() = 'admin') WITH CHECK (get_my_role() = 'admin');

-- POLICIES FOR: property_identifiers
CREATE POLICY "Public can view property identifiers" ON property_identifiers FOR SELECT USING (true);
CREATE POLICY "Admins can manage property identifiers" ON property_identifiers FOR ALL USING (get_my_role() = 'admin') WITH CHECK (get_my_role() = 'admin');

-- POLICIES FOR: assessment_identifiers
CREATE POLICY "Public can view assessment identifiers" ON assessment_identifiers FOR SELECT USING (true);
CREATE POLICY "Admins can manage assessment identifiers" ON assessment_identifiers FOR ALL USING (get_my_role() = 'admin') WITH CHECK (get_my_role() = 'admin');

-- POLICIES FOR: tax_sales
CREATE POLICY "Public can view tax sales" ON tax_sales FOR SELECT USING (true);
CREATE POLICY "Admins can manage tax sales" ON tax_sales FOR ALL USING (get_my_role() = 'admin') WITH CHECK (get_my_role() = 'admin');

-- POLICIES FOR: articles
CREATE POLICY "Public can view articles" ON articles FOR SELECT USING (true);
CREATE POLICY "Admins can manage articles" ON articles FOR ALL USING (get_my_role() = 'admin') WITH CHECK (get_my_role() = 'admin');

-- POLICIES FOR: faqs
CREATE POLICY "Public can view faqs" ON faqs FOR SELECT USING (true);
CREATE POLICY "Admins can manage faqs" ON faqs FOR ALL USING (get_my_role() = 'admin') WITH CHECK (get_my_role() = 'admin');
