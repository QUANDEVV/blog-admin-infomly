import useSWR from 'swr';
import { fetcher, get, post, put, del } from '@/lib/apiClient';

const POSTS_API_BASE_PATH = '/admin/articles'; // Adjust this to your actual backend API path for posts

export function usePosts() {
  const { data, error, isLoading, mutate } = useSWR(POSTS_API_BASE_PATH, fetcher);

  return {
    posts: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function usePost(id) {
  const { data, error, isLoading, mutate } = useSWR(id ? `${POSTS_API_BASE_PATH}/${id}` : null, fetcher);

  return {
    post: data,
    isLoading,
    isError: error,
    mutate,
  };
}

////

export function useCreatePost() {
  const createPost = async (postInput) => {
    try {
      const newPost = await post(POSTS_API_BASE_PATH, postInput);
      // Optionally revalidate all posts after creation
      // mutate(POSTS_API_BASE_PATH);
      return newPost;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  };
  return { createPost };
}

export function useUpdatePost() {
  const updatePost = async (id, postInput) => {
    try {
      const updatedPost = await put(`${POSTS_API_BASE_PATH}/${id}`, postInput);
      // Optionally revalidate the specific post or all posts after update
      // mutate(`${POSTS_API_BASE_PATH}/${id}`);
      return updatedPost;
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  };
  return { updatePost };
}

export function useDeletePost() {
  const deletePost = async (id) => {
    try {
      await del(`${POSTS_API_BASE_PATH}/${id}`);
      // Optionally revalidate all posts after deletion
      // mutate(POSTS_API_BASE_PATH);
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  };
  return { deletePost };
}
