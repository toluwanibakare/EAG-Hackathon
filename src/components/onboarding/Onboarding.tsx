import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { useAccount, useConnect } from 'wagmi'
import { FinosIcon } from '../icons/FinosIcons'
import { injected } from 'wagmi/connectors'

const SLIDES = [
  {
    title: 'Welcome to Runda',
    description: 'The Programmable Envelope Financial OS. Every naira should have a job.',
    image: 'https://images.unsplash.com/photo-1614036634955-ae5e90f2ac77?auto=format&fit=crop&q=80&w=600&h=600',
  },
  {
    title: 'Smart Allocations',
    description: 'Automatically route your income into savings, investments, and expenses using on-chain smart contracts.',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=600&h=600',
  },
  {
    title: 'Web3 Powered',
    description: 'Connect your wallet on the HSK Chain to get started with true financial sovereignty.',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=600&h=600',
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

  if (isConnected && step === 'slides') {
    setStep('profile')
  }

  const darkMode = useStore((s) => s.darkMode)

  return (
    <div className={`fixed inset-0 z-[200] flex flex-col transition-colors duration-500 ${
      darkMode ? 'bg-[#0B1320] text-white' : 'bg-white text-gray-900'
    }`}>
      {step === 'slides' && (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 relative overflow-hidden">
            {SLIDES.map((slide, i) => (
              <div 
                key={i}
                className={`absolute inset-0 flex flex-col items-center justify-center p-8 transition-all duration-500 ${
                  i === slideIdx ? 'opacity-100 translate-x-0' : 
                  i < slideIdx ? 'opacity-0 -translate-x-full' : 'opacity-0 translate-x-full'
                }`}
              >
                <div className="w-full max-w-sm aspect-square rounded-[32px] overflow-hidden mb-8 shadow-2xl relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                  <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                </div>
                <h2 className="text-2xl font-bold text-center mb-3 tracking-tight">{slide.title}</h2>
                <p className={`text-center leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {slide.description}
                </p>
              </div>
            ))}
          </div>

          <div className="p-8 pb-12 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-8">
              {SLIDES.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === slideIdx 
                      ? 'w-6 bg-[#013D7C] dark:bg-[#E8B931]' 
                      : 'w-2 bg-gray-200 dark:bg-gray-800'
                  }`}
                />
              ))}
            </div>

            {slideIdx < SLIDES.length - 1 ? (
              <button 
                onClick={handleNextSlide}
                className="w-full h-[56px] rounded-2xl bg-[#013D7C] dark:bg-[#E8B931] text-white dark:text-[#013D7C] font-bold text-[16px] active:scale-[0.98] transition-transform"
              >
                Next
              </button>
            ) : (
              <button 
                onClick={handleConnect}
                disabled={isPending}
                className="w-full h-[56px] rounded-2xl bg-[#013D7C] dark:bg-[#E8B931] text-white dark:text-[#013D7C] font-bold text-[16px] active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
              >
                {isPending ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
      )}

      {step === 'profile' && (
        <div className="flex-1 flex flex-col p-8 pt-20 animate-fade-in">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-[32px] bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <FinosIcon name="user" size={40} className="text-gray-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2 tracking-tight">Set up Profile</h2>
          <p className={`text-center mb-10 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Enter your display name to continue.
          </p>

          <div className="space-y-6 flex-1">
            <div>
              <label className="block text-[13px] font-medium text-gray-500 dark:text-gray-400 mb-2 ml-1">
                Display Name
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter your name"
                className="w-full h-[56px] bg-gray-50 dark:bg-[#1A2332] rounded-[16px] px-4 text-[16px] font-semibold text-[#013D7C] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#013D7C]/20 transition-all"
              />
            </div>
            
            {(address || true) && (
              <div>
                <label className="block text-[13px] font-medium text-gray-500 dark:text-gray-400 mb-2 ml-1">
                  Connected Wallet
                </label>
                <div className="w-full h-[56px] bg-gray-50 dark:bg-[#1A2332] rounded-[16px] px-4 text-[14px] font-medium text-gray-500 flex items-center">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '0xMock...Address'}
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={handleFinish}
            disabled={!nameInput.trim()}
            className="w-full h-[56px] rounded-2xl bg-[#013D7C] dark:bg-[#E8B931] text-white dark:text-[#013D7C] font-bold text-[16px] active:scale-[0.98] transition-transform mt-auto disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  )
}
