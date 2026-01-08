-- Fix PUBLIC_DATA_EXPOSURE: Restrict tutor_profiles access to verified tutors only

-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Anyone can view verified tutor profiles" ON public.tutor_profiles;

-- Create policy to allow public viewing of ONLY verified tutors
CREATE POLICY "Public can view verified tutors" 
ON public.tutor_profiles
FOR SELECT USING (is_verified = true);

-- Create policy to allow tutors to view their own profile (even if not verified)
CREATE POLICY "Tutors view own profile" 
ON public.tutor_profiles
FOR SELECT USING (auth.uid() = user_id);