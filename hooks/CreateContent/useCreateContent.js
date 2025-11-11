import useSWR from 'swr';
import { fetcher, get, post, put, del } from '@/lib/apiClient';

const CONTENTS_API_BASE_PATH = '/admin/contents'; // Backend API path for content management

/**
 * Hook to fetch all contents for admin management
 * @param {string} queryParams - Optional query parameters for filtering/sorting
 * @returns {Object} - Contains contents array, loading state, error state, and mutate function
 */
export function useContents(queryParams = '') {
  const url = queryParams ? `${CONTENTS_API_BASE_PATH}?${queryParams}` : CONTENTS_API_BASE_PATH;
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    contents: data,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to fetch a specific content by ID
 * @param {number} id - Content ID
 * @returns {Object} - Contains content object, loading state, error state, and mutate function
 */
export function useContent(id) {
  const { data, error, isLoading, mutate } = useSWR(id ? `${CONTENTS_API_BASE_PATH}/${id}` : null, fetcher);

  return {
    content: data,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to create new content
 * @returns {Object} - Contains createContent function
 */
export function useCreateContent() {
  const createContent = async (contentInput) => {
    try {
      const newContent = await post(CONTENTS_API_BASE_PATH, contentInput);
      // Optionally revalidate contents list after creation
      // mutate(CONTENTS_API_BASE_PATH);
      return newContent;
    } catch (error) {
      console.error("Error creating content:", error);
      throw error;
    }
  };

  return { createContent };
}

/**
 * Hook to update existing content
 * @returns {Object} - Contains updateContent function
 */
export function useUpdateContent() {
  const updateContent = async (id, contentInput) => {
    try {
      const updatedContent = await put(`${CONTENTS_API_BASE_PATH}/${id}`, contentInput);
      // Optionally revalidate the specific content or all contents after update
      // mutate(`${CONTENTS_API_BASE_PATH}/${id}`);
      return updatedContent;
    } catch (error) {
      console.error("Error updating content:", error);
      throw error;
    }
  };

  return { updateContent };
}

/**
 * Hook to delete content
 * @returns {Object} - Contains deleteContent function
 */
export function useDeleteContent() {
  const deleteContent = async (id) => {
    try {
      await del(`${CONTENTS_API_BASE_PATH}/${id}`);
      // Optionally revalidate contents list after deletion
      // mutate(CONTENTS_API_BASE_PATH);
    } catch (error) {
      console.error("Error deleting content:", error);
      throw error;
    }
  };

  return { deleteContent };
}