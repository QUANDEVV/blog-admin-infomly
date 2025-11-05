import useSWR from 'swr'
import { fetcher } from '@/lib/apiClient'

const DISPLAY_CARDS_AVAILABLE_API_PATH = '/admin/display-cards/available'

/**
 * Hook to fetch available display cards for linking to content.
 * Returns display cards grouped by availability:
 * - available: cards without content (can be linked)
 * - linked: cards with content (already linked, should be disabled/blurred)
 */
export const useAvailableDisplayCards = () => {
  const { data, error, isLoading, mutate } = useSWR(DISPLAY_CARDS_AVAILABLE_API_PATH, fetcher)

  return {
    availableCards: data?.available || [],
    linkedCards: data?.linked || [],
    isLoading,
    isError: error,
    mutate,
  }
}
