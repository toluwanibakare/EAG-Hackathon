import { PageContainer } from '../components/layout/PageContainer'
import { Header } from '../components/layout/Header'
import { FinosIcon } from '../components/icons/FinosIcons'

export default function Website() {
  return (
    <PageContainer>
      <Header title="Website" showBack />
      <div className="pt-4">
        <div className="bg-white dark:bg-[#1A2332] rounded-[20px] p-8 text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-[16px] bg-gray-100 dark:bg-gray-800 mx-auto mb-4">
            <FinosIcon name="globe" size={24} className="text-gray-400" />
          </div>
          <p className="text-[14px] font-bold text-[#013D7C] dark:text-white mb-1">finos.app</p>
          <p className="text-[12px] text-gray-400 font-medium">Visit our website for more information</p>
        </div>
      </div>
    </PageContainer>
  )
}
