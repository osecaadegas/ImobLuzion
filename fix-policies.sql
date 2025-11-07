-- Fix for infinite recursion in RLS policies
-- Run this in Supabase SQL Editor to fix the policy issue

-- First, drop all existing policies to start fresh
DROP POLICY IF EXISTS "Properties are viewable by everyone" ON properties;
DROP POLICY IF EXISTS "Only admins can modify properties" ON properties;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;

-- Create simple, non-recursive policies
-- Properties: Anyone can read, only authenticated users can modify
CREATE POLICY "Anyone can read properties" ON properties
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can modify properties" ON properties
  FOR ALL USING (auth.uid() IS NOT NULL);

-- User profiles: Simple policies without recursion
CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can insert user profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to read other profiles (needed for admin checks)
CREATE POLICY "Users can read all profiles" ON user_profiles
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Update your user to be admin (replace with your actual email)
UPDATE user_profiles 
SET role = 'admin' 
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'osecaadegas95@gmail.com'
);

-- If the user doesn't exist, let's see what users we have
-- Run this query to see your user ID:
-- SELECT id, email FROM auth.users;