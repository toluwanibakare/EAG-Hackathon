import { PageContainer } from '../components/layout/PageContainer'
import { Header } from '../components/layout/Header'

export default function About() {
  return (
    <PageContainer>
      <Header title="About RUNDA" showBack />
      <div className="pt-4 space-y-4">
        <div className="bg-white dark:bg-[#1A2332] rounded-[20px] p-5 text-center">
          <img src="/logo.PNG" alt="RUNDA" className="w-16 h-16 rounded-[20px] object-cover mx-auto mb-4" />
          <p className="text-[18px] font-bold text-[#013D7C] dark:text-white tracking-[-0.02em]">RUNDA</p>
          <p className="text-[12px] text-gray-400 font-medium mt-1">Personal Financial Operating System</p>
          <p className="text-[11px] text-gray-300 dark:text-gray-600 font-medium mt-1">Version 1.0.0</p>
        </div>

        <div className="bg-white dark:bg-[#1A2332] rounded-[20px] p-5">
          <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed text-center">
            Every naira should have a job. RUNDA helps you allocate, track, and grow your money with purpose.
          </p>
        </div>

        <a
          href="https://www.tmb.it.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-white dark:bg-[#1A2332] rounded-[20px] px-4 py-4 active:bg-gray-50 dark:active:bg-gray-800 transition-colors"
        >
          <span className="text-[12px] text-gray-400 font-medium">Built by</span>
          <span className="text-[13px] font-bold text-[#013D7C] dark:text-[#E8B931]">TMB</span>
        </a>
      </div>
    </PageContainer>
  )
}
