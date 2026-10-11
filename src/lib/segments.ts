import { rows } from './analytics'

export type Row = (typeof rows)[number]

export type Segment = {
  key: string
  name: string
  criteria: string
  test: (r: Row) => boolean
}

const last = (r: Row) => r.sgpa[r.sgpa.length - 1]
const prev = (r: Row) => r.sgpa[r.sgpa.length - 2]

// Demo rules (transparent). Membership is recalculated from current data every time.
export const segments: Segment[] = [
  { key: 'acad', name: 'High Academic Performance', criteria: 'CGPA 8.0 or above',
    test: (r) => r.cgpa >= 8 },
  { key: 'consistent', name: 'Consistent Performers', criteria: 'Semester GPA changes by 0.3 or less between all semesters, CGPA 6.5+',
    test: (r) => r.sgpa.length >= 3 && r.cgpa >= 6.5 && r.sgpa.every((g, i) => i === 0 || Math.abs(g - r.sgpa[i - 1]) <= 0.3) },
  { key: 'improving', name: 'Improving Students', criteria: 'Latest semester GPA is at least 0.5 higher than the previous one',
    test: (r) => r.sgpa.length >= 2 && last(r) - prev(r) >= 0.5 },
  { key: 'support', name: 'Academic Support Needed', criteria: 'Academic risk is Medium or High',
    test: (r) => r.ar.level !== 'Low' },
  { key: 'attendance', name: 'Attendance Support Needed', criteria: 'Attendance below 75%',
    test: (r) => r.attendance < 75 },
  { key: 'practical', name: 'High Practical Skills', criteria: 'Practical skills score 80 or above',
    test: (r) => (r.skills ?? 0) >= 80 },
  { key: 'hidden', name: 'Hidden Talent', criteria: 'CGPA below 6.5 and practical skills 80+',
    test: (r) => r.cgpa < 6.5 && (r.skills ?? 0) >= 80 },
  { key: 'ready', name: 'Placement Ready', criteria: 'Placement score 70+ and Low placement risk',
    test: (r) => (r.placement ?? 0) >= 70 && r.pr.level === 'Low' },
  { key: 'career', name: 'Career Preparation Needed', criteria: 'Placement risk is Medium or High',
    test: (r) => r.pr.level !== 'Low' },
  { key: 'gap', name: 'High Academics, Low Placement Readiness', criteria: 'CGPA 8.0+ but placement risk Medium or High (KPMG brief example)',
    test: (r) => r.cgpa >= 8 && r.pr.level !== 'Low' },
]