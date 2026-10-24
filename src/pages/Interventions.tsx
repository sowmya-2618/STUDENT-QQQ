import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { students } from '../data/students'

type Status = 'Pending' | 'In Progress' | 'Completed'
type Note = { at: string; text: string }
type Item = {
  id: string
  studentId: string
  reason: string
  action: string
  followUp: string
  status: Status
  createdAt: string
  history: Note[]
}

const KEY = 'studentiq_interventions'
const STATUSES: Status[] = ['Pending', 'In Progress', 'Completed']

const STATUS_STYLE: Record<Status, string> = {
  Pending: 'bg-amber-100 text-amber-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
}

function load(): Item[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Item[]) : []
  } catch {
    return []
  }
}

export default function Interventions() {
  const [items, setItems] = useState<Item[]>(load)
  const [studentId, setStudentId] = useState('')
  const [reason, setReason] = useState('')
  const [action, setAction] = useState('')
  const [followUp, setFollowUp] = useState('')
  const [filter, setFilter] = useState<'All' | Status>('All')
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [error, setError] = useState('')

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items))
  }, [items])

  const nameOf = (id: string) => students.find((s) => String(s.id) === id)?.name ?? id
  const now = () => new Date().toLocaleString()

  const add = () => {
    if (!studentId || !reason.trim()) {
      setError('Please select a student and write the reason.')
      return
    }
    setError('')
    const item: Item = {
      id: String(Date.now()),
      studentId,
      reason: reason.trim(),
      action: action.trim(),
      followUp,
      status: 'Pending',
      createdAt: now(),
      history: [{ at: now(), text: 'Intervention created (Pending)' }],
    }
    setItems((prev) => [item, ...prev])
    setReason('')
    setAction('')
    setFollowUp('')
  }

  const changeStatus = (id: string, status: Status) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id && it.status !== status
          ? {
              ...it,
              status,
              history: [...it.history, { at: now(), text: `Status changed: ${it.status} to ${status}` }],
            }
          : it,
      ),
    )
  }

  const addNote = (id: string) => {
    const text = (notes[id] ?? '').trim()
    if (!text) return
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, history: [...it.history, { at: now(), text: `Feedback: ${text}` }] } : it,
      ),
    )
    setNotes((n) => ({ ...n, [id]: '' }))
  }

  const count = (s: Status) => items.filter((i) => i.status === s).length
  const shown = filter === 'All' ? items : items.filter((i) => i.status === filter)

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-bold text-navy">Faculty Interventions</h1>
        <p className="text-sm text-slate-600">
          Track support actions for students. Demo: saved only in this browser (localStorage). Sample data: fictional students.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {STATUSES.map((s) => (
          <div key={s} className="rounded-xl bg-white p-4 shadow">
            <p className="text-2xl font-bold text-electric">{count(s)}</p>
            <p className="text-sm text-slate-600">{s}</p>
          </div>
        ))}
      </div>

      <section className="space-y-3 rounded-xl bg-white p-4 shadow">
        <h2 className="font-semibold text-navy">New intervention</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="rounded border border-slate-300 p-2 text-sm"
          >
            <option value="">Select student</option>
            {students.map((s) => (
              <option key={String(s.id)} value={String(s.id)}>
                {s.name} ({String(s.id)})
              </option>
            ))}
          </select>
          <input
            type="date"
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
            className="rounded border border-slate-300 p-2 text-sm"
          />
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason (for example: attendance below 75%)"
            className="rounded border border-slate-300 p-2 text-sm"
          />
          <input
            value={action}
            onChange={(e) => setAction(e.target.value)}
            placeholder="Planned action (for example: parent meeting, mentoring)"
            className="rounded border border-slate-300 p-2 text-sm"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button onClick={add} className="rounded bg-electric px-4 py-2 text-sm font-medium text-white hover:opacity-90">
          Add intervention
        </button>
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-slate-600">Show:</span>
        {(['All', ...STATUSES] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-sm ${
              filter === f ? 'bg-electric text-white' : 'bg-white text-slate-700 shadow'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {shown.length === 0 && (
        <p className="rounded-xl bg-white p-4 text-sm text-slate-600 shadow">
          No interventions yet. Add one above.
        </p>
      )}

      <div className="space-y-4">
        {shown.map((it) => (
          <div key={it.id} className="space-y-3 rounded-xl bg-white p-4 shadow">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <Link to={`/students/${it.studentId}`} className="font-semibold text-electric underline">
                  {nameOf(it.studentId)}
                </Link>
                <p className="text-sm text-slate-700">Reason: {it.reason}</p>
                {it.action && <p className="text-sm text-slate-700">Action: {it.action}</p>}
                {it.followUp && <p className="text-sm text-slate-500">Follow-up date: {it.followUp}</p>}
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[it.status]}`}>
                {it.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => changeStatus(it.id, s)}
                  disabled={it.status === s}
                  className="rounded border border-slate-300 px-3 py-1 text-xs disabled:opacity-40"
                >
                  Mark {s}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={notes[it.id] ?? ''}
                onChange={(e) => setNotes((n) => ({ ...n, [it.id]: e.target.value }))}
                placeholder="Add feedback or follow-up note"
                className="flex-1 rounded border border-slate-300 p-2 text-sm"
              />
              <button
                onClick={() => addNote(it.id)}
                className="rounded bg-navy px-3 py-2 text-sm text-white hover:opacity-90"
              >
                Add note
              </button>
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-slate-500">History</p>
              <ul className="space-y-1 text-sm text-slate-700">
                {it.history.map((h, i) => (
                  <li key={i}>
                    <span className="text-slate-500">{h.at}:</span> {h.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}