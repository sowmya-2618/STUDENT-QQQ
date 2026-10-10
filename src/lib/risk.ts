export type Level = 'High' | 'Medium' | 'Low'

export type Flag = {
  reason: string   // problem enti
  data: string     // supporting data
  action: string   // recommended support action
  severity: 1 | 2 | 3
}

export type RiskResult = {
  level: Level
  points: number
  reasons: string[]   // existing pages kosam
  flags: Flag[]
  actions: string[]
  dataGaps: string[]  // missing data (risk ga count cheyyam)
  note: string
}

// Student type import avasaram ledu: ee shape unte chalu
export type RiskInput = {
  cgpa: number
  attendance: number
  backlogs: number
  lms?: number | null
  skills?: number | null
  placement?: number | null
  engagement?: number | null
  sgpa?: number[] | null
  skillList?: { name: string; verified: boolean }[] | null
}

const NOTE = 'Rule-based indicator for early support. Not a prediction or a guaranteed outcome.'

const has = (v: unknown): v is number => typeof v === 'number' && !Number.isNaN(v)

// High >= 5 points, Medium >= 2, else Low
const levelOf = (p: number): Level => (p >= 5 ? 'High' : p >= 2 ? 'Medium' : 'Low')

function build(flags: Flag[], dataGaps: string[]): RiskResult {
  const points = flags.reduce((a, f) => a + f.severity, 0)
  return {
    level: levelOf(points),
    points,
    reasons: flags.map((f) => f.reason),
    flags,
    actions: Array.from(new Set(flags.map((f) => f.action))),
    dataGaps,
    note: NOTE,
  }
}

// ---------- Academic risk ----------
export function academicRisk(s: RiskInput): RiskResult {
  const flags: Flag[] = []
  const gaps: string[] = []

  if (s.cgpa < 5) {
    flags.push({
      reason: `CGPA ${s.cgpa} is very low (below 5.0)`,
      data: `CGPA: ${s.cgpa}`,
      action: 'Assign a faculty mentor and arrange weekly remedial classes for weak subjects.',
      severity: 3,
    })
  } else if (s.cgpa < 6) {
    flags.push({
      reason: `CGPA ${s.cgpa} is below 6.0`,
      data: `CGPA: ${s.cgpa}`,
      action: 'Set up peer study groups and a monthly progress check with the mentor.',
      severity: 2,
    })
  }

  if (s.attendance < 65) {
    flags.push({
      reason: `Attendance ${s.attendance}% is critically low (below 65%)`,
      data: `Attendance: ${s.attendance}%`,
      action: 'Counsel the student and inform parents/guardian. Check for health or travel issues.',
      severity: 3,
    })
  } else if (s.attendance < 75) {
    flags.push({
      reason: `Attendance ${s.attendance}% is below 75%`,
      data: `Attendance: ${s.attendance}%`,
      action: 'Send an attendance alert and agree on a recovery plan before exams.',
      severity: 2,
    })
  }

  if (s.backlogs >= 3) {
    flags.push({
      reason: `${s.backlogs} active backlogs`,
      data: `Backlogs: ${s.backlogs}`,
      action: 'Prepare a backlog clearance timetable, one or two subjects per exam cycle, with tutoring.',
      severity: 3,
    })
  } else if (s.backlogs > 0) {
    flags.push({
      reason: `${s.backlogs} active backlog(s)`,
      data: `Backlogs: ${s.backlogs}`,
      action: 'Enrol in the next supplementary exam and give previous-year question practice.',
      severity: 2,
    })
  }

  if (!has(s.lms)) {
    gaps.push('LMS / assignment data not available')
  } else if (s.lms < 40) {
    flags.push({
      reason: `LMS and assignment activity ${s.lms}/100 is low`,
      data: `LMS score: ${s.lms}/100`,
      action: 'Ask faculty to follow up on pending assignments and set weekly submission reminders.',
      severity: 1,
    })
  }

  const g = s.sgpa ?? []
  if (g.length < 2) {
    gaps.push('Need at least 2 semesters of GPA to check the trend')
  } else {
    const first = g[0]
    const last = g[g.length - 1]
    const drop = +(first - last).toFixed(2)
    if (drop >= 1) {
      flags.push({
        reason: 'Semester GPA is declining sharply',
        data: `SGPA: ${first} → ${last} (down ${drop})`,
        action: 'Hold a one-to-one meeting to find the cause (subjects, health, personal) and plan support.',
        severity: 2,
      })
    } else if (drop > 0.5) {
      flags.push({
        reason: 'Semester GPA is declining',
        data: `SGPA: ${first} → ${last} (down ${drop})`,
        action: 'Review recent subject performance with the mentor and adjust the study plan.',
        severity: 1,
      })
    }
  }

  return build(flags, gaps)
}

// ---------- Placement risk ----------
export function placementRisk(s: RiskInput): RiskResult {
  const flags: Flag[] = []
  const gaps: string[] = []

  if (!has(s.skills)) {
    gaps.push('Practical skills assessment not available')
  } else if (s.skills < 40) {
    flags.push({
      reason: `Practical skills score ${s.skills}/100 is very low`,
      data: `Skills: ${s.skills}/100`,
      action: 'Enrol in a hands-on skill programme and complete one guided mini-project this month.',
      severity: 3,
    })
  } else if (s.skills < 50) {
    flags.push({
      reason: `Practical skills score ${s.skills}/100 is low`,
      data: `Skills: ${s.skills}/100`,
      action: 'Practise on coding or practical platforms weekly and retake the skills assessment.',
      severity: 2,
    })
  }

  if (!has(s.placement)) {
    gaps.push('Placement readiness assessment not available')
  } else if (s.placement < 40) {
    flags.push({
      reason: `Placement readiness ${s.placement}/100 is very low`,
      data: `Placement readiness: ${s.placement}/100`,
      action: 'Start aptitude, communication and mock-interview training from the basics.',
      severity: 3,
    })
  } else if (s.placement < 50) {
    flags.push({
      reason: `Placement readiness ${s.placement}/100 is low`,
      data: `Placement readiness: ${s.placement}/100`,
      action: 'Schedule mock interviews and aptitude practice every week.',
      severity: 2,
    })
  }

  const list = s.skillList ?? []
  if (list.length === 0) {
    flags.push({
      reason: 'No skills declared yet',
      data: 'Skills listed: 0',
      action: 'Ask the student to add skills and submit project evidence for review.',
      severity: 1,
    })
  } else if (!list.some((k) => k.verified)) {
    flags.push({
      reason: 'No faculty-verified skills yet',
      data: `Skills listed: ${list.length}, verified: 0`,
      action: 'Faculty to review the submitted evidence or run a short practical assessment.',
      severity: 1,
    })
  }

  if (!has(s.engagement)) {
    gaps.push('Engagement data not available')
  } else if (s.engagement < 30) {
    flags.push({
      reason: `Engagement score ${s.engagement}/100 is low`,
      data: `Engagement: ${s.engagement}/100`,
      action: 'Encourage clubs, hackathons or a team project to build experience and confidence.',
      severity: 1,
    })
  }

  if (s.cgpa < 6) {
    flags.push({
      reason: `CGPA ${s.cgpa} may limit eligibility for drives with a CGPA cutoff`,
      data: `CGPA: ${s.cgpa}`,
      action: 'Target skill-based hiring routes and strengthen the portfolio with verified projects.',
      severity: 1,
    })
  }

  return build(flags, gaps)
}