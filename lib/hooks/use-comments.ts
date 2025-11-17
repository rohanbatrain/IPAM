import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsApi, type CommentCreateRequest } from '@/lib/api/comments';
import { toast } from 'sonner';

export function useRegionComments(regionId: string) {
  return useQuery({
    queryKey: ['comments', 'region', regionId],
    queryFn: () => commentsApi.listRegionComments(regionId),
    enabled: !!regionId,
  });
}

export function useHostComments(hostId: string) {
  return useQuery({
    queryKey: ['comments', 'host', hostId],
    queryFn: () => commentsApi.listHostComments(hostId),
    enabled: !!hostId,
  });
}

export function useAddRegionComment(regionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CommentCreateRequest) =>
      commentsApi.addRegionComment(regionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments', 'region', regionId],
      });
      toast.success('Comment added successfully');
    },
    onError: () => {
      toast.error('Failed to add comment');
    },
  });
}

export function useAddHostComment(hostId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CommentCreateRequest) =>
      commentsApi.addHostComment(hostId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments', 'host', hostId],
      });
      toast.success('Comment added successfully');
    },
    onError: () => {
      toast.error('Failed to add comment');
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      data,
    }: {
      commentId: string;
      data: CommentCreateRequest;
    }) => commentsApi.updateComment(commentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      toast.success('Comment updated successfully');
    },
    onError: () => {
      toast.error('Failed to update comment');
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => commentsApi.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      toast.success('Comment deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete comment');
    },
  });
}
