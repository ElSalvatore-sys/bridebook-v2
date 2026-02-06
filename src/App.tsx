import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { QueryProvider } from '@/providers/QueryProvider'
import { DevAuthPanel } from '@/components/dev/DevAuthPanel'

function App() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <Outlet />
          <Toaster position="bottom-left" />
          <DevAuthPanel />
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}

export default App
