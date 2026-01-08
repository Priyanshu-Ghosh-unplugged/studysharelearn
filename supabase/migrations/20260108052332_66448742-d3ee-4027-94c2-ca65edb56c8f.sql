-- Fix CLIENT_SIDE_AUTH: Validate role in handle_new_user() trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role;
BEGIN
  -- Validate and sanitize role, default to 'student' (least privilege)
  user_role := COALESCE(
    CASE 
      WHEN (NEW.raw_user_meta_data ->> 'role') IN ('student', 'tutor') 
      THEN (NEW.raw_user_meta_data ->> 'role')::app_role
      ELSE 'student'::app_role
    END,
    'student'::app_role
  );
  
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name'
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);
  
  IF user_role = 'tutor' THEN
    INSERT INTO public.tutor_profiles (user_id)
    VALUES (NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Fix OPEN_ENDPOINTS: Create newsletter_subscribers table for proper storage
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ,
  source TEXT DEFAULT 'website'
);

-- Enable RLS on newsletter_subscribers
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to subscribe (insert)
CREATE POLICY "Anyone can subscribe" 
ON public.newsletter_subscribers
FOR INSERT WITH CHECK (true);

-- Fix OPEN_ENDPOINTS: Add rate limiting trigger for bookings
CREATE OR REPLACE FUNCTION public.check_booking_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  recent_count INTEGER;
BEGIN
  -- Count bookings created by this student in last hour
  SELECT COUNT(*) INTO recent_count
  FROM public.bookings
  WHERE student_id = NEW.student_id
    AND created_at > NOW() - INTERVAL '1 hour';
  
  IF recent_count >= 10 THEN
    RAISE EXCEPTION 'Rate limit exceeded: Maximum 10 bookings per hour';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Apply rate limit trigger to bookings
DROP TRIGGER IF EXISTS booking_rate_limit ON public.bookings;
CREATE TRIGGER booking_rate_limit
  BEFORE INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.check_booking_rate_limit();