'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useRegionComments,
  useHostComments,
  useAddRegionComment,
  useAddHostComment,
  useDeleteComment,
} from '@/lib/hooks/use-comments';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Send, Trash2 } from 'lucide-react';
import type { Comment } from '@/lib/api/comments';

interface CommentsSectionProps {
  resourceType: 'region' | 'host';
  resourceId: string;
  currentUserId?: string;
}

export function CommentsSection({
  resourceType,
  resourceId,
  currentUserId,
}: CommentsSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Fetch comments based on resource type
  const {
    data: comments,
    isLoading,
    error,
  } = resourceType === 'region'
    ? useRegionComments(resourceId)
    : useHostComments(resourceId);

  // Add comment mutation based on resource type
  const addCommentMutation =
    resourceType === 'region'
      ? useAddRegionComment(resourceId)
      : useAddHostComment(resourceId);

  const deleteCommentMutation = useDeleteComment();

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      await addCommentMutation.mutateAsync({
        comment_text: newComment.trim(),
      });
      setNewComment('');
      setIsAdding(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await deleteCommentMutation.mutateAsync(commentId);
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive text-sm">Failed to load comments</p>
        </CardContent>
      </Card>
    );
  }

  const characterCount = newComment.length;
  const maxCharacters = 2000;
  const isOverLimit = characterCount > maxCharacters;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments
            {comments && comments.length > 0 && (
              <Badge variant="secondary">{comments.length}</Badge>
            )}
          </div>
          {!isAdding && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdding(true)}
            >
              Add Comment
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Comment Form */}
        {isAdding && (
          <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
            <Textarea
              placeholder="Write your comment here... (Markdown supported)"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <div className="flex items-center justify-between">
              <span
                className={`text-sm ${
                  isOverLimit ? 'text-destructive' : 'text-muted-foreground'
                }`}
              >
                {characterCount} / {maxCharacters} characters
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsAdding(false);
                    setNewComment('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleAddComment}
                  disabled={
                    !newComment.trim() ||
                    isOverLimit ||
                    addCommentMutation.isPending
                  }
                >
                  <Send className="h-4 w-4 mr-2" />
                  {addCommentMutation.isPending ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Comments List */}
        {comments && comments.length > 0 ? (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div
                key={comment.comment_id}
                className="p-4 border rounded-lg space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {comment.username}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                    {comment.updated_at &&
                      comment.updated_at !== comment.created_at && (
                        <Badge variant="outline" className="text-xs">
                          edited
                        </Badge>
                      )}
                  </div>
                  {currentUserId === comment.user_id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleDeleteComment(comment.comment_id)}
                      disabled={deleteCommentMutation.isPending}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <p className="text-sm whitespace-pre-wrap">
                  {comment.comment_text}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No comments yet</p>
            <p className="text-xs mt-1">Be the first to add a comment</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
