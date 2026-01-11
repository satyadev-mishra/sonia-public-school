-- Create exam_schedule table
CREATE TABLE public.exam_schedule (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    subject text NOT NULL,
    exam_date date NOT NULL,
    start_time time NOT NULL,
    end_time time NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.exam_schedule ENABLE ROW LEVEL SECURITY;

-- Anyone can view exam schedule
CREATE POLICY "Anyone can view exam schedule"
ON public.exam_schedule
FOR SELECT
USING (true);

-- Only admins can manage exam schedule
CREATE POLICY "Admins can manage exam schedule"
ON public.exam_schedule
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_exam_schedule_updated_at
BEFORE UPDATE ON public.exam_schedule
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();