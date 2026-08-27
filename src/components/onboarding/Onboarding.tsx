import { useState } from 'react'
import { useStore } from '../../store/useStore'
import { useAccount, useConnect } from 'wagmi'
import { FinosIcon } from '../icons/FinosIcons'
import { injected } from 'wagmi/connectors'

const SLIDES = [
  {
    title: 'Welcome to Runda',
    description: 'The Programmable Envelope Financial OS. Every naira should have a job.',
    image: '/slide1.jpg',
  },
  {
    title: 'Smart Allocations',
    description: 'Automatically route your income into savings, investments, and expenses using on-chain smart contracts.',
    image: '/slide2.jpg',
  },
  {
    title: 'Web3 Powered',
    description: 'Connect your wallet on the HSK Chain to get started with true financial sovereignty.',
    image: '/slide3.jpg',
  }
]

import { supabase } from '../../lib/supabase'

export function Onboarding() {
  const [step, setStep] = useState<'slides' | 'profile'>('slides')
  const [slideIdx, setSlideIdx] = useState(0)
  const { isConnected, address } = useAccount()
  const { connect, isPending } = useConnect()
  const setOnboarded = useStore((s) => s.setOnboarded)
  const setWalletAddress = useStore((s) => s.setWalletAddress)
  const setUserName = useStore((s) => s.setUserName)
  const setPin = useStore((s) => s.setPin)

  const [nameInput, setNameInput] = useState('')
  const [checkingDb, setCheckingDb] = useState(false)

  const handleNextSlide = () => {
    if (slideIdx < SLIDES.length - 1) {
      setSlideIdx(s => s + 1)
    }
  }

  const checkUserInDb = async (walletAddress: string) => {
    try {
      setCheckingDb(true)
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single()

      if (user) {
        setUserName(user.user_name)
        if (user.pin) {
          setPin(user.pin)
        }
        setWalletAddress(walletAddress)
        setOnboarded(true)
        return true
      }
    } catch (err) {
      console.error('Error fetching user from DB:', err)
    } finally {
      setCheckingDb(false)
    }
    return false
  }

  const handleConnect = () => {
    connect({ connector: injected() }, {
      onSuccess: async (data) => {
        const found = await checkUserInDb(data.accounts[0])
        if (!found) {
          setStep('profile')
        }
      },
      onError: (err) => {
        console.error(err)
        setStep('profile')
      }
    })
  }

  const handleFinish = async () => {
    if (!nameInput.trim()) return
    setUserName(nameInput.trim())
    
    if (address) {
      setWalletAddress(address)
      await supabase.from('users').insert({
        wallet_address: address,
        user_name: nameInput.trim()
      })
    }
    setOnboarded(true)
  }

  const darkMode = useStore((s) => s.darkMode)

  return (
    <div className={`fixed inset-0 z-[200] flex flex-col transition-colors duration-500 ${
      darkMode ? 'bg-[#0B1320] text-white' : 'bg-[#F7F8FB] text-gray-900'
    }`}>
      {step === 'slides' && (
        <div className="flex-1 flex flex-col pt-12 pb-8 px-6">
          <div className="flex-1 relative flex flex-col items-center justify-center min-h-[400px]">
            {SLIDES.map((slide, i) => (
              <div 
                key={i}
                className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ${
                  i === slideIdx ? 'opacity-100 translate-x-0 scale-100' : 
                  i < slideIdx ? 'opacity-0 -translate-x-12 scale-95 pointer-events-none' : 'opacity-0 translate-x-12 scale-95 pointer-events-none'
                }`}
              >
                <div className="w-full max-w-[280px] aspect-square rounded-[40px] overflow-hidden mb-10 shadow-2xl relative bg-white dark:bg-gray-800">
                  <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                </div>
                <div className="text-center w-full max-w-sm px-4">
                  <h2 className={`text-2xl font-bold mb-3 tracking-tight ${darkMode ? 'text-white' : 'text-[#013D7C]'}`}>{slide.title}</h2>
                  <p className={`text-[15px] leading-relaxed font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {slide.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center pt-8">
            <div className="flex items-center gap-2 mb-8">
              {SLIDES.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === slideIdx 
                      ? 'w-8 bg-[#013D7C] dark:bg-[#E8B931]' 
                      : 'w-2 bg-gray-300 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>

            {slideIdx < SLIDES.length - 1 ? (
              <button 
                onClick={handleNextSlide}
                className="w-full h-[56px] rounded-[20px] bg-[#013D7C] dark:bg-[#E8B931] text-white dark:text-[#013D7C] font-bold text-[16px] active:scale-[0.98] transition-transform shadow-xl"
              >
                Continue
              </button>
            ) : (
              <button 
                onClick={isConnected ? () => {
                  if (address) {
                    checkUserInDb(address).then((found) => {
                      if (!found) setStep('profile')
                    })
                  } else {
                    setStep('profile')
                  }
                } : handleConnect}
                disabled={isPending && !isConnected}
                className="w-full h-[56px] rounded-[20px] bg-[#013D7C] dark:bg-[#E8B931] text-white dark:text-[#013D7C] font-bold text-[16px] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 shadow-xl"
              >
                {(isPending && !isConnected) ? 'Connecting...' : (isConnected ? 'Wallet Connected - Continue' : 'Connect Wallet')}
              </button>
            )}
          </div>
        </div>
      )}

      {step === 'profile' && (
        <div className="flex-1 flex flex-col p-6 pt-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-[32px] bg-white dark:bg-[#1A2332] shadow-xl flex items-center justify-center border border-gray-100 dark:border-gray-800">
              <FinosIcon name="user" size={40} className="text-[#013D7C] dark:text-[#E8B931]" />
            </div>
          </div>
          <h2 className={`text-2xl font-bold text-center mb-2 tracking-tight ${darkMode ? 'text-white' : 'text-[#013D7C]'}`}>Create Profile</h2>
          <p className={`text-center mb-10 text-[15px] font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            What should we call you?
          </p>

          <div className="space-y-6 flex-1 w-full max-w-sm mx-auto">
            <div>
              <label className="block text-[13px] font-bold text-gray-500 dark:text-gray-400 mb-2 ml-1">
                DISPLAY NAME
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Enter your name"
                className="w-full h-[60px] bg-white dark:bg-[#1A2332] rounded-[20px] px-5 text-[16px] font-bold text-[#013D7C] dark:text-white focus:outline-none border-2 border-transparent focus:border-[#013D7C]/20 dark:focus:border-[#E8B931]/20 transition-all shadow-sm"
              />
            </div>
            
            <div className="p-4 rounded-[20px] bg-white dark:bg-[#1A2332] border border-gray-100 dark:border-gray-800 flex items-center gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#F7F8FB] dark:bg-[#0B1320] flex items-center justify-center">
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
            className="w-full h-[60px] rounded-[20px] bg-[#013D7C] dark:bg-[#E8B931] text-white dark:text-[#013D7C] font-bold text-[16px] active:scale-[0.98] transition-transform mt-auto disabled:opacity-50 shadow-xl"
          >
            Enter Runda
          </button>
        </div>
      )}
    </div>
  )
}
