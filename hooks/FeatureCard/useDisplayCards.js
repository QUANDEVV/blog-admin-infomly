import useSWR from 'swr'
import { fetcher, get, post, put, del } from '@/lib/apiClient'

const DISPLAY_CARDS_API_BASE = '/admin/display-cards'

export function useDisplayCards() {
  const { data, error, isLoading, mutate } = useSWR(DISPLAY_CARDS_API_BASE, fetcher)

  return {
    display_cards: data?.display_cards || [],
    categories: data?.categories || [],
    subcategories: data?.subcategories || [],
    authors: data?.authors || [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function useDisplayCard(id) {
  const { data, error, isLoading, mutate } = useSWR(id ? `${DISPLAY_CARDS_API_BASE}/${id}` : null, fetcher)

  return {
    display_card: data?.display_card || null,
    isLoading,
    isError: error,
    mutate,
  }
}

export function useCreateDisplayCard() {
  const createDisplayCard = async (payload) => {
    try {
      return await post(DISPLAY_CARDS_API_BASE, payload)
    } catch (error) {
      console.error('Error creating display card:', error)
      throw error
    }
  }
  return { createDisplayCard }
}

export function useUpdateDisplayCard() {
  const updateDisplayCard = async (id, payload) => {
    try {
      if (payload instanceof FormData) {
        payload.append('_method', 'PUT')
        return await post(`${DISPLAY_CARDS_API_BASE}/${id}`, payload)
      } else {
        return await put(`${DISPLAY_CARDS_API_BASE}/${id}`, payload)
      }
    } catch (error) {
      console.error('Error updating display card:', error)
      throw error
    }
  }
  return { updateDisplayCard }
}

export function useDeleteDisplayCard() {
  const deleteDisplayCard = async (id) => {
    try {
      await del(`${DISPLAY_CARDS_API_BASE}/${id}`)
    } catch (error) {
      console.error('Error deleting display card:', error)
      throw error
    }
  }
  return { deleteDisplayCard }
}
