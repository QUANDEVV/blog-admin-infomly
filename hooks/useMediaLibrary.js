import useSWR from 'swr'
import { apiFetch } from '@/lib/apiClient'

/**
 * useMediaLibrary Hook
 * 
 * Purpose: Fetch previously uploaded media for reuse
 * Benefits:
 * - Avoid re-uploading same images
 * - Save storage costs
 * - Faster content creation
 * 
 * Usage:
 * const { media, isLoading } = useMediaLibrary()
 */
export const useMediaLibrary = (type = 'image', limit = 50) => {
    const { data, error, isLoading, mutate } = useSWR(
        `/admin/media?type=${type}&limit=${limit}`,
        apiFetch
    )

    return {
        media: data?.data || [],
        pagination: data?.pagination,
        isLoading,
        error,
        refresh: mutate,
    }
}
