import useSWR from 'swr'
import { fetcher, get, post, put, del } from '@/lib/apiClient'

const DISPLAY_CARDS_API_BASE = '/admin/display-cards'

export function useDisplayCards(page = 1, perPage = null) {
  // If perPage is provided, add it to URL, otherwise use backend default (15)
  const url = perPage 
    ? `${DISPLAY_CARDS_API_BASE}?page=${page}&per_page=${perPage}`
    : `${DISPLAY_CARDS_API_BASE}?page=${page}`
  const { data, error, isLoading, mutate } = useSWR(url, fetcher)

  return {
    display_cards: data?.display_cards || [],
    categories: data?.categories || [],
    subcategories: data?.subcategories || [],
    authors: data?.authors || [],
    // Total words across all articles (number)
    total_words: data?.total_words ?? 0,
    // Additional stats object (total_word_count, total_published_articles, average_words_per_article)
    stats: data?.stats || {},
    // Pagination data
    pagination: data?.pagination || { current_page: 1, last_page: 1, per_page: 15, total: 0 },
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
