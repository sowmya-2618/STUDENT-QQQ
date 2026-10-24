import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Send } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { answer, suggestionsFor } from './answer'

type Msg = { from: 'user' | 'bot'; text: string }

export default function Chat({ className = '' }: { className?: string }) {
  const { user } = useAuth()
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: 'bot', text: `Hi ${user?.name ?? ''}! Ask me about student data. Pick a suggestion or type your question.` },
  ])
  const [input, setInput] = useState('')
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = boxRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [msgs])

  function send(text: string) {
    const t = text.trim()
    if (!t || !user) return
    setMsgs((m) => [...m, { from: 'user', text: t }, { from: 'bot', text: answer(t, user) }])
    setInput('')
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') send(input)
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <div ref={boxRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
        {msgs.map((m, i) => (
          <div key={i} className={m.from === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                m.from === 'user' ? 'bg-electric text-white' : 'bg-slate-100 text-slate-800'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 border-t p-2">
        {suggestionsFor(user?.role ?? 'student').map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            className="rounded-full border px-3 py-1 text-xs text-slate-700 hover:bg-slate-100"
          >
            {s}
          </button>
        ))}
      </div>
      <div className="flex gap-2 border-t p-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder="Ask a question…"
          className="min-w-0 flex-1 rounded border bg-white p-2 text-sm"
        />
        <button
          aria-label="Send"
          onClick={() => send(input)}
          className="rounded bg-electric px-3 text-white"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}