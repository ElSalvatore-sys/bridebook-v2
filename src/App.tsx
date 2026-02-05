import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { DevAuthPanel } from '@/components/dev/DevAuthPanel'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Outlet />
        <Toaster position="bottom-left" />
        <DevAuthPanel />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
