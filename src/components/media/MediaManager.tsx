/**
 * MediaManager — Owner-facing media management UI
 * Upload, delete, and set primary images for artist/venue profiles
 */

import { useCallback } from 'react'
import { Trash2, Star, Upload, Loader2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import {
  useEntityMedia,
  useUploadMedia,
  useDeleteMedia,
  useSetPrimaryMedia,
} from '@/hooks'
import type { MediaTable } from '@/services/media'
import { cn } from '@/lib/utils'
import { showError } from '@/lib/toast'
import { formatBytes } from '@/lib/format'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface MediaManagerProps {
  table: MediaTable
  entityId: string
  maxImages?: number
}

const IMAGE_ACCEPT = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/gif': ['.gif'],
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export function MediaManager({
  table,
  entityId,
  maxImages = 10,
}: MediaManagerProps) {
  const { data: images, isLoading } = useEntityMedia(table, entityId)
  const uploadMedia = useUploadMedia(table, entityId)
  const deleteMedia = useDeleteMedia(table)
  const setPrimaryMedia = useSetPrimaryMedia(table)

  const atLimit = (images?.length ?? 0) >= maxImages

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      for (const file of acceptedFiles) {
        uploadMedia.mutate(
          { file },
          {
            onError: (error) => {
              showError(`Failed to upload ${file.name}: ${error.message}`)
            },
          }
        )
      }
    },
    [uploadMedia]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: IMAGE_ACCEPT,
    maxSize: MAX_FILE_SIZE,
    disabled: atLimit || uploadMedia.isPending,
    multiple: true,
  })

  const handleDelete = (id: string, url: string) => {
    deleteMedia.mutate({ id, url, entityId })
  }

  const handleSetPrimary = (mediaId: string) => {
    setPrimaryMedia.mutate({ entityId, mediaId })
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div data-testid="media-manager">
        <div
          data-testid="media-loading"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-lg bg-muted animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  const hasImages = images && images.length > 0

  return (
    <div data-testid="media-manager" className="space-y-6">
      {/* Upload Zone */}
      <div
        {...getRootProps()}
        data-testid="media-upload-zone"
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors cursor-pointer',
          isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50',
          (atLimit || uploadMedia.isPending) &&
            'cursor-not-allowed opacity-50'
        )}
      >
        <input {...getInputProps()} />
        {uploadMedia.isPending ? (
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        ) : (
          <Upload className="h-8 w-8 text-muted-foreground" />
        )}
        <p className="mt-2 text-sm font-medium">
          {atLimit
            ? `Maximum of ${maxImages} images reached`
            : isDragActive
              ? 'Drop images here'
              : 'Click or drag to upload images'}
        </p>
        {!atLimit && (
          <p className="text-xs text-muted-foreground mt-1">
            JPEG, PNG, WebP, or GIF up to {formatBytes(MAX_FILE_SIZE)}
          </p>
        )}
      </div>

      {/* Empty State */}
      {!hasImages && (
        <div
          data-testid="media-empty"
          className="text-center py-8 text-muted-foreground"
        >
          <p>No photos yet. Upload your first image.</p>
        </div>
      )}

      {/* Image Grid */}
      {hasImages && (
        <div
          data-testid="media-grid"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
          {images.map((media) => (
            <div
              key={media.id}
              data-testid={`media-item-${media.id}`}
              className="group relative aspect-square rounded-lg overflow-hidden bg-muted"
            >
              <img
                src={media.url}
                alt={media.title || 'Gallery image'}
                className="h-full w-full object-cover"
              />

              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-start justify-between p-2 opacity-0 group-hover:opacity-100">
                {/* Set Primary */}
                <Button
                  variant="ghost"
                  size="icon"
                  data-testid={`media-primary-${media.id}`}
                  className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white"
                  onClick={() => handleSetPrimary(media.id)}
                  disabled={setPrimaryMedia.isPending}
                >
                  <Star
                    className={cn(
                      'h-4 w-4',
                      media.is_primary && 'fill-yellow-400 text-yellow-400'
                    )}
                  />
                </Button>

                {/* Delete */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      data-testid={`media-delete-${media.id}`}
                      className="h-8 w-8 bg-black/50 hover:bg-destructive text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete image?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently remove the image. This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(media.id, media.url)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        data-testid={`media-confirm-delete-${media.id}`}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {/* Primary badge (always visible) */}
              {media.is_primary && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center py-1">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
