/**
 * Generic drag-and-drop file upload zone
 * Uses react-dropzone for drag & drop support
 */

import { useCallback, useState } from 'react'
import { useDropzone, type FileRejection } from 'react-dropzone'
import { Upload, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatBytes } from '@/lib/format'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  accept?: Record<string, string[]>
  maxSize?: number
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}

const IMAGE_ACCEPT = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/gif': ['.gif'],
}

export function FileUpload({
  onFileSelect,
  accept = IMAGE_ACCEPT,
  maxSize = 10 * 1024 * 1024,
  disabled = false,
  className,
  children,
}: FileUploadProps) {
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[], rejections: FileRejection[]) => {
      setError(null)

      if (rejections.length > 0) {
        const rejection = rejections[0]
        const code = rejection.errors[0]?.code
        if (code === 'file-too-large') {
          setError(`File must be under ${formatBytes(maxSize)}`)
        } else if (code === 'file-invalid-type') {
          setError('File type not supported. Use JPEG, PNG, WebP, or GIF.')
        } else {
          setError(rejection.errors[0]?.message || 'Invalid file')
        }
        return
      }

      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0])
      }
    },
    [onFileSelect, maxSize]
  )

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept,
    maxSize,
    maxFiles: 1,
    disabled,
    noClick: true,
  })

  const handleClick = () => {
    if (!disabled) open()
  }

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        onClick={handleClick}
        data-testid="file-upload-dropzone"
        className={cn(
          'relative flex flex-col items-center justify-center transition-colors cursor-pointer',
          !children && 'rounded-lg border-2 border-dashed p-6',
          !children && (isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50'),
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <input {...getInputProps()} data-testid="file-upload-input" />

        {children || (
          <div className="flex flex-col items-center gap-2 text-center">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">
                {isDragActive ? 'Drop file here' : 'Click or drag to upload'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                JPEG, PNG, WebP, or GIF up to {formatBytes(maxSize)}
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 mt-2 text-sm text-destructive">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
