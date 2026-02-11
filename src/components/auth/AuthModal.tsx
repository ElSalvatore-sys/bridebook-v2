import { Dialog, DialogContent } from '@/components/ui/dialog'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { useAuthModal } from '@/context/AuthModalContext'

export function AuthModal() {
  const { isOpen, mode, closeModal, switchMode } = useAuthModal()

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[600px] bg-[#1a1a2e] border-none shadow-2xl backdrop-blur-sm">
        {mode === 'login' ? (
          <LoginForm onSwitchToRegister={() => switchMode('register')} />
        ) : (
          <RegisterForm onSwitchToLogin={() => switchMode('login')} />
        )}
      </DialogContent>
    </Dialog>
  )
}
