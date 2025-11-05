import useSWR from 'swr'
import { fetcher } from '@/lib/apiClient'

// keep the API path consistent with the rest of the hooks
const STATS_API_PATH = '/admin/contents/stats'

/**
 * useContentStats
 * Use SWR to fetch the admin content stats. This matches the pattern used by
 * other hooks in this codebase (no useEffect). It returns the same shape as
 * other hooks: { stats, isLoading, error, refetch } where refetch is the SWR
 * mutate function.
 */
export default function useContentStats() {
  const { data, error, isLoading, mutate } = useSWR(STATS_API_PATH, fetcher)

  // Normalise response shape: some endpoints return { message, data: [...] }
  // while others may return the array directly. Prefer the nested `data` if present.
  const stats = data && typeof data === 'object' && 'data' in data ? data.data : data

  return {
    stats,
    isLoading,
    error,
    refetch: mutate,
  }
}
