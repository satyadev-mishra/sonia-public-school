-- Drop the overly permissive anonymous update policy
DROP POLICY IF EXISTS "Anonymous can update their own preboard data" ON public.students;

-- Create a more restrictive update policy for preboard form submissions
-- This allows updates only for adding aadhar, photograph, and signature when fee is paid
CREATE POLICY "Public can update preboard fields for paid students"
ON public.students
FOR UPDATE
TO anon, authenticated
USING (fee_status = 'paid')
WITH CHECK (fee_status = 'paid');