export type Role = 'student' | 'parent' | 'faculty';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  title: string;
  department: string;  // 'ALL' for dean
  studentId?: string;  // student + parent: which student's data they can see
}

interface DemoUser extends AuthUser {
  password: string;
}

// DEMO ONLY. Replace studentId values with real IDs from your student data.
export const DEMO_USERS: DemoUser[] = [
  {
    id: 'stu01', name: 'Rahul Verma', email: 'rahul@campus.edu', password: 'student123',
    role: 'student', title: 'Student', department: 'CSE', studentId: 'S001',
  },
  {
    id: 'par01', name: 'Mr. Suresh Verma', email: 'suresh.parent@campus.edu', password: 'parent123',
    role: 'parent', title: 'Parent of Rahul Verma', department: 'CSE', studentId: 'S001',
  },
  {
    id: 'fac01', name: 'Dr. Ramesh Rao', email: 'dean@campus.edu', password: 'dean123',
    role: 'faculty', title: 'Dean / Administrator', department: 'ALL',
  },
  {
    id: 'fac02', name: 'Prof. Anita Sharma', email: 'mentor.cse@campus.edu', password: 'mentor123',
    role: 'faculty', title: 'Faculty Mentor', department: 'CSE',
  },
];

// Where each role lands after login. Change paths to match your routes.
export const ROLE_HOME: Record<Role, string> = {
  student: '/student',
  parent: '/parent',
  faculty: '/dashboard',
};