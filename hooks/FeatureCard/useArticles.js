import useSWR from 'swr';
import { fetcher, get, post, put, del } from '@/lib/apiClient';

const ARTICLES_API_BASE_PATH = '/admin/articles'; // API base path for articles in the admin panel

/**
 * Hook to fetch all articles.
 * Returns an object with articles data, loading state, error state, and mutate function.
 */
export function useArticles() {
  const { data, error, isLoading, mutate } = useSWR(ARTICLES_API_BASE_PATH, fetcher);

  return {
    articles: data?.articles || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to fetch a single article by ID.
 * Takes an ID parameter; if null, doesn't fetch.
 * Returns an object with article data, loading state, error state, and mutate function.
 */
export function useArticle(id) {
  const { data, error, isLoading, mutate } = useSWR(id ? `${ARTICLES_API_BASE_PATH}/${id}` : null, fetcher);

  return {
    article: data?.article,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to create a new article.
 * Returns an object with createArticle function that takes articleInput and posts to API.
 */
export function useCreateArticle() {
  const createArticle = async (articleInput) => {
    try {
      const newArticle = await post(ARTICLES_API_BASE_PATH, articleInput);
      // Optionally revalidate all articles after creation
      // mutate(ARTICLES_API_BASE_PATH);
      return newArticle;
    } catch (error) {
      console.error("Error creating article:", error);
      throw error;
    }
  };
  return { createArticle };
}

/**
 * Hook to update an existing article.
 * Returns an object with updateArticle function that takes ID and articleInput, puts to API.
 */
export function useUpdateArticle() {
  const updateArticle = async (id, articleInput) => {
    try {
      // Some backends (eg. Laravel) don't parse multipart/form-data on PUT/PATCH requests.
      // If articleInput is a FormData, append _method=PUT and POST instead so server receives files and fields.
      let updatedArticle;
      if (articleInput instanceof FormData) {
        articleInput.append('_method', 'PUT')
        updatedArticle = await post(`${ARTICLES_API_BASE_PATH}/${id}`, articleInput);
      } else {
        updatedArticle = await put(`${ARTICLES_API_BASE_PATH}/${id}`, articleInput);
      }
      // Optionally revalidate the specific article or all articles after update
      // mutate(`${ARTICLES_API_BASE_PATH}/${id}`);
      return updatedArticle;
    } catch (error) {
      console.error("Error updating article:", error);
      throw error;
    }
  };
  return { updateArticle };
}

/**
 * Hook to delete an article.
 * Returns an object with deleteArticle function that takes ID and deletes from API.
 */
export function useDeleteArticle() {
  const deleteArticle = async (id) => {
    try {
      await del(`${ARTICLES_API_BASE_PATH}/${id}`);
      // Optionally revalidate all articles after deletion
      // mutate(ARTICLES_API_BASE_PATH);
    } catch (error) {
      console.error("Error deleting article:", error);
      throw error;
    }
  };
  return { deleteArticle };
}