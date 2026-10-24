import Chat from '../chat/Chat'

export default function Assistant() {
  return (
    <div className="space-y-4 p-6">
      <h1 className="text-3xl font-bold text-electric">AI Assistant</h1>
      <p className="text-xs text-amber-700">Sample data: fictional students</p>
      <div className="h-[70vh] overflow-hidden rounded-xl border bg-white">
        <Chat className="h-full" />
      </div>
    </div>
  )
}