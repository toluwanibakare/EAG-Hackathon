import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { PageContainer } from '../components/layout/PageContainer'
import { Header } from '../components/layout/Header'
import { SwipeableCard } from '../components/ui/SwipeableCard'
import { NotificationItem } from '../components/ui/NotificationItem'
import { EmptyState } from '../components/ui/EmptyState'

export default function Notifications() {
  const navigate = useNavigate()
  const notifications = useStore((s) => s.notifications)
  const markNotificationRead = useStore((s) => s.markNotificationRead)

  const handleNotificationClick = (id: string) => {
    markNotificationRead(id)
  }

  return (
    <PageContainer>
      <Header
        title="Notifications"
        showBack
        rightAction={
          <button
            onClick={() => navigate('/settings/preferences')}
            className="flex items-center justify-center w-9 h-9 -mr-1 rounded-xl text-[#013D7C] dark:text-white active:bg-black/5 dark:active:bg-white/10 transition-colors duration-150"
          >
            <span className="text-[18px]">⚙</span>
          </button>
        }
      />

      <div className="pt-2">
        {notifications.length === 0 ? (
          <EmptyState
            icon="bell"
            title="No notifications"
            description="You are all caught up. Notifications will appear here."
          />
        ) : (
          <div className="space-y-2">
            {notifications.map((notif) => (
              <SwipeableCard
                key={notif.id}
                onDelete={() => markNotificationRead(notif.id)}
              >
                <NotificationItem
                  notification={notif}
                  onClick={() => handleNotificationClick(notif.id)}
                />
              </SwipeableCard>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  )
}
