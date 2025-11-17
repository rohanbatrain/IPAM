import apiClient from './client';

export interface Comment {
  comment_id: string;
  resource_type: 'region' | 'host';
  resource_id: string;
  user_id: string;
  username: string;
  comment_text: string;
  created_at: string;
  updated_at?: string;
}

export interface CommentCreateRequest {
  comment_text: string;
}

export const commentsApi = {
  // Region comments
  listRegionComments: async (regionId: string): Promise<Comment[]> => {
    const response = await apiClient.get(`/ipam/regions/${regionId}/comments`);
    return response.data;
  },

  addRegionComment: async (
    regionId: string,
    data: CommentCreateRequest
  ): Promise<Comment> => {
    const response = await apiClient.post(
      `/ipam/regions/${regionId}/comments`,
      null,
      { params: data }
    );
    return response.data;
  },

  // Host comments
  listHostComments: async (hostId: string): Promise<Comment[]> => {
    const response = await apiClient.get(`/ipam/hosts/${hostId}/comments`);
    return response.data;
  },

  addHostComment: async (
    hostId: string,
    data: CommentCreateRequest
  ): Promise<Comment> => {
    const response = await apiClient.post(
      `/ipam/hosts/${hostId}/comments`,
      null,
      { params: data }
    );
    return response.data;
  },

  // Generic comment operations
  updateComment: async (
    commentId: string,
    data: CommentCreateRequest
  ): Promise<Comment> => {
    const response = await apiClient.patch(
      `/ipam/comments/${commentId}`,
      null,
      { params: data }
    );
    return response.data;
  },

  deleteComment: async (commentId: string): Promise<void> => {
    await apiClient.delete(`/ipam/comments/${commentId}`);
  },
};
