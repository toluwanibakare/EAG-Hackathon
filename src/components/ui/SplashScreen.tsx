import { useEffect, useState } from 'react'
import { useStore } from '../../store/useStore'

interface SplashScreenProps {
  onFinish: () => void
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const darkMode = useStore((s) => s.darkMode)
  const [phase, setPhase] = useState<'logo' | 'tagline' | 'done'>('logo')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('tagline'), 800)
    const t2 = setTimeout(() => setPhase('done'), 2400)
    const t3 = setTimeout(onFinish, 2800)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onFinish])

  return (
    <div className={`fixed inset-0 z-[300] flex flex-col items-center justify-center transition-colors duration-500 ${
      darkMode ? 'bg-[#0B1320]' : 'bg-white'
    }`}>
      <div className={`transition-all duration-700 ${
        phase === 'done' ? 'scale-110 opacity-0' : 'scale-100 opacity-100'
      }`}>
        <img src={darkMode ? "/logo_white.PNG" : "/logo.PNG"} alt="RUNDA" className="w-28 h-28 rounded-[32px] object-contain animate-[scaleUp_0.8s_cubic-bezier(0.22,1,0.36,1)_forwards]" />
      </div>

      <div className={`transition-all duration-500 ${
        phase !== 'logo' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}>
        <p className={`text-[13px] font-medium tracking-wide ${
          darkMode ? 'text-white/40' : 'text-gray-400'
        }`}>Every naira should have a job</p>
      </div>

      <div className={`mt-6 transition-all duration-500 ${
        phase === 'done' ? 'opacity-0' : 'opacity-100'
      }`}>
        <div className={`w-7 h-7 border-2 rounded-full animate-spin ${
          darkMode ? 'border-white/10 border-t-[#E8B931]' : 'border-gray-200 border-t-[#013D7C]'
        }`} />
      </div>
    </div>
  )
}
