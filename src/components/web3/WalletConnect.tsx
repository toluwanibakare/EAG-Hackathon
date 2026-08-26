import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Wallet, LogOut, Copy, Check } from 'lucide-react'
import { useState } from 'react'

export function WalletConnect() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const [copied, setCopied] = useState(false)

  if (isConnected && address) {
    const truncated = `${address.slice(0, 6)}...${address.slice(-4)}`
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            navigator.clipboard.writeText(address)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }}
          className="flex items-center gap-2 bg-white dark:bg-[#1A2332] border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1.5 text-[12px] font-mono text-[#013D7C] dark:text-white transition-all duration-150 active:scale-95"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
          <span>{truncated}</span>
          {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="text-gray-400" />}
        </button>
        <button
          onClick={() => disconnect()}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 active:bg-gray-200 dark:active:bg-gray-700 transition-colors duration-150"
        >
          <LogOut size={14} />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => {
        const injected = connectors.find((c) => c.id === 'injected') || connectors[0]
        if (injected) connect({ connector: injected })
      }}
      className="flex items-center gap-2 bg-[#013D7C] dark:bg-[#E8B931] text-white dark:text-[#013D7C] rounded-full px-4 py-2 text-[13px] font-bold active:scale-95 transition-all duration-150"
    >
      <Wallet size={16} />
      <span>Connect Wallet</span>
    </button>
  )
}
