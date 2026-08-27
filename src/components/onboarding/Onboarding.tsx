import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { useAccount, useConnect } from 'wagmi'
import { FinosIcon } from '../icons/FinosIcons'
import { injected } from 'wagmi/connectors'

const SLIDES = [
  {
    title: 'Welcome to Runda',
    description: 'The Programmable Envelope Financial OS. Every naira should have a job.',
    image: 'https://image.pollinations.ai/prompt/A%20fun%20hand-drawn%203D%20cartoon%20illustration%20of%20a%20magical%20glowing%20money%20envelope%20floating%20over%20a%20futuristic%20bank%20vault%20vibrant%20colors?nologo=true&seed=42&width=1080&height=1920',
  },
  {
    title: 'Smart Allocations',
    description: 'Automatically route your income into savings, investments, and expenses using on-chain smart contracts.',
    image: 'https://image.pollinations.ai/prompt/A%20fun%20hand-drawn%203D%20cartoon%20illustration%20of%20colorful%20digital%20coins%20sorting%20into%20labeled%20jars%20vibrant%20colors?nologo=true&seed=43&width=1080&height=1920',
  },
  {
    title: 'Web3 Powered',
    description: 'Connect your wallet on the HSK Chain to get started with true financial sovereignty.',
    image: 'https://image.pollinations.ai/prompt/A%20fun%20hand-drawn%203D%20cartoon%20illustration%20of%20a%20digital%20wallet%20connected%20to%20a%20glowing%20blockchain%20vibrant%20colors?nologo=true&seed=44&width=1080&height=1920',
  }
]

export function Onboarding() {
  const [step, setStep] = useState<'slides' | 'profile'>('slides')
  const [slideIdx, setSlideIdx] = useState(0)
  const { isConnected, address } = useAccount()
  const { connect, isPending } = useConnect()
  const setOnboarded = useStore((s) => s.setOnboarded)
  const setWalletAddress = useStore((s) => s.setWalletAddress)
  const setUserName = useStore((s) => s.setUserName)

  const [nameInput, setNameInput] = useState('')

  const handleNextSlide = () => {
    if (slideIdx < SLIDES.length - 1) {
      setSlideIdx(s => s + 1)
    }
  }

  const handleConnect = () => {
    connect({ connector: injected() }, {
      onSuccess: () => {
        setStep('profile')
      },
      onError: (err) => {
        console.error(err)
        // For testing, just go to profile anyway if no wallet
        setStep('profile')
      }
    })
  }

  const handleFinish = () => {
    if (!nameInput.trim()) return
    setUserName(nameInput.trim())
    if (address) {
      setWalletAddress(address)
    }
    setOnboarded(true)
  }

  const darkMode = useStore((s) => s.darkMode)

  return (
    <div className={`fixed inset-0 z-[200] flex flex-col transition-colors duration-500 bg-[#0B1320]`}>
      {step === 'slides' && (
        <div className="flex-1 flex flex-col relative bg-black">
          {/* Images Layer */}
          <div className="absolute inset-0 overflow-hidden">
            {SLIDES.map((slide, i) => (
              <img 
                key={i}
                src={slide.image} 
                alt=""
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${
                  i === slideIdx ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                }`}
              />
            ))}
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1320] via-[#0B1320]/60 to-transparent" />
          </div>

          {/* Content Layer */}
          <div className="relative z-10 flex-1 flex flex-col justify-end p-8 pb-12">
            
            <div className="mb-10 text-white min-h-[120px]">
               <h2 className="text-[32px] font-extrabold mb-4 tracking-tight leading-tight">
                 {SLIDES[slideIdx].title}
               </h2>
               <p className="text-[16px] text-gray-300 leading-relaxed font-medium">
                 {SLIDES[slideIdx].description}
               </p>
            </div>

            <div className="flex items-center gap-2 mb-8">
              {SLIDES.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === slideIdx 
                      ? 'w-8 bg-[#E8B931]' 
                      : 'w-2 bg-white/30'
                  }`}
                />
              ))}
            </div>

            {slideIdx < SLIDES.length - 1 ? (
              <button 
                onClick={handleNextSlide}
                className="w-full h-[60px] rounded-[20px] bg-white text-[#013D7C] font-bold text-[16px] active:scale-[0.98] transition-transform shadow-xl"
              >
                Next
              </button>
            ) : (
              <button 
                onClick={isConnected ? () => setStep('profile') : handleConnect}
                disabled={isPending && !isConnected}
                className="w-full h-[60px] rounded-[20px] bg-[#E8B931] text-[#013D7C] font-bold text-[16px] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 shadow-[0_8px_32px_rgba(232,185,49,0.3)]"
              >
                {(isPending && !isConnected) ? 'Connecting...' : (isConnected ? 'Wallet Connected - Continue' : 'Connect Wallet')}
              </button>
            )}
          </div>
        </div>
      )}

      {step === 'profile' && (
        <div className={`flex-1 flex flex-col relative overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-[#0B1320]' : 'bg-white'}`}>
          {/* Subtle background glow */}
          <div className="absolute top-0 left-0 w-full h-64 bg-[#013D7C]/10 dark:bg-[#E8B931]/10 blur-3xl rounded-full -translate-y-1/2 pointer-events-none" />
          
          <div className="relative z-10 flex-1 flex flex-col p-8 pt-24 animate-fade-in">
            <div className="flex justify-center mb-8">
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#013D7C] to-[#0256B0] dark:from-[#E8B931] dark:to-[#F1D06A] flex items-center justify-center shadow-2xl p-1">
                 <div className="w-full h-full rounded-full border-[3px] border-white dark:border-[#0B1320] flex items-center justify-center bg-white dark:bg-[#1A2332]">
                   <FinosIcon name="user" size={40} className="text-[#013D7C] dark:text-[#E8B931]" />
                 </div>
              </div>
            </div>
            
            <h2 className="text-3xl font-extrabold text-center mb-3 tracking-tight text-[#013D7C] dark:text-white">
              Create Profile
            </h2>
            <p className="text-center mb-10 text-gray-500 dark:text-gray-400 font-medium text-[15px]">
              What should we call you?
            </p>

            <div className="space-y-6 flex-1 w-full max-w-sm mx-auto">
              <div className="group">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Your Display Name"
                  className="w-full h-[60px] bg-gray-50 dark:bg-[#1A2332] border-2 border-transparent focus:border-[#013D7C]/20 dark:focus:border-[#E8B931]/20 rounded-[20px] px-5 text-[16px] font-bold text-[#013D7C] dark:text-white focus:outline-none transition-all placeholder:font-medium placeholder:text-gray-400"
                />
              </div>
              
              <div className="p-5 rounded-[20px] bg-gray-50 dark:bg-[#1A2332] border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-[#0B1320] flex items-center justify-center shadow-sm">
                  <FinosIcon name="link" size={18} className="text-[#013D7C] dark:text-[#E8B931]" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="text-[12px] font-bold text-gray-400 uppercase tracking-wider mb-1">Wallet Connected</div>
                  <div className="text-[15px] font-bold text-[#013D7C] dark:text-white truncate">
                    {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '0xMock...Address'}
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleFinish}
              disabled={!nameInput.trim()}
              className="w-full max-w-sm mx-auto h-[60px] rounded-[20px] bg-[#013D7C] dark:bg-[#E8B931] text-white dark:text-[#013D7C] font-bold text-[16px] active:scale-[0.98] transition-all mt-8 disabled:opacity-50 disabled:active:scale-100 shadow-[0_8px_24px_rgba(1,61,124,0.2)] dark:shadow-[0_8px_24px_rgba(232,185,49,0.2)]"
            >
              Enter Runda
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
