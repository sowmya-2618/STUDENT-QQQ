import { students, type Student } from '../data/students'
import { successScore } from './score'
import { academicRisk, placementRisk } from './risk'

export const components = (s: Student) => ({
  academic: s.cgpa * 10, attendance: s.attendance, lms: s.lms,
  skills: s.skills, placement: s.placement, engagement: s.engagement,
})

export const enrich = (s: Student) => ({
  ...s, sc: successScore(components(s)), ar: academicRisk(s), pr: placementRisk(s),
})
export const rows = students.map(enrich)
export const isHiddenTalent = (s: Student) => s.cgpa < 6.5 && (s.skills ?? 0) >= 80