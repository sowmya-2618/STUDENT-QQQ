import type { Level } from '../lib/risk'

const c: Record<Level, string> = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-green-100 text-green-700',
}
export default function Badge({ level }: { level: Level }) {
  return <span className={`rounded px-2 py-0.5 text-xs font-medium ${c[level]}`}>{level}</span>
}