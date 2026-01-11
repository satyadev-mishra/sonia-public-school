export interface Student {
  id: string;
  class: string;
  roll_no: string;
  student_name: string;
  father_name: string;
  mother_name: string;
  ledger_no: string | null;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  fee_amount: number;
  fee_status: 'paid' | 'pending';
  aadhar_no: string | null;
  photograph_url: string | null;
  signature_url: string | null;
  status: 'active' | 'inactive';
  is_submitted: boolean;
  created_at: string;
  updated_at: string;
}

export interface StudentFormData {
  class: string;
  roll_no: string;
  student_name: string;
  father_name: string;
  mother_name: string;
  ledger_no: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  fee_amount: number;
  fee_status: 'paid' | 'pending';
  status: 'active' | 'inactive';
}

export interface PreboardFormData {
  aadhar_no: string;
  photograph: File | null;
  signature: File | null;
}
