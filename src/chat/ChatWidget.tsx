import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, X, Maximize2 } from 'lucide-react'
import Chat from './Chat'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  return (
    <div className="print:hidden">
      {open && (
        <div className="fixed bottom-20 right-4 z-50 flex h-[28rem] w-[22rem] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-electric px-3 py-2 text-white">
            <span className="text-sm font-semibold">StudentIQ Assistant</span>
            <Link to="/assistant" onClick={() => setOpen(false)} aria-label="Open full page">
              <Maximize2 size={16} />
            </Link>
          </div>
          <Chat className="min-h-0 flex-1" />
        </div>
      )}
      <button
        aria-label={open ? 'Close assistant' : 'Open assistant'}
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-electric text-white shadow-lg"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  )
}