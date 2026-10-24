import { rows, isHiddenTalent } from '../lib/analytics'
import { depts } from '../data/students'

type Row = (typeof rows)[number]
export type ChatUser = { role: string; studentId?: string | null; name?: string }

const deptList: string[] = [...depts]

const avg = (a: number[]) =>
  a.length ? (a.reduce((s, x) => s + x, 0) / a.length).toFixed(1) : 'N/A'

const line = (r: Row) =>
  `• ${r.name} (${r.id}) – ${r.dept}, CGPA ${r.cgpa}, Att ${r.attendance}%`

function summary(r: Row): string {
  return [
    `${r.name} (${r.id}) – ${r.dept}`,
    `• CGPA: ${r.cgpa}`,
    `• Attendance: ${r.attendance}%`,
    `• Success score: ${r.sc.score === null ? 'N/A' : r.sc.score}${r.sc.incomplete ? ' (some data missing)' : ''}`,
    `• Academic risk: ${r.ar.level}`,
    `• Placement risk: ${r.pr.level}`,
  ].join('\n')
}

function showList(title: string, items: Row[]): string {
  if (items.length === 0) return `${title}: no students found.`
  const more = items.length > 10 ? `\n…and ${items.length - 10} more` : ''
  return `${title} (${items.length}):\n${items.slice(0, 10).map(line).join('\n')}${more}`
}

export function suggestionsFor(role: string): string[] {
  return role === 'faculty'
    ? [
        'How many students are there?',
        'Show high risk students',
        'Who has low attendance?',
        'Top 5 students by score',
        'Show hidden talent',
        'Average CGPA',
      ]
    : ['Show my summary', 'What is my CGPA?', 'What is my attendance?', 'What is my risk level?']
}

export function answer(question: string, user: ChatUser): string {
  const q = question.toLowerCase()
  const has = (...w: string[]) => w.some((x) => q.includes(x))

  // Student / Parent: only their own (linked) record
  if (user.role !== 'faculty') {
    const me = rows.find((r) => r.id === user.studentId)
    if (!me) return "I couldn't find a student record linked to your login."
    if (has('cgpa', 'gpa')) return `${me.name}'s CGPA is ${me.cgpa}.`
    if (has('attendance')) return `${me.name}'s attendance is ${me.attendance}%.`
    if (has('placement')) return `${me.name}'s placement risk is ${me.pr.level}.`
    if (has('risk')) return `${me.name}'s academic risk is ${me.ar.level}.`
    if (has('score')) return `${me.name}'s success score is ${me.sc.score === null ? 'N/A' : me.sc.score}.`
    return summary(me)
  }

  // Faculty
  const words = q.split(/[^a-z0-9]+/)
  const dept = deptList.find((d) => words.includes(d.toLowerCase()))
  const list = dept ? rows.filter((r) => r.dept === dept) : rows
  const scope = dept ? ` in ${dept}` : ''

  const one = rows.find(
    (r) => q.includes(r.id.toLowerCase()) || (r.name && q.includes(r.name.toLowerCase())),
  )
  if (one) return summary(one)

  if (has('hidden', 'talent')) {
    return showList(`Hidden talent${scope}`, list.filter((r) => isHiddenTalent(r)))
  }

  if (has('risk')) {
    const placement = has('placement')
    const level = has('medium') ? 'Medium' : has('low risk') ? 'Low' : 'High'
    const items = list.filter((r) => (placement ? r.pr.level : r.ar.level) === level)
    return showList(`${level} ${placement ? 'placement' : 'academic'} risk${scope}`, items)
  }

  if (has('attendance') && has('low', 'below', 'less', 'poor', 'shortage')) {
    return showList(`Attendance below 75%${scope}`, list.filter((r) => Number(r.attendance) < 75))
  }

  if (has('top', 'best', 'highest', 'rank')) {
    const byCgpa = has('cgpa')
    const top = [...list]
      .sort((a, b) =>
        byCgpa ? Number(b.cgpa) - Number(a.cgpa) : (b.sc.score ?? -1) - (a.sc.score ?? -1),
      )
      .slice(0, 5)
    return showList(`Top 5 by ${byCgpa ? 'CGPA' : 'success score'}${scope}`, top)
  }

  if (has('average', 'avg', 'mean')) {
    const scores = list.map((r) => r.sc.score).filter((x): x is number => x !== null)
    return [
      `Averages${scope} (${list.length} students):`,
      `• CGPA: ${avg(list.map((r) => Number(r.cgpa)))}`,
      `• Attendance: ${avg(list.map((r) => Number(r.attendance)))}%`,
      `• Success score: ${avg(scores)}`,
    ].join('\n')
  }

  if (has('how many', 'count', 'total', 'number of')) {
    if (dept) return `There are ${list.length} students in ${dept}.`
    const by = deptList.map((d) => `• ${d}: ${rows.filter((r) => r.dept === d).length}`)
    return `Total students: ${rows.length}\n${by.join('\n')}`
  }

  if (dept) {
    const high = list.filter((r) => r.ar.level === 'High').length
    return [
      `${dept} overview:`,
      `• Students: ${list.length}`,
      `• Average CGPA: ${avg(list.map((r) => Number(r.cgpa)))}`,
      `• High academic risk: ${high}`,
    ].join('\n')
  }

  return "I can help with student counts, risk lists, low attendance, top students, hidden talent, averages, or a student's details (type a name or ID). Try one of the suggestions below."
}