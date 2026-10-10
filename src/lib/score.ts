export const WEIGHTS = {
  academic: 30, attendance: 20, lms: 15,
  skills: 15, placement: 15, engagement: 5,
} as const
export type Comp = keyof typeof WEIGHTS

// Missing data ni zero ga teesukodu, migilina components meeda weights re-normalize avthayi
export function successScore(p: Partial<Record<Comp, number | null>>) {
  let sum = 0
  let used = 0
  const missing: Comp[] = []
  for (const k of Object.keys(WEIGHTS) as Comp[]) {
    const v = p[k]
    if (v == null) { missing.push(k); continue }
    sum += v * WEIGHTS[k]
    used += WEIGHTS[k]
  }
  return { score: used ? Math.round(sum / used) : 0, incomplete: missing.length > 0, missing }
}