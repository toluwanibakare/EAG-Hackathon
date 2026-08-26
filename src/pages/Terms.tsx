import { PageContainer } from '../components/layout/PageContainer'
import { Header } from '../components/layout/Header'

export default function Terms() {
  return (
    <PageContainer>
      <Header title="Terms of Service" showBack />
      <div className="pt-4">
        <div className="bg-white dark:bg-[#1A2332] rounded-[20px] p-5">
          <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            By using FINOS, you agree to the following terms:
          </p>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-[13px] font-bold text-[#013D7C] dark:text-white mb-1">1. Use of Service</p>
              <p className="text-[12px] text-gray-400 font-medium leading-relaxed">
                FINOS is a personal finance tool designed to help you manage and allocate your money. It is not a bank or financial institution.
              </p>
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#013D7C] dark:text-white mb-1">2. Data Privacy</p>
              <p className="text-[12px] text-gray-400 font-medium leading-relaxed">
                Your financial data is stored locally on your device. We do not share your information with third parties.
              </p>
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#013D7C] dark:text-white mb-1">3. Accuracy</p>
              <p className="text-[12px] text-gray-400 font-medium leading-relaxed">
                While we strive for accuracy, FINOS is a tool for personal tracking. Always verify with your bank statements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
