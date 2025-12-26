import useSWR from 'swr'
import { fetcher, post } from '@/lib/apiClient'

const PWA_API_BASE = '/pwa'

export function usePwa() {
    const { data, error, isLoading, mutate } = useSWR(`${PWA_API_BASE}/stats`, fetcher)

    const broadcastPush = async (payload) => {
        try {
            return await post(`${PWA_API_BASE}/push-broadcast`, payload)
        } catch (error) {
            console.error('Error broadcasting push:', error)
            throw error
        }
    }

    return {
        stats: data?.data || null,
        isLoading,
        isError: error,
        broadcastPush,
        mutate,
    }
}
