export const WEIGHTS = {
  academic: 30, attendance: 20, lms: 15,
  skills: 15, placement: 15, engagement: 5,
}

export type Comp = keyof typeof WEIGHTS
type Parts = Partial<Record<Comp, number | null>>

export function successScore(p: Parts) {
  let sum = 0, used = 0
  const missing: string[] = []
  for (const k of Object.keys(WEIGHTS) as Comp[]) {
    const v = p[k]
    if (v == null) { missing.push(k); continue }
    sum += v * WEIGHTS[k]; used += WEIGHTS[k]
  }
  return {
    score: used ? Math.round(sum / used) : null,
    incomplete: missing.length > 0,
    missing,
  }
}