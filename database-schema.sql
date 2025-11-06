-- Real Estate App Database Schema for Supabase
-- Run these commands in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable trigram extension for better text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Properties table
CREATE TABLE properties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  
  -- Location as JSONB for flexibility
  location JSONB NOT NULL DEFAULT '{}',
  
  -- Property details as JSONB
  details JSONB NOT NULL DEFAULT '{}',
  
  -- Features and amenities as text arrays
  features TEXT[] DEFAULT ARRAY[]::TEXT[],
  amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Property type and status
  type TEXT NOT NULL CHECK (type IN ('sale', 'rent')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'sold', 'rented')),
  
  -- Financial data as JSONB
  financials JSONB DEFAULT '{}',
  
  -- Images as text array (URLs)
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Dates
  sold_date TIMESTAMP WITH TIME ZONE,
  listed_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Additional fields
  is_archived BOOLEAN DEFAULT FALSE,
  agent JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_price ON properties(price);
CREATE INDEX idx_properties_location_city ON properties ((location ->> 'city'));

-- Additional search indexes for real estate app
CREATE INDEX idx_properties_title_search ON properties USING GIN (title gin_trgm_ops);
CREATE INDEX idx_properties_location_search ON properties USING GIN ((location ->> 'city') gin_trgm_ops);
CREATE INDEX idx_properties_property_type ON properties ((details ->> 'propertyType'));
CREATE INDEX idx_properties_bedrooms ON properties ((details ->> 'bedrooms'));
CREATE INDEX idx_properties_price_range ON properties(price) WHERE status = 'active';

-- Update the updated_date automatically
CREATE OR REPLACE FUNCTION update_updated_date_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_date = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_properties_updated_date 
    BEFORE UPDATE ON properties 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_date_column();

-- User profiles table (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for properties
-- Anyone can read properties
CREATE POLICY "Properties are viewable by everyone" ON properties
  FOR SELECT USING (true);

-- Only admins can insert/update/delete properties
CREATE POLICY "Only admins can modify properties" ON properties
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- RLS Policies for user_profiles
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-images', 'property-images', true);

-- Storage policies for property images
CREATE POLICY "Property images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'property-images');

CREATE POLICY "Only admins can upload property images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'property-images' AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Insert sample data (optional)
INSERT INTO properties (
  title,
  description,
  price,
  location,
  details,
  features,
  type,
  status,
  financials,
  images
) VALUES 
(
  'Apartamento Moderno em Lisboa',
  'Apartamento T2 completamente renovado no centro de Lisboa.',
  450000,
  '{"address": "Rua Augusta, 123", "city": "Lisboa", "state": "Lisboa", "zipCode": "1100-048"}',
  '{"bedrooms": 2, "bathrooms": 1, "sqft": 850, "propertyType": "apartment", "yearBuilt": 2020}',
  ARRAY['Ar Condicionado', 'Cozinha Equipada', 'Terraço', 'Elevador'],
  'sale',
  'sold',
  '{"purchasePrice": 350000, "projectCosts": 50000, "totalInvestment": 400000, "soldPrice": 450000, "profit": 50000, "profitMargin": 12.5}',
  ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2']
),
(
  'Moradia com Jardim no Porto',
  'Moradia T3 com jardim privado e garagem.',
  320000,
  '{"address": "Rua das Flores, 45", "city": "Porto", "state": "Porto", "zipCode": "4000-123"}',
  '{"bedrooms": 3, "bathrooms": 2, "sqft": 1200, "propertyType": "house", "yearBuilt": 1995}',
  ARRAY['Jardim', 'Garagem', 'Lareira', 'Sótão'],
  'sale',
  'active',
  '{}',
  ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6']
);

-- Create admin user (replace with your email)
-- This should be run after you sign up with your admin email
UPDATE user_profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'your-admin-email@example.com'
);