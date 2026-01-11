-- =====================================================
-- COMPLETE SUPABASE SETUP FOR SONIA PUBLIC SCHOOL APP
-- Run this SQL in your own Supabase project's SQL Editor
-- =====================================================

-- 1. Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Create tables
CREATE TABLE public.classes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.students (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name text NOT NULL,
    father_name text NOT NULL,
    mother_name text NOT NULL,
    class text NOT NULL,
    roll_no text NOT NULL,
    dob date NOT NULL,
    gender text NOT NULL,
    ledger_no text,
    aadhar_no text,
    photograph_url text,
    signature_url text,
    fee_amount numeric NOT NULL DEFAULT 0,
    fee_status text NOT NULL DEFAULT 'pending',
    status text NOT NULL DEFAULT 'active',
    is_submitted boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- 3. Create helper function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- 5. Create trigger for auto-assigning admin role
-- IMPORTANT: Change 'your-admin-email@example.com' to your actual admin email
CREATE OR REPLACE FUNCTION public.handle_new_user_admin_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Change this email to your admin email
  IF NEW.email = 'hitsumankumari@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- 6. Create triggers
CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_admin_role();

-- 7. Enable Row Level Security
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS Policies

-- Classes policies
CREATE POLICY "Anyone can view classes"
ON public.classes FOR SELECT
USING (true);

CREATE POLICY "Admins can manage classes"
ON public.classes FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Students policies
CREATE POLICY "Anyone can view students for preboard form"
ON public.students FOR SELECT
USING (true);

CREATE POLICY "Admins can insert students"
ON public.students FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update students"
ON public.students FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete students"
ON public.students FOR DELETE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can update preboard fields for paid students"
ON public.students FOR UPDATE
USING (fee_status = 'paid')
WITH CHECK (fee_status = 'paid');

-- User roles policies
CREATE POLICY "Admins can view all user roles"
ON public.user_roles FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage user roles"
ON public.user_roles FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- 9. Create storage buckets (run these separately if needed)
-- Go to Storage in Supabase Dashboard and create:
-- - Bucket: "photographs" (public)
-- - Bucket: "signatures" (public)

-- =====================================================
-- SETUP COMPLETE!
-- 
-- Next steps:
-- 1. Go to Authentication > Settings in Supabase Dashboard
-- 2. Enable "Email" provider
-- 3. Disable "Confirm email" for testing (optional)
-- 4. Create storage buckets for photographs and signatures
-- 5. Update the admin email in handle_new_user_admin_role function
-- =====================================================
