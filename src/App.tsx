import { useState, useCallback, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { BottomNav } from './components/layout/BottomNav'
import { SplashScreen } from './components/ui/SplashScreen'
import { PinLogin } from './components/ui/PinLogin'
import { ChatWidget } from './components/chat/ChatWidget'
import { PullToRefresh } from './components/ui/PullToRefresh'
import { useStore } from './store/useStore'
import Home from './pages/Home'
import Money from './pages/Money'
import Goals from './pages/Goals'
import Activity from './pages/Activity'
import More from './pages/More'
import PoolDetail from './pages/PoolDetail'
import TransactionDetail from './pages/TransactionDetail'
import GoalDetail from './pages/GoalDetail'
import AddGoal from './pages/AddGoal'
import AddIncome from './pages/AddIncome'
import AddExpense from './pages/AddExpense'
import Withdrawal from './pages/Withdrawal'
import AllocationPolicy from './pages/AllocationPolicy'
import Notifications from './pages/Notifications'
import Privacy from './pages/Privacy'
import Preferences from './pages/Preferences'
import About from './pages/About'
import Terms from './pages/Terms'
import Website from './pages/Website'
import Profile from './pages/Profile'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function AppShell() {
  const handleRefresh = async () => {
    // Wait a bit to show the spinner
    await new Promise(r => setTimeout(r, 600));
    window.location.reload();
  }

  return (
    <div className="h-screen h-[100dvh] w-full overflow-hidden flex flex-col bg-[#F7F8FB] dark:bg-[#0B1320] transition-colors overscroll-none">
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="pb-[68px]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/money" element={<Money />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/more" element={<More />} />
            <Route path="/pool/:poolId" element={<PoolDetail />} />
            <Route path="/transaction/:transactionId" element={<TransactionDetail />} />
            <Route path="/goal/:goalId" element={<GoalDetail />} />
            <Route path="/goals/new" element={<AddGoal />} />
            <Route path="/add-income" element={<AddIncome />} />
            <Route path="/add-expense" element={<AddExpense />} />
            <Route path="/withdrawal" element={<Withdrawal />} />
            <Route path="/allocation-policy" element={<AllocationPolicy />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings/privacy" element={<Privacy />} />
            <Route path="/settings/preferences" element={<Preferences />} />
            <Route path="/settings/about" element={<About />} />
            <Route path="/settings/terms" element={<Terms />} />
              <Route path="/settings/website" element={<Website />} />
              <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </PullToRefresh>
      <BottomNav />
      <ChatWidget />
    </div>
  )
}

export default function App() {
  const darkMode = useStore((s) => s.darkMode)
  const isLocked = useStore((s) => s.isLocked)
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const handleSplash = useCallback(() => setShowSplash(false), [])

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppShell />
      {showSplash && <SplashScreen onFinish={handleSplash} />}
      {!showSplash && isLocked && <PinLogin />}
    </BrowserRouter>
  )
}
