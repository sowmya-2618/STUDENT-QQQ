export type Student = {
  id: string; name: string; dept: string; semester: number
  cgpa: number; attendance: number; backlogs: number
  lms: number | null; skills: number | null
  placement: number | null; engagement: number | null
  sgpa: number[]
  skillList: { name: string; verified: boolean }[]
}

// SAMPLE DATA: fictional students for demo only
const names = ['Sarigama','Sowmya ','Asritha','Shrilu','Mahesh Babu','Amrutha','Harsha Vardhan','Neelima','Pavan Kalyan','Dhoni','Triveni','Srivalli','Joshwa','Keerthi','Sai Charan','Nandu','Siva Sai Krishna','Ramesh','Munna','Anil Kumar','Swathi','Megha Sree','Jyothi','Praveen','Meghana','Charan','Sirisha','Vamsi','Tejaswi','Rohit','Surya','Arjun','Haritha','Ajay','Bindu','Varsha','Sneha','Bharath','Gayathri','Dinesh']
const depts = ['CSE', 'ECE', 'MECH', 'CIVIL', 'AI&DS', 'AI', 'AI&ML', 'IOT', 'DS', '']
const pool: Record<string, string[]> = {
  CSE: ['React', 'Python', 'SQL'],
  ECE: ['Embedded C', 'IoT'],
  MECH: ['AutoCAD', 'Robotics'],
  CIVIL: ['STAAD', 'Surveying'],
  'AI&DS': ['Python', 'Machine Learning'],
  AI: ['Python', 'Deep Learning'],
  'AI&ML': ['Python', 'Machine Learning'],
  IOT: ['IoT', 'Embedded C'],
  DS: ['Python', 'Data Viz'],
}
let seed = 7
const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
const r = (a: number, b: number) => Math.round(a + rnd() * (b - a))

export const students: Student[] = names.map((name, i) => {
  const dept = depts[i % depts.length]
  const hidden = i % 7 === 3 // low CGPA, high practical skills
  const cgpa = hidden
    ? Math.round((5.5 + rnd() * 0.9) * 10) / 10
    : Math.round((5 + rnd() * 4.5) * 10) / 10
  return {
    id: 'S' + String(i + 1).padStart(3, '0'), name, dept,
    semester: 1 + (i % 8), cgpa, attendance: r(55, 98),
    backlogs: cgpa < 6 ? r(1, 3) : r(0, 1),
    lms: i % 9 === 4 ? null : r(25, 95),
    skills: hidden ? r(82, 95) : r(35, 90),
    placement: r(30, 92), engagement: r(15, 90),
        sgpa: [0, 1, 2, 3].map(() => Math.min(10, Math.max(4, Math.round((cgpa + (rnd() - 0.5) * 1.2) * 10) / 10))),
    skillList: (pool[dept] ?? ['Python']).map((n) => ({ name: n, verified: rnd() > 0.5 })),
  }
})