/**
 * Avatar upload component with circular preview
 * Shows current avatar or initials fallback, camera overlay on hover
 */

import { Camera } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { FileUpload } from './FileUpload'

interface AvatarUploadProps {
  currentAvatarUrl?: string | null
  onUpload: (file: File) => Promise<void>
  uploading?: boolean
  userName?: string
}

function getInitials(name?: string): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
}

export function AvatarUpload({
  currentAvatarUrl,
  onUpload,
  uploading = false,
  userName,
}: AvatarUploadProps) {
  const handleFileSelect = async (file: File) => {
    await onUpload(file)
  }

  return (
    <div className="flex flex-col items-center gap-3" data-testid="avatar-upload">
      <FileUpload
        onFileSelect={handleFileSelect}
        maxSize={5 * 1024 * 1024}
        disabled={uploading}
        className="group"
      >
        <div className="relative">
          <Avatar className="h-24 w-24">
            {currentAvatarUrl && (
              <AvatarImage
                src={currentAvatarUrl}
                alt={userName || 'Avatar'}
                className="object-cover"
              />
            )}
            <AvatarFallback className="text-2xl">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>

          {/* Overlay */}
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
            {uploading ? (
              <LoadingSpinner className="h-6 w-6 text-white" />
            ) : (
              <Camera className="h-6 w-6 text-white" />
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-3">
          {uploading ? 'Uploading...' : 'Click to change avatar'}
        </p>
      </FileUpload>
    </div>
  )
}
