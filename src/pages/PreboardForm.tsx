import { useState } from 'react';
import { z } from 'zod';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useClasses } from '@/hooks/useClasses';
import { useStudentByClassAndRoll, useUpdateStudent } from '@/hooks/useStudents';
import { useToast } from '@/hooks/use-toast';
import { admitCardData } from '@/data/admitCardData';
import { Search, AlertCircle, CheckCircle, Download, Loader2, X } from 'lucide-react';
import { jsPDF } from 'jspdf';
import schoolLogo from '@/assets/school-logo.png';

const aadharSchema = z.string().length(12, 'Aadhar number must be 12 digits').regex(/^\d+$/, 'Aadhar must contain only numbers');

export default function PreboardForm() {
  const [selectedClass, setSelectedClass] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [aadharNo, setAadharNo] = useState('');
  const [photograph, setPhotograph] = useState<File | null>(null);
  const [photographPreview, setPhotographPreview] = useState<string | null>(null);
  const [signature, setSignature] = useState<File | null>(null);
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handlePhotographChange = (file: File | null) => {
    setPhotograph(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotographPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPhotographPreview(null);
    }
  };

  const handleSignatureChange = (file: File | null) => {
    setSignature(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSignaturePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setSignaturePreview(null);
    }
  };

  const { data: classes = [] } = useClasses();
  const { data: student, isLoading: studentLoading } = useStudentByClassAndRoll(
    searchTriggered ? selectedClass : '',
    searchTriggered ? rollNo : ''
  );
  const updateStudent = useUpdateStudent();
  const { toast } = useToast();

  const handleSearch = () => {
    if (!selectedClass || !rollNo) {
      toast({ title: 'Error', description: 'Please select class and enter roll number', variant: 'destructive' });
      return;
    }
    setSearchTriggered(true);
    setFormSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    const aadharResult = aadharSchema.safeParse(aadharNo);
    if (!aadharResult.success) {
      toast({ title: 'Error', description: aadharResult.error.errors[0].message, variant: 'destructive' });
      return;
    }
    if (!photograph || !signature) {
      toast({ title: 'Error', description: 'Please upload photograph and signature', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      await updateStudent.mutateAsync({
        id: student.id,
        data: { aadhar_no: aadharNo, is_submitted: true }
      });

      setFormSubmitted(true);
      toast({ title: 'Success', description: 'Form submitted successfully!' });
    } catch {
      toast({ title: 'Error', description: 'Failed to submit form', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const generateAdmitCard = async () => {
    if (!student) return;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
  
    // HSL(20, 30%, 90%) = RGB(242, 229, 217) - Warm beige
    const beige = { r: 242, g: 229, b: 217 };
    const primaryRed = { r: 181, g: 60, b: 60 };
  
    // Draw outer border
    doc.setDrawColor(primaryRed.r, primaryRed.g, primaryRed.b); // Primary color border
    doc.setLineWidth(2);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  
    // Draw inner decorative border
    doc.setLineWidth(0.5);
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30);
  
    // School codes header row
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryRed.r, primaryRed.g, primaryRed.b);
    doc.text('Affiliation No: 03072', 20, 22);
    doc.text('School Code: 21316', pageWidth / 2, 22, { align: 'center' });
    doc.text('UDISE Code: 06191612461', pageWidth - 20, 22, { align: 'right' });
  
    // Add school logo
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = schoolLogo;
      await new Promise((resolve) => { img.onload = resolve; });
      doc.addImage(img, 'PNG', pageWidth / 2 - 15, 26, 30, 30);
    } catch {
      // Continue without logo if it fails to load
    }
  
    // School header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(primaryRed.r, primaryRed.g, primaryRed.b);
    doc.text('SONIA PUBLIC SR. SEC. SCHOOL', pageWidth / 2, 62, { align: 'center' });
  
    // School address
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Add:- DAYAL NAGAR, AMARNAGAR, FARIDABAD, 121003', pageWidth / 2, 70, { align: 'center' });
    doc.text('Phone No:- 9990020795', pageWidth / 2, 76, { align: 'center' });
  
    // Email and website
    doc.setFontSize(8);
    doc.setTextColor(primaryRed.r, primaryRed.g, primaryRed.b);
    doc.text('E-mail:- drsunil095@gmail.com | Website:- https://soniapublicschool.org/', pageWidth / 2, 82, { align: 'center' });
  
    // Divider line
    doc.setDrawColor(beige.r, beige.g, beige.b);
    doc.setLineWidth(1);
    doc.line(30, 86, pageWidth - 30, 86);
  
    // Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('PRE-BOARD EXAMINATION 2025-26', pageWidth / 2, 96, { align: 'center' });
  
    doc.setFontSize(14);
    doc.setTextColor(beige.r, beige.g, beige.b);
    doc.text('ADMIT CARD', pageWidth / 2, 104, { align: 'center' });
  
    // Student details - moved up and without box
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
  
    const labelX = 28;
    const valueX = 75;
    let yPos = 115; // Moved up from 125
    const lineHeight = 12;
  
    const details = [
      { label: 'Name', value: student.student_name },
      { label: 'Class', value: student.class },
      { label: 'Roll No', value: student.roll_no },
      { label: 'DOB', value: new Date(student.dob).toLocaleDateString('en-IN') },
      { label: "Father's Name", value: student.father_name }
    ];
  
    details.forEach(({ label, value }) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${label}:`, labelX, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(value, valueX, yPos);
      yPos += lineHeight;
    });
  
    // Photo placeholder box - moved up
    doc.setDrawColor(beige.r, beige.g, beige.b);
    doc.setLineWidth(0.5);
    doc.rect(pageWidth - 55, 105, 30, 35);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Photo', pageWidth - 40, 125, { align: 'center' });
  
    // Add photo from uploaded file - adjusted position
    if (photograph) {
      const photoBase64 = await fileToBase64(photograph);
      if (photoBase64) {
        doc.addImage(photoBase64, 'JPEG', pageWidth - 54, 106, 28, 33);
      }
    }
  
    // Exam schedule section
    doc.setFillColor(beige.r, beige.g, beige.b);
    doc.rect(20, 190, pageWidth - 40, 8, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('EXAMINATION SCHEDULE', pageWidth / 2, 196, { align: 'center' });
    
    // Exam timing
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(primaryRed.r, primaryRed.g, primaryRed.b);
    doc.text(`Timing: ${admitCardData.startTime} - ${admitCardData.endTime}`, pageWidth / 2, 188, { align: 'center' });
  
    // Schedule table header
    doc.setFillColor(240, 240, 240);
    doc.rect(20, 200, pageWidth - 40, 8, 'F');
    doc.setDrawColor(primaryRed.r * 0.7, primaryRed.g * 0.7, primaryRed.b * 0.7); // Darker border
    doc.setLineWidth(0.8);
    doc.rect(20, 200, pageWidth - 40, 8);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text('Date', 30, 205);
    doc.text('Day', 60, 205);
    doc.text('Subject', 100, 205);
  
    // Dynamic schedule from admit card data
    doc.setFont('helvetica', 'normal');
    
    // Normalize class name to match admitCardData keys
    const normalizeClassKey = (className: string): string => {
      return className.toLowerCase().replace(/\s*-\s*/g, '-');
    };
    
    const classSchedule = admitCardData.class[normalizeClassKey(student.class) as keyof typeof admitCardData.class];
    let signatureY = 215;
    if (classSchedule) {
      let scheduleY = 215;
      classSchedule.subjects.forEach((subject) => {
        doc.text(subject.date, 30, scheduleY);
        doc.text(subject.day, 60, scheduleY);
        doc.text(subject.name, 100, scheduleY);
        scheduleY += 8;
      });
      signatureY = scheduleY + 10;
      
      // Draw table border around schedule
      doc.setDrawColor(primaryRed.r * 0.7, primaryRed.g * 0.7, primaryRed.b * 0.7);
      doc.setLineWidth(0.8);
      doc.rect(20, 200, pageWidth - 40, scheduleY - 200);
    }
  
    // Signature section
    doc.setDrawColor(0, 0, 0);
    doc.line(30, signatureY, 80, signatureY);
    doc.line(pageWidth - 80, signatureY, pageWidth - 30, signatureY);
  
    doc.setFontSize(9);
    doc.text("Student's Signature", 55, signatureY + 7, { align: 'center' });
    doc.text("Principal's Signature", pageWidth - 55, signatureY + 7, { align: 'center' });
  
    // Add signature from uploaded file - fixed positioning
    if (signature) {
      const sigBase64 = await fileToBase64(signature);
      if (sigBase64) {
        // Position signature image just above the signature line
        doc.addImage(sigBase64, 'PNG', 35, signatureY - 12, 40, 12);
      }
    }
  
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('This is a computer-generated document. Please bring this admit card to the examination hall.', pageWidth / 2, 275, { align: 'center' });
  
    doc.save(`admit_card_${student.class}_${student.roll_no}.pdf`);
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      <Header showNav={false} />
      <main className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">Preboard Details 2025-26</CardTitle>
            <CardDescription>Enter your class and roll number to proceed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="flex-1"><SelectValue placeholder="Select Class" /></SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => <SelectItem key={cls.id} value={cls.name}>{cls.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input placeholder="Roll Number" value={rollNo} onChange={(e) => setRollNo(e.target.value)} className="flex-1" />
              <Button onClick={handleSearch} disabled={studentLoading}><Search className="mr-2 h-4 w-4" />Search</Button>
            </div>

            {searchTriggered && studentLoading && <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}

            {searchTriggered && !studentLoading && !student && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
                <AlertCircle className="mx-auto mb-2 h-8 w-8 text-destructive" />
                <p className="font-medium text-destructive">Student not found</p>
              </div>
            )}

            {searchTriggered && !studentLoading && student && student.is_submitted && (
              <div className="rounded-lg border border-green-500/50 bg-green-50 p-4 text-center">
                <CheckCircle className="mx-auto mb-2 h-8 w-8 text-green-600" />
                <p className="font-medium text-green-800">Your form has been submitted successfully!</p>
                <p className="text-sm text-green-600 mt-1">You can download your admit card below.</p>
                <Button onClick={() => generateAdmitCard()} className="mt-4 gap-2">
                  <Download className="h-4 w-4" />
                  Download Admit Card
                </Button>
              </div>
            )}

            {student && (
              <>
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 mb-4">
                  <p><strong>Name:</strong> {student.student_name}</p>
                  <p><strong>Father:</strong> {student.father_name}</p>
                  <p><strong>Fee Status:</strong> {student.fee_status}</p>
                </div>
            
                {student.fee_status.toLowerCase() === 'pending' && (
                  <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
                    <AlertCircle className="mx-auto mb-2 h-8 w-8 text-destructive" />
                    <p className="font-medium text-destructive">Your fee is pending. Please contact Principal Office.</p>
                  </div>
                )}

                {student.fee_status === 'paid' && !student.is_submitted && !formSubmitted && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div><Label>Aadhar Number *</Label><Input value={aadharNo} onChange={(e) => setAadharNo(e.target.value)} maxLength={12} placeholder="Enter 12-digit Aadhar" /></div>
                
                <div className="space-y-2">
                  <Label>Photograph *</Label>
                  <Input type="file" accept="image/*" onChange={(e) => handlePhotographChange(e.target.files?.[0] || null)} />
                  {photographPreview && (
                    <div className="relative inline-block">
                      <img src={photographPreview} alt="Photograph preview" className="h-24 w-20 rounded border border-border object-cover" />
                      <button
                        type="button"
                        onClick={() => handlePhotographChange(null)}
                        className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground hover:bg-destructive/80"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Signature *</Label>
                  <Input type="file" accept="image/*" onChange={(e) => handleSignatureChange(e.target.files?.[0] || null)} />
                  {signaturePreview && (
                    <div className="relative inline-block">
                      <img src={signaturePreview} alt="Signature preview" className="h-16 w-32 rounded border border-border object-contain bg-background" />
                      <button
                        type="button"
                        onClick={() => handleSignatureChange(null)}
                        className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground hover:bg-destructive/80"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting...</> : 'Submit Form'}</Button>
              </form>
                )}
              </>
            )}

            {formSubmitted && (
              <div className="space-y-4 text-center">
                <CheckCircle className="mx-auto h-16 w-16 text-primary" />
                <p className="text-lg font-medium">Form submitted successfully!</p>
                <Button onClick={generateAdmitCard} className="gap-2"><Download className="h-4 w-4" />Download Admit Card</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
