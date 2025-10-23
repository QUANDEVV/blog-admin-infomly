import useSWR from 'swr';
import { fetcher, get, post, put, del } from '@/lib/apiClient';

const CATEGORIES_API_BASE_PATH = '/admin/categories'; // API base path for categories in the admin panel

/**
 * Hook to fetch all categories.
 * Returns an object with categories data, loading state, error state, and mutate function.
 */
export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR(CATEGORIES_API_BASE_PATH, fetcher);

  return {
    categories: data?.categories || [],
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to fetch a single category by ID.
 * Takes an ID parameter; if null, doesn't fetch.
 * Returns an object with category data, loading state, error state, and mutate function.
 */
export function useCategory(id) {
  const { data, error, isLoading, mutate } = useSWR(id ? `${CATEGORIES_API_BASE_PATH}/${id}` : null, fetcher);

  return {
    category: data,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Hook to create a new category.
 * Returns an object with createCategory function that takes categoryInput and posts to API.
 */
export function useCreateCategory() {
  const createCategory = async (categoryInput) => {
    try {
      const newCategory = await post(CATEGORIES_API_BASE_PATH, categoryInput);
      // Optionally revalidate all categories after creation
      // mutate(CATEGORIES_API_BASE_PATH);
      return newCategory;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  };
  return { createCategory };
}

/**
 * Hook to update an existing category.
 * Returns an object with updateCategory function that takes ID and categoryInput, puts to API.
 */
export function useUpdateCategory() {
  const updateCategory = async (id, categoryInput) => {
    try {
      const updatedCategory = await put(`${CATEGORIES_API_BASE_PATH}/${id}`, categoryInput);
      // Optionally revalidate the specific category or all categories after update
      // mutate(`${CATEGORIES_API_BASE_PATH}/${id}`);
      return updatedCategory;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  };
  return { updateCategory };
}

/**
 * Hook to delete a category.
 * Returns an object with deleteCategory function that takes ID and deletes from API.
 */
export function useDeleteCategory() {
  const deleteCategory = async (id) => {
    try {
      await del(`${CATEGORIES_API_BASE_PATH}/${id}`);
      // Optionally revalidate all categories after deletion
      // mutate(CATEGORIES_API_BASE_PATH);
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  };
  return { deleteCategory };
}