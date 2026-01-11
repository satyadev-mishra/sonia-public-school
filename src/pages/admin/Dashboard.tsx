import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useStudents } from '@/hooks/useStudents';
import { Users, CheckCircle, AlertCircle, GraduationCap } from 'lucide-react';

export default function Dashboard() {
  const { data: students = [], isLoading } = useStudents();

  const totalStudents = students.length;
  const paidStudents = students.filter(s => s.fee_status === 'paid').length;
  const pendingStudents = students.filter(s => s.fee_status === 'pending').length;
  const activeStudents = students.filter(s => s.status === 'active').length;

  const stats = [
    {
      title: 'Total Students',
      value: totalStudents,
      icon: Users,
      description: 'Registered students',
      color: 'text-primary'
    },
    {
      title: 'Fee Paid',
      value: paidStudents,
      icon: CheckCircle,
      description: 'Fees cleared',
      color: 'text-primary'
    },
    {
      title: 'Fee Pending',
      value: pendingStudents,
      icon: AlertCircle,
      description: 'Awaiting payment',
      color: 'text-destructive'
    },
    {
      title: 'Active Students',
      value: activeStudents,
      icon: GraduationCap,
      description: 'Currently active',
      color: 'text-primary'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to the admin dashboard</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {isLoading ? '...' : stat.value}
                </div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Students</CardTitle>
            <CardDescription>Latest student registrations</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : students.length === 0 ? (
              <p className="text-muted-foreground">No students registered yet.</p>
            ) : (
              <div className="space-y-4">
                {students.slice(0, 5).map((student) => (
                  <div key={student.id} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{student.student_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {student.class} - Roll No: {student.roll_no}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      student.fee_status === 'paid' 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-destructive/10 text-destructive'
                    }`}>
                      {student.fee_status === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
