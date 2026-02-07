/**
 * Image URL helpers and transform utilities
 * Provides size presets and a transform stub for future Supabase Pro upgrade
 */

/**
 * Image size presets for responsive display
 */
export const imageSizes = {
  thumbnail: { width: 100, height: 100 },
  small: { width: 300, height: 300 },
  medium: { width: 600, height: 600 },
  large: { width: 1200, height: 1200 },
} as const

export type ImageSize = keyof typeof imageSizes

/**
 * Get a transformed image URL with size parameters
 * Currently returns the raw URL (Supabase free tier).
 * When upgraded to Pro, append ?width=X&height=Y&resize=contain
 */
export function getTransformedImageUrl(
  url: string,
  _size?: ImageSize
): string {
  // TODO: When on Supabase Pro, uncomment:
  // if (_size) {
  //   const { width, height } = imageSizes[_size]
  //   const separator = url.includes('?') ? '&' : '?'
  //   return `${url}${separator}width=${width}&height=${height}&resize=contain`
  // }
  return url
}

/**
 * Get avatar URL with optional size transform
 * Returns undefined if no URL provided (for AvatarImage src prop)
 */
export function getAvatarUrl(
  url: string | null | undefined,
  size?: ImageSize
): string | undefined {
  if (!url) return undefined
  return getTransformedImageUrl(url, size)
}

/**
 * Get media URL with optional size transform
 */
export function getMediaUrl(url: string, size?: ImageSize): string {
  return getTransformedImageUrl(url, size)
}
