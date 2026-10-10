import type { Student } from '../data/students'

export type Level = 'High' | 'Medium' | 'Low'
const level = (n: number): Level => (n >= 3 ? 'High' : n >= 1 ? 'Medium' : 'Low')

// Transparent rule-based flags. These are indicators, not predictions.
export function academicRisk(s: Student) {
  const reasons: string[] = []
  if (s.cgpa < 6) reasons.push(`CGPA ${s.cgpa} is below 6.0`)
  if (s.attendance < 75) reasons.push(`Attendance ${s.attendance}% is below 75%`)
  if (s.backlogs > 0) reasons.push(`${s.backlogs} active backlog(s)`)
  if (s.lms != null && s.lms < 40) reasons.push(`LMS activity ${s.lms}/100 is low`)
  if (s.sgpa[s.sgpa.length - 1] < s.sgpa[0] - 0.5) reasons.push('Semester GPA is declining')
  return { level: level(reasons.length), reasons }
}

export function placementRisk(s: Student) {
  const reasons: string[] = []
  if (s.skills != null && s.skills < 50) reasons.push(`Practical skills score ${s.skills}/100 is low`)
  if (s.placement != null && s.placement < 50) reasons.push(`Placement readiness ${s.placement}/100 is low`)
  if (!s.skillList.some((k) => k.verified)) reasons.push('No faculty-verified skills yet')
  return { level: level(reasons.length), reasons }
}