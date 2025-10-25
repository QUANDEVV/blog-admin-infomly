// ...existing code...

/**
 * Simple hooks to manage subcategories in the admin UI.
 * - Styled after hooks/FeatureCard/useArticles.js (SWR + apiClient helpers)
 * - Keep it minimal: fetch list, fetch single, create, update, delete.
 * - NOTE: For the "parent category" select in UI, call useCategories from:
 *     import { useCategories } from '@/hooks/Categories/useCategories'
 *   Do not duplicate category fetching here — useCategories is the source of truth.
 */

import useSWR from 'swr'
import { fetcher, get, post, put, del } from '@/lib/apiClient'

/* Base API path for subcategories in the admin backend.
   Ensure this matches your Laravel routes (routes/api.php). */
const SUBCATS_API_BASE = '/admin/subcategories'

/**
 * Fetch paginated list of subcategories.
 * - query: optional object for query params (page, per_page, search, etc.)
 * - Returns: { subcategories, isLoading, isError, mutate }
 */
export function useSubcategories(query = null) {
  // Build SWR key; include query string when provided so SWR caches per-query.
  const key = query ? `${SUBCATS_API_BASE}?${new URLSearchParams(query).toString()}` : SUBCATS_API_BASE
  const { data, error, isLoading, mutate } = useSWR(key, fetcher)

  return {
    // Normalize backend response to a simple array and pagination if present.
    subcategories: data?.subcategories || [],
    pagination: data?.pagination || null,
    isLoading,
    isError: error,
    mutate,
  }
}

/**
 * Fetch a single subcategory by ID.
 * - id: number | null
 * - Returns: { subcategory, isLoading, isError, mutate }
 */
export function useSubcategory(id) {
  const { data, error, isLoading, mutate } = useSWR(id ? `${SUBCATS_API_BASE}/${id}` : null, fetcher)

  return {
    subcategory: data?.subcategory || null,
    isLoading,
    isError: error,
    mutate,
  }
}

/**
 * Create a new subcategory.
 * - payload: { name: string, category_id: number } (or FormData)
 * - Returns created resource or API response.
 */
export function useCreateSubcategory() {
  const createSubcategory = async (payload) => {
    try {
      return await post(SUBCATS_API_BASE, payload)
    } catch (error) {
      console.error('Error creating subcategory:', error)
      throw error
    }
  }

  return { createSubcategory }
}

/**
 * Update an existing subcategory.
 * - id: number
 * - payload: partial fields or FormData
 * - Handles FormData -> append _method=PUT to support file uploads if ever needed.
 */
export function useUpdateSubcategory() {
  const updateSubcategory = async (id, payload) => {
    try {
      if (payload instanceof FormData) {
        payload.append('_method', 'PUT')
        return await post(`${SUBCATS_API_BASE}/${id}`, payload)
      } else {
        return await put(`${SUBCATS_API_BASE}/${id}`, payload)
      }
    } catch (error) {
      console.error('Error updating subcategory:', error)
      throw error
    }
  }

  return { updateSubcategory }
}

/**
 * Delete a subcategory by ID.
 */
export function useDeleteSubcategory() {
  const deleteSubcategory = async (id) => {
    try {
      await del(`${SUBCATS_API_BASE}/${id}`)
    } catch (error) {
      console.error('Error deleting subcategory:', error)
      throw error
    }
  }

  return { deleteSubcategory }
}