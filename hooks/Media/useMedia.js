import useSWR from 'swr'
import { apiFetch } from '@/lib/apiClient'

/**
 * useMedia Hook
 * 
 * Purpose: Fetch and manage media library
 * 
 * @param {object} filters - { type: 'image', limit: 50 }
 * @returns {object} { media, isLoading, error, pagination, refresh }
 */
export const useMedia = (filters = {}) => {
    // Build query string from filters
    const queryParams = new URLSearchParams()
    if (filters.type) queryParams.append('type', filters.type)
    if (filters.limit) queryParams.append('limit', filters.limit)
    if (filters.uploaded_by) queryParams.append('uploaded_by', filters.uploaded_by)
    
    const queryString = queryParams.toString()
    const endpoint = `/admin/media${queryString ? `?${queryString}` : ''}`

    const { data, error, isLoading, mutate } = useSWR(endpoint, apiFetch)

    return {
        media: data?.data || [],
        pagination: data?.pagination,
        isLoading,
        error,
        refresh: mutate,
    }
}

/**
 * useMediaByArticle Hook
 * 
 * Purpose: Get all media for a specific article
 * 
 * @param {number} articleId
 * @returns {object} { article, media, isLoading, error, refresh }
 */
export const useMediaByArticle = (articleId) => {
    const { data, error, isLoading, mutate } = useSWR(
        articleId ? `/admin/media/article/${articleId}` : null,
        apiFetch
    )

    return {
        article: data?.article,
        media: data?.media || [],
        totalMedia: data?.total_media || 0,
        isLoading,
        error,
        refresh: mutate,
    }
}

/**
 * useOrganizedMedia Hook
 * 
 * Purpose: Get all articles with their media (organized view)
 * Features: Search, pagination, featured image first
 * 
 * @param {object} options - { search: 'keyword', status: 'published', page: 1 }
 * @returns {object} { articles, isLoading, error, pagination, refresh }
 */
export const useOrganizedMedia = (options = {}) => {
    // Build query string
    const queryParams = new URLSearchParams()
    if (options.search) queryParams.append('search', options.search)
    if (options.status) queryParams.append('status', options.status)
    if (options.page) queryParams.append('page', options.page)
    
    const queryString = queryParams.toString()
    const endpoint = `/admin/media/by-article${queryString ? `?${queryString}` : ''}`

    const { data, error, isLoading, mutate } = useSWR(endpoint, apiFetch)

    return {
        articles: data?.data || [],
        pagination: data?.pagination,
        isLoading,
        error,
        refresh: mutate,
    }
}

/**
 * useOrphanedMedia Hook
 * 
 * Purpose: Get media not used in any articles
 * 
 * @returns {object} { media, totalOrphaned, isLoading, error, refresh }
 */
export const useOrphanedMedia = () => {
    const { data, error, isLoading, mutate } = useSWR(
        '/admin/media/orphaned',
        apiFetch
    )

    return {
        media: data?.data || [],
        totalOrphaned: data?.total_orphaned || 0,
        pagination: data?.pagination,
        isLoading,
        error,
        refresh: mutate,
    }
}
