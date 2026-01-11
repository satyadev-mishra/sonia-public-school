import { useState, useEffect } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClasses } from '@/hooks/useClasses';
import { Student, StudentFormData } from '@/types/student';

const studentSchema = z.object({
  class: z.string().min(1, 'Class is required'),
  roll_no: z.string().min(1, 'Roll number is required'),
  student_name: z.string().min(1, 'Student name is required').max(100),
  father_name: z.string().min(1, "Father's name is required").max(100),
  mother_name: z.string().min(1, "Mother's name is required").max(100),
  ledger_no: z.string().max(50).optional(),
  dob: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['Male', 'Female', 'Other']),
  fee_amount: z.number().min(0, 'Fee amount must be positive'),
  fee_status: z.enum(['paid', 'pending']),
  status: z.enum(['active', 'inactive']),
});

interface StudentFormProps {
  student?: Student | null;
  onSubmit: (data: StudentFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const StudentForm = ({ student, onSubmit, onCancel, isLoading }: StudentFormProps) => {
  const { data: classes = [] } = useClasses();
  const [formData, setFormData] = useState<StudentFormData>({
    class: '',
    roll_no: '',
    student_name: '',
    father_name: '',
    mother_name: '',
    ledger_no: '',
    dob: '',
    gender: 'Male',
    fee_amount: 0,
    fee_status: 'pending',
    status: 'active',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (student) {
      setFormData({
        class: student.class,
        roll_no: student.roll_no,
        student_name: student.student_name,
        father_name: student.father_name,
        mother_name: student.mother_name,
        ledger_no: student.ledger_no || '',
        dob: student.dob,
        gender: student.gender,
        fee_amount: student.fee_amount,
        fee_status: student.fee_status,
        status: student.status,
      });
    }
  }, [student]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = studentSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Class *</Label>
          <Select
            value={formData.class}
            onValueChange={(value) => setFormData({ ...formData, class: value })}
          >
            <SelectTrigger className={errors.class ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.name}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.class && <p className="text-sm text-destructive">{errors.class}</p>}
        </div>

        <div className="space-y-2">
          <Label>Roll Number *</Label>
          <Input
            value={formData.roll_no}
            onChange={(e) => setFormData({ ...formData, roll_no: e.target.value })}
            className={errors.roll_no ? 'border-destructive' : ''}
          />
          {errors.roll_no && <p className="text-sm text-destructive">{errors.roll_no}</p>}
        </div>

        <div className="space-y-2">
          <Label>Student Name *</Label>
          <Input
            value={formData.student_name}
            onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
            className={errors.student_name ? 'border-destructive' : ''}
          />
          {errors.student_name && <p className="text-sm text-destructive">{errors.student_name}</p>}
        </div>

        <div className="space-y-2">
          <Label>Father's Name *</Label>
          <Input
            value={formData.father_name}
            onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
            className={errors.father_name ? 'border-destructive' : ''}
          />
          {errors.father_name && <p className="text-sm text-destructive">{errors.father_name}</p>}
        </div>

        <div className="space-y-2">
          <Label>Mother's Name *</Label>
          <Input
            value={formData.mother_name}
            onChange={(e) => setFormData({ ...formData, mother_name: e.target.value })}
            className={errors.mother_name ? 'border-destructive' : ''}
          />
          {errors.mother_name && <p className="text-sm text-destructive">{errors.mother_name}</p>}
        </div>

        <div className="space-y-2">
          <Label>Ledger Number</Label>
          <Input
            value={formData.ledger_no}
            onChange={(e) => setFormData({ ...formData, ledger_no: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Date of Birth *</Label>
          <Input
            type="date"
            value={formData.dob}
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            className={errors.dob ? 'border-destructive' : ''}
          />
          {errors.dob && <p className="text-sm text-destructive">{errors.dob}</p>}
        </div>

        <div className="space-y-2">
          <Label>Gender *</Label>
          <Select
            value={formData.gender}
            onValueChange={(value: 'Male' | 'Female' | 'Other') => 
              setFormData({ ...formData, gender: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Fee Amount *</Label>
          <Input
            type="number"
            min="0"
            value={formData.fee_amount}
            onChange={(e) => setFormData({ ...formData, fee_amount: Number(e.target.value) })}
            className={errors.fee_amount ? 'border-destructive' : ''}
          />
          {errors.fee_amount && <p className="text-sm text-destructive">{errors.fee_amount}</p>}
        </div>

        <div className="space-y-2">
          <Label>Fee Status *</Label>
          <Select
            value={formData.fee_status}
            onValueChange={(value: 'paid' | 'pending') => 
              setFormData({ ...formData, fee_status: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status *</Label>
          <Select
            value={formData.status}
            onValueChange={(value: 'active' | 'inactive') => 
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : student ? 'Update Student' : 'Add Student'}
        </Button>
      </div>
    </form>
  );
};
