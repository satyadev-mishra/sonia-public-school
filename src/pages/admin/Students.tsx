import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useStudents,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
} from "@/hooks/useStudents";
import { useClasses } from "@/hooks/useClasses";
import { StudentForm } from "@/components/students/StudentForm";
import { Student, StudentFormData } from "@/types/student";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Filter, Loader2 } from "lucide-react";

export default function Students() {
  const [filters, setFilters] = useState<{
    class?: string;
    fee_status?: string;
  }>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  const { data: students = [], isLoading } = useStudents(filters);
  const { data: classes = [] } = useClasses();
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();
  const { toast } = useToast();

  const handleCreate = async (data: StudentFormData) => {
    try {
      await createStudent.mutateAsync(data);
      toast({ title: "Success", description: "Student added successfully" });
      setIsFormOpen(false);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to add student";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  const handleUpdate = async (data: StudentFormData) => {
    if (!editingStudent) return;
    try {
      await updateStudent.mutateAsync({ id: editingStudent.id, data });
      toast({ title: "Success", description: "Student updated successfully" });
      setEditingStudent(null);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update student";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!deletingStudent) return;
    try {
      await deleteStudent.mutateAsync(deletingStudent.id);
      toast({ title: "Success", description: "Student deleted successfully" });
      setDeletingStudent(null);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete student";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col h-full">
        {/* Fixed Header Section */}
        <div className="sticky top-0 z-10 bg-background border-b border-border pb-6">
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Students</h1>
                <p className="text-muted-foreground">Manage student records</p>
              </div>
              <Button onClick={() => setIsFormOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Student
              </Button>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    <span className="text-lg font-medium">Filters</span>
                  </div>
              <Select
                value={filters.class || "all"}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    class: value === "all" ? undefined : value,
                  })
                }
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.name}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.fee_status || "all"}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    fee_status: value === "all" ? undefined : value,
                  })
                }
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by fee status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
          </div>
        </div>

        {/* Scrollable Table Section */}
        <div className="flex-1 overflow-hidden">
        <Card className="flex-1 flex flex-col h-full">
          <CardContent className="flex-1 p-0 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : students.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                No students found. Add a student to get started.
              </div>
            ) : (
              <div className="h-[400px] flex flex-col">
                  {/* Fixed Table Header */}
                  <div className="sticky top-0 z-10 border-b border-border bg-background">
                    <Table className="min-w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Class</TableHead>
                          <TableHead>Roll No</TableHead>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Father's Name</TableHead>
                          <TableHead>DOB</TableHead>
                          <TableHead>Fee Status</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                    </Table>
                  </div>
                  
                  {/* Scrollable Table Body */}
                  <div className="flex-1 overflow-auto">
                    <Table className="min-w-full">
                      <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>{student.class}</TableCell>
                        <TableCell>{student.roll_no}</TableCell>
                        <TableCell className="font-medium">
                          {student.student_name}
                        </TableCell>
                        <TableCell>{student.father_name}</TableCell>
                        <TableCell>
                          {new Date(student.dob).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              student.fee_status === "paid"
                                ? "bg-primary/10 text-primary"
                                : "bg-destructive/10 text-destructive"
                            }`}
                          >
                            {student.fee_status === "paid" ? "Paid" : "Pending"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              student.status === "active"
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {student.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingStudent(student)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeletingStudent(student)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                    </Table>
                  </div>
                </div>
            )}
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Add Student Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
          </DialogHeader>
          <StudentForm
            onSubmit={handleCreate}
            onCancel={() => setIsFormOpen(false)}
            isLoading={createStudent.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Student Dialog */}
      <Dialog
        open={!!editingStudent}
        onOpenChange={() => setEditingStudent(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          <StudentForm
            student={editingStudent}
            onSubmit={handleUpdate}
            onCancel={() => setEditingStudent(null)}
            isLoading={updateStudent.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingStudent}
        onOpenChange={() => setDeletingStudent(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {deletingStudent?.student_name}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
