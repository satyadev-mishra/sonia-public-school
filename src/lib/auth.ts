import { supabase } from "@/integrations/supabase/client";

export type AppRole = 'admin' | 'user';

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signUp = async (email: string, password: string, name: string) => {
  const redirectUrl = `${window.location.origin}/`;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: { name }
    }
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const checkUserRole = async (userId: string, role: AppRole): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('has_role', {
      _user_id: userId,
      _role: role
    });
    
    if (error) {
      console.error('Error checking role:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return false;
    }
    
    return data as boolean;
  } catch (error) {
    console.error('Exception in checkUserRole:', error);
    return false;
  }
};

export const isAdmin = async (userId: string): Promise<boolean> => {
  return checkUserRole(userId, 'admin');
};