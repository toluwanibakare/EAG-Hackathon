import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Paperclip, Loader2 } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { useAgent } from '../../hooks/useAgent'
import { ChatMessage } from './ChatMessage'
import { generateId } from '../../lib/utils'

export function ChatWidget() {
  const chatOpen = useStore((s) => s.chatOpen)
  const toggleChat = useStore((s) => s.toggleChat)
  const messages = useStore((s) => s.chatMessages)
  const addMessage = useStore((s) => s.addChatMessage)
  const [input, setInput] = useState('')
  const { loading, chat, parseImage, parsePdf, parseSpreadsheet } = useAgent()
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [hasGreeted, setHasGreeted] = useState(false)

  useEffect(() => {
    if (chatOpen && messages.length === 0 && !hasGreeted) {
      setHasGreeted(true)
      addMessage({
        id: generateId(),
        role: 'assistant',
        content: "Welcome to Runda! I be your programmable finance assistant. How I fit help you today? You fit ask me about your pools, allocation, or we fit analyze a receipt together.",
        timestamp: new Date().toISOString(),
      })
    }
  }, [chatOpen, messages.length, hasGreeted, addMessage])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (chatOpen) setTimeout(() => inputRef.current?.focus(), 400)
  }, [chatOpen])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return

    addMessage({
      id: generateId(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    })
    setInput('')

    const reply = await chat(text, messages)
    if (reply) addMessage(reply)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      const data = reader.result as string
      const type = (file.type.includes('pdf') ? 'pdf' : file.type.includes('sheet') || file.type.includes('csv') ? 'spreadsheet' : 'image') as 'pdf' | 'spreadsheet' | 'image'
      
      const fileMsg = {
        id: generateId(),
        role: 'user' as const,
        content: `I uploaded a file: ${file.name}`,
        timestamp: new Date().toISOString(),
        attachment: { type, name: file.name, data },
      }
      addMessage(fileMsg)

      let result;
      if (type === 'pdf') {
        result = await parsePdf(file)
      } else if (type === 'spreadsheet') {
        result = await parseSpreadsheet(file)
      } else {
        result = await parseImage(data)
      }

      if (result && result.pools && result.pools.length > 0) {
        const prompt = `I uploaded a file named ${file.name}. Here is the extracted data: ${JSON.stringify(result.pools)}. Can you summarize this and ask if I want to apply these allocations?`
        const reply = await chat(prompt, [...messages, fileMsg])
        if (reply) addMessage(reply)
      } else {
        addMessage({
          id: generateId(),
          role: 'assistant',
          content: "Sorry, I couldn't extract any valid allocation data from that file. Make sure it contains clear percentages or amounts.",
          timestamp: new Date().toISOString()
        })
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <>
      {!chatOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-[80px] right-4 z-[90] w-14 h-14 rounded-full bg-gradient-to-tr from-[#013D7C] to-[#0256B0] dark:from-[#E8B931] dark:to-[#F1D06A] text-white dark:text-[#013D7C] shadow-lg shadow-[#013D7C]/30 dark:shadow-[#E8B931]/30 flex items-center justify-center active:scale-90 transition-all duration-200"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {chatOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={toggleChat} />

          <div className="absolute bottom-0 left-0 right-0 bg-[#F7F8FB] dark:bg-[#0B1320] rounded-t-[32px] max-h-[85vh] flex flex-col animate-slide-up shadow-2xl overflow-hidden border-t border-white/20 dark:border-white/5">
            <div className="flex items-center justify-between px-6 pt-5 pb-4 shrink-0 bg-white/80 dark:bg-[#1A2332]/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#013D7C] to-[#2E5196] dark:from-[#E8B931] dark:to-[#F1D06A] flex items-center justify-center shadow-md">
                  <span className="text-[13px] font-extrabold text-white dark:text-[#013D7C]">R</span>
                </div>
                <div>
                  <h2 className="text-[16px] font-extrabold text-[#013D7C] dark:text-white leading-tight">Runda AI</h2>
                  <span className="text-[11px] text-gray-500 font-semibold tracking-wide uppercase">Finance Assistant</span>
                </div>
              </div>
              <button
                onClick={toggleChat}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 active:bg-gray-200 dark:active:bg-gray-700 transition-colors duration-150"
              >
                <X size={16} />
              </button>
            </div>

            <div className="w-8 h-[3px] bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-2" />

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-4 min-h-0">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {loading && (
                <div className="flex items-center gap-2 ml-9 mb-3">
                  <Loader2 size={14} className="text-gray-400 animate-spin" />
                  <span className="text-[12px] text-gray-400 font-medium">Runda dey think...</span>
                </div>
              )}
            </div>

            <div className="shrink-0 px-4 pb-4 pt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 rounded-2xl px-4 py-2">
                <label className="flex items-center justify-center w-8 h-8 rounded-full text-gray-400 active:text-gray-600 transition-colors duration-150 cursor-pointer">
                  <Paperclip size={18} />
                  <input
                    type="file"
                    accept="image/*,.pdf,.xlsx,.xls,.csv"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Runda anything..."
                  className="flex-1 bg-transparent text-[14px] text-[#013D7C] dark:text-white outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600 min-w-0"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-[#013D7C] dark:bg-[#E8B931] text-white dark:text-[#013D7C] disabled:opacity-40 active:scale-90 transition-all duration-150 shrink-0"
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
