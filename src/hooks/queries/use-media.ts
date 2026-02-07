/**
 * Media upload and management query hooks
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import {
  StorageService,
  MediaService,
  ProfileService,
  type MediaTable,
} from '@/services'
import type { CreateMediaRecordInput } from '@/lib/validations'
import { profileKeys } from './use-profile'
import { artistKeys } from './use-artists'
import { venueKeys } from './use-venues'
import { showSuccess, showError, showLoading, dismissToast } from '@/lib/toast'
import { isAbortError } from '@/lib/errors'
import { useAuth } from '@/hooks/useAuth'

/**
 * Query key factory for media
 */
export const mediaKeys = {
  all: ['media'] as const,
  entity: (table: string, entityId: string) =>
    [...mediaKeys.all, table, entityId] as const,
}

/**
 * Upload avatar mutation
 * Compresses, uploads to storage, then updates profile.avatar_url
 */
export function useUploadAvatar() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error('Not authenticated')
      const url = await StorageService.uploadAvatar(file, user.id)
      await ProfileService.update({ avatar_url: url })
      return url
    },
    onMutate: () => {
      const toastId = showLoading('Uploading avatar...')
      return { toastId }
    },
    onSuccess: (_url, _file, context) => {
      if (context?.toastId) dismissToast(context.toastId)
      queryClient.invalidateQueries({ queryKey: profileKeys.current() })
      showSuccess('Avatar updated')
    },
    onError: (error, _file, context) => {
      if (context?.toastId) dismissToast(context.toastId)
      if (isAbortError(error)) return
      console.error('[useUploadAvatar] Upload failed:', error)
      showError(error)
    },
  })
}

/**
 * Upload entity media mutation (artist or venue)
 * Compresses, uploads to storage, then creates a DB record
 */
export function useUploadMedia(
  table: MediaTable,
  entityId: string
) {
  const queryClient = useQueryClient()
  const bucket = table === 'artist_media' ? 'artist-media' : 'venue-media'

  return useMutation({
    mutationFn: async (params: {
      file: File
      metadata?: Partial<Pick<CreateMediaRecordInput, 'title' | 'description' | 'sort_order' | 'is_primary'>>
    }) => {
      const url = await StorageService.uploadEntityMedia(
        params.file,
        bucket,
        entityId
      )
      return MediaService.create(table, entityId, {
        url,
        type: 'IMAGE',
        sort_order: 0,
        is_primary: false,
        ...params.metadata,
      })
    },
    onMutate: () => {
      const toastId = showLoading('Uploading image...')
      return { toastId }
    },
    onSuccess: (_data, _params, context) => {
      if (context?.toastId) dismissToast(context.toastId)
      queryClient.invalidateQueries({ queryKey: mediaKeys.entity(table, entityId) })
      // Also invalidate the parent entity detail cache
      if (table === 'artist_media') {
        queryClient.invalidateQueries({ queryKey: artistKeys.detail(entityId) })
      } else {
        queryClient.invalidateQueries({ queryKey: venueKeys.detail(entityId) })
      }
      showSuccess('Image uploaded')
    },
    onError: (error, _params, context) => {
      if (context?.toastId) dismissToast(context.toastId)
      if (isAbortError(error)) return
      showError(error)
    },
  })
}

/**
 * Delete media mutation
 * Removes from storage and deletes DB record
 */
export function useDeleteMedia(table: MediaTable) {
  const queryClient = useQueryClient()
  const bucket = table === 'artist_media' ? 'artist-media' : 'venue-media'

  return useMutation({
    mutationFn: async (params: {
      id: string
      url: string
      entityId: string
    }) => {
      // Try to delete from storage (extract path from URL)
      const path = StorageService.extractPath(params.url, bucket)
      if (path) {
        await StorageService.deleteFile(bucket, path)
      }
      // Delete DB record
      await MediaService.delete(table, params.id)
    },
    onSuccess: (_data, params) => {
      queryClient.invalidateQueries({
        queryKey: mediaKeys.entity(table, params.entityId),
      })
      if (table === 'artist_media') {
        queryClient.invalidateQueries({ queryKey: artistKeys.detail(params.entityId) })
      } else {
        queryClient.invalidateQueries({ queryKey: venueKeys.detail(params.entityId) })
      }
      showSuccess('Image deleted')
    },
    onError: (error) => {
      if (isAbortError(error)) return
      showError(error)
    },
  })
}

/**
 * Query for listing media by entity
 */
export function useEntityMedia(table: MediaTable, entityId: string) {
  return useQuery({
    queryKey: mediaKeys.entity(table, entityId),
    queryFn: () => MediaService.getByEntity(table, entityId),
    enabled: !!entityId,
  })
}

/**
 * Set primary media mutation
 */
export function useSetPrimaryMedia(table: MediaTable) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: { entityId: string; mediaId: string }) => {
      await MediaService.setPrimary(table, params.entityId, params.mediaId)
    },
    onSuccess: (_data, params) => {
      queryClient.invalidateQueries({
        queryKey: mediaKeys.entity(table, params.entityId),
      })
      if (table === 'artist_media') {
        queryClient.invalidateQueries({ queryKey: artistKeys.detail(params.entityId) })
      } else {
        queryClient.invalidateQueries({ queryKey: venueKeys.detail(params.entityId) })
      }
      showSuccess('Primary image updated')
    },
    onError: (error) => {
      if (isAbortError(error)) return
      showError(error)
    },
  })
}
