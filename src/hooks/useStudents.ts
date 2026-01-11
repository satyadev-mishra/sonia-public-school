import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Student, StudentFormData } from '@/types/student';

// Fetch all students
export const useStudents = (filters?: { class?: string; fee_status?: string }) => {
  return useQuery({
    queryKey: ['students', filters],
    queryFn: async () => {
      let query = supabase
        .from('students')
        .select('*')
        .order('class', { ascending: true })
        .order('roll_no', { ascending: true });

      if (filters?.class) {
        query = query.eq('class', filters.class);
      }
      if (filters?.fee_status) {
        query = query.eq('fee_status', filters.fee_status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Student[];
    }
  });
};

// Fetch single student by class and roll number
export const useStudentByClassAndRoll = (className: string, rollNo: string) => {
  return useQuery({
    queryKey: ['student', className, rollNo],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('class', className)
        .eq('roll_no', rollNo)
        .maybeSingle();

      if (error) throw error;
      return data as Student | null;
    },
    enabled: !!className && !!rollNo
  });
};

// Create student
export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StudentFormData) => {
      const { data: result, error } = await supabase
        .from('students')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result as Student;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }
  });
};

// Update student
export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Student> }) => {
      const { data: result, error } = await supabase
        .from('students')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result as Student;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }
  });
};

// Delete student
export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }
  });
};

// Upload file to storage
export const uploadFile = async (
  file: File, 
  bucket: 'photographs' | 'signatures',
  fileName: string
): Promise<string> => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { upsert: true });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
};
