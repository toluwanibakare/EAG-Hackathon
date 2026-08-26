import type { ChatMessage as ChatMessageType } from '../../types'
import { AllocationCard } from './AllocationCard'

interface ChatMessageProps {
  message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3 animate-fade-in`}>
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-[#013D7C] to-[#2E5196] flex items-center justify-center mr-2 mt-1">
          <span className="text-[10px] font-bold text-white">R</span>
        </div>
      )}

      <div className={`max-w-[80%] ${isUser ? 'order-1' : ''}`}>
        <div
          className={`px-4 py-2.5 text-[14px] leading-relaxed ${
            isUser
              ? 'bg-[#013D7C] dark:bg-[#E8B931] text-white dark:text-[#013D7C] rounded-[18px] rounded-br-[6px]'
              : 'bg-gray-100 dark:bg-[#1A2332] text-[#013D7C] dark:text-white rounded-[18px] rounded-bl-[6px]'
          }`}
        >
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
        </div>

        {message.allocations && message.allocations.length > 0 && (
          <div className="mt-2">
            {message.allocations.map((alloc, i) => (
              <AllocationCard key={i} allocation={alloc} onConfirm={() => {}} onEdit={() => {}} />
            ))}
          </div>
        )}

        {message.attachment && (
          <div className="mt-2 flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl px-3 py-2">
            <span className="text-[11px] text-gray-400 font-medium">{message.attachment.name}</span>
            <span className="text-[10px] text-gray-300 dark:text-gray-600 uppercase">{message.attachment.type}</span>
          </div>
        )}

        <span className="text-[10px] text-gray-300 dark:text-gray-600 mt-1 block px-1">
          {new Date(message.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        </span>
      </div>
    </div>
  )
}
