import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { useRealtimeNotifications } from '@/hooks/queries/use-notifications'

export function MainLayout() {
  useRealtimeNotifications()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 md:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
