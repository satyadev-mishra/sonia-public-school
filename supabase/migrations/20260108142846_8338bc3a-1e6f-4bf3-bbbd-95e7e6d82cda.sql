-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for role-based access
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
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

-- Create classes table for dynamic class dropdown
CREATE TABLE public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on classes
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Create students table
CREATE TABLE public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class TEXT NOT NULL,
    roll_no TEXT NOT NULL,
    student_name TEXT NOT NULL,
    father_name TEXT NOT NULL,
    mother_name TEXT NOT NULL,
    ledger_no TEXT,
    dob DATE NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    fee_amount NUMERIC NOT NULL DEFAULT 0,
    fee_status TEXT NOT NULL DEFAULT 'pending' CHECK (fee_status IN ('paid', 'pending')),
    aadhar_no TEXT,
    photograph_url TEXT,
    signature_url TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (class, roll_no)
);

-- Enable RLS on students
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for students updated_at
CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON public.students
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for user_roles
CREATE POLICY "Admins can view all user roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for classes
CREATE POLICY "Anyone can view classes"
ON public.classes
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage classes"
ON public.classes
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for students
CREATE POLICY "Anyone can view students for preboard form"
ON public.students
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can insert students"
ON public.students
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update students"
ON public.students
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete students"
ON public.students
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anonymous can update their own preboard data"
ON public.students
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- Create storage buckets for photographs and signatures
INSERT INTO storage.buckets (id, name, public) VALUES ('photographs', 'photographs', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('signatures', 'signatures', true);

-- Storage policies for photographs
CREATE POLICY "Anyone can view photographs"
ON storage.objects
FOR SELECT
USING (bucket_id = 'photographs');

CREATE POLICY "Anyone can upload photographs"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'photographs');

CREATE POLICY "Admins can update photographs"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'photographs');

CREATE POLICY "Admins can delete photographs"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'photographs');

-- Storage policies for signatures
CREATE POLICY "Anyone can view signatures"
ON storage.objects
FOR SELECT
USING (bucket_id = 'signatures');

CREATE POLICY "Anyone can upload signatures"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'signatures');

CREATE POLICY "Admins can update signatures"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'signatures');

CREATE POLICY "Admins can delete signatures"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'signatures');

-- Insert default classes
INSERT INTO public.classes (name) VALUES 
    ('Class 9'),
    ('Class 10'),
    ('Class 11'),
    ('Class 12');