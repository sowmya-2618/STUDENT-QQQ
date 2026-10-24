import { useMemo } from 'react'
import { students } from '../data/students'
import type { Student } from '../data/students'
import { useAuth } from '../auth/AuthContext'

// Returns only the students the logged-in user is allowed to see
export function useVisibleStudents(): Student[] {
  const { user } = useAuth()
  return useMemo(() => {
    if (!user) return []
    if (user.role === 'faculty') {
      return user.department === 'ALL'
        ? students
        : students.filter((s) => s.dept === user.department)
    }
    // student + parent: only their own record
    return students.filter((s) => s.id === user.studentId)
  }, [user])
}