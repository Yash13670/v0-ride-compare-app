-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ride_searches table to store user's ride comparisons
CREATE TABLE IF NOT EXISTS public.ride_searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pickup_location TEXT NOT NULL,
  destination_location TEXT NOT NULL,
  pickup_lat DOUBLE PRECISION,
  pickup_lng DOUBLE PRECISION,
  destination_lat DOUBLE PRECISION,
  destination_lng DOUBLE PRECISION,
  distance_km DOUBLE PRECISION,
  duration_mins INTEGER,
  cheapest_service TEXT,
  cheapest_price DECIMAL(10,2),
  ride_type TEXT DEFAULT 'cab',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create saved_routes table for user's favorite routes
CREATE TABLE IF NOT EXISTS public.saved_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  pickup_location TEXT NOT NULL,
  destination_location TEXT NOT NULL,
  pickup_lat DOUBLE PRECISION,
  pickup_lng DOUBLE PRECISION,
  destination_lat DOUBLE PRECISION,
  destination_lng DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ride_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_routes ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Ride Searches RLS Policies
CREATE POLICY "ride_searches_select_own" ON public.ride_searches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "ride_searches_insert_own" ON public.ride_searches FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ride_searches_delete_own" ON public.ride_searches FOR DELETE USING (auth.uid() = user_id);

-- Saved Routes RLS Policies
CREATE POLICY "saved_routes_select_own" ON public.saved_routes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "saved_routes_insert_own" ON public.saved_routes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saved_routes_update_own" ON public.saved_routes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "saved_routes_delete_own" ON public.saved_routes FOR DELETE USING (auth.uid() = user_id);
