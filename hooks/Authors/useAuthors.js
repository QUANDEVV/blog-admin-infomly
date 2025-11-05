import useSWR from 'swr';
import { fetcher, get, post, put, del } from '@/lib/apiClient';

const AUTHORS_API_BASE_PATH = '/admin/authors'; // Backend API path for author management

/**
 * Hook to fetch all authors for admin management
 * @returns {Object} - Contains authors array, loading state, error state, and mutate function
 */
export function useAuthors() {
  const { data, error, isLoading, mutate } = useSWR(AUTHORS_API_BASE_PATH, fetcher);

  return {
    authors: data,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to fetch a specific author by ID
 * @param {number} id - Author ID
 * @returns {Object} - Contains author object, loading state, error state, and mutate function
 */
export function useAuthor(id) {
  const { data, error, isLoading, mutate } = useSWR(id ? `${AUTHORS_API_BASE_PATH}/${id}` : null, fetcher);

  return {
    author: data,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to create new author
 * @returns {Object} - Contains createAuthor function
 */
export function useCreateAuthor() {
  const createAuthor = async (authorInput) => {
    try {
      const newAuthor = await post(AUTHORS_API_BASE_PATH, authorInput);
      // Optionally revalidate authors list after creation
      // mutate(AUTHORS_API_BASE_PATH);
      return newAuthor;
    } catch (error) {
      console.error("Error creating author:", error);
      throw error;
    }
  };

  return { createAuthor };
}

/**
 * Hook to update existing author
 * @returns {Object} - Contains updateAuthor function
 */
export function useUpdateAuthor() {
  const updateAuthor = async (id, authorInput) => {
    try {
      const updatedAuthor = await put(`${AUTHORS_API_BASE_PATH}/${id}`, authorInput);
      // Optionally revalidate the specific author or all authors after update
      // mutate(`${AUTHORS_API_BASE_PATH}/${id}`);
      return updatedAuthor;
    } catch (error) {
      console.error("Error updating author:", error);
      throw error;
    }
  };

  return { updateAuthor };
}

/**
 * Hook to delete author
 * @returns {Object} - Contains deleteAuthor function
 */
export function useDeleteAuthor() {
  const deleteAuthor = async (id) => {
    try {
      await del(`${AUTHORS_API_BASE_PATH}/${id}`);
      // Optionally revalidate authors list after deletion
      // mutate(AUTHORS_API_BASE_PATH);
    } catch (error) {
      console.error("Error deleting author:", error);
      throw error;
    }
  };

  return { deleteAuthor };
}