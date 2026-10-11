import { WEIGHTS, type Comp } from './score'

export type Driver = { key: Comp; value: number; weight: number; points: number; share: number }

// Missing components skip chestam (zero ga teesukodu). Weights available components meeda re-normalise.
export function drivers(comp: Record<Comp, number | null | undefined>): Driver[] {
  const keys = (Object.keys(WEIGHTS) as Comp[]).filter((k) => comp[k] != null)
  const used = keys.reduce((a, k) => a + WEIGHTS[k], 0)
  return keys
    .map((k) => {
      const value = comp[k] as number
      const points = used ? (value * WEIGHTS[k]) / used : 0
      return { key: k, value, weight: WEIGHTS[k], points, share: 0 }
    })
    .map((d, _i, all) => {
      const total = all.reduce((a, x) => a + x.points, 0)
      return { ...d, share: total ? (d.points / total) * 100 : 0 }
    })
    .sort((a, b) => b.points - a.points)
}