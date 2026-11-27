export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin',
  INSTRUCTOR = 'instructor',
}

export class User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
  isActive: boolean;
  emailVerified: boolean;
  enrolledCourses: string[];
  createdAt: string;
  updatedAt: string;
}
