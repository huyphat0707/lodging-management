import { request } from "./shared";
import { CommunityPost } from "./types";

export type CreatePostData = {
  title: string;
  content: string;
  type: string;
  images?: string[];
  price?: number;
  address?: string;
};

export const communityApi = {
  getPosts: (filters: any = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    const queryString = params.toString();
    return request<{ data: CommunityPost[]; total: number; page: number; limit: number }>(
      `/community/posts${queryString ? `?${queryString}` : ""}`
    );
  },

  getPost: (id: string) => request<CommunityPost>(`/community/posts/${id}`),

  createPost: (data: CreatePostData) =>
    request<CommunityPost>("/community/posts", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updatePost: (id: string, data: Partial<CreatePostData>) =>
    request<CommunityPost>(`/community/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deletePost: (id: string) =>
    request<void>(`/community/posts/${id}`, {
      method: "DELETE",
    }),

  getMyPosts: () => request<CommunityPost[]>("/community/my-posts"),
};
