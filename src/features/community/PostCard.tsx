"use client";

import { useState } from "react";
import { CommunityPost, CommunityComment } from "@/lib/api/types";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { MapPin, Tag, MessageCircle, Heart, MoreHorizontal, Send, Trash2, CornerDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { communityApi } from "@/lib/api/community";
import { SharePostDialog } from "./SharePostDialog";

export function PostCard({ post }: { post: CommunityPost }) {
  const { t, language } = useI18n();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const locale = language === "vi" ? vi : enUS;

  // Collapsible Comments Section
  const [showComments, setShowComments] = useState(false);
  
  // State to track which comment is currently being replied to
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  
  // Inputs for main comment and replies
  const [newCommentText, setNewCommentText] = useState("");
  const [replyText, setReplyText] = useState("");

  // Query: Get Like Status and Count
  const { data: likeData } = useQuery({
    queryKey: ["post-like", post.id],
    queryFn: () => communityApi.getLikeStatus(post.id),
  });

  const liked = likeData?.liked || false;
  const likeCount = likeData?.count || 0;

  // Query: Get Comments
  const { data: comments = [] } = useQuery({
    queryKey: ["post-comments", post.id],
    queryFn: () => communityApi.getComments(post.id),
  });

  // Mutation: Toggle Like
  const toggleLikeMutation = useMutation({
    mutationFn: () => communityApi.toggleLike(post.id),
    onSuccess: (data) => {
      queryClient.setQueryData(["post-like", post.id], data);
      if (data.liked) {
        toast.success("Đã thích bài viết!");
      }
    },
  });

  // Mutation: Create Comment
  const createCommentMutation = useMutation({
    mutationFn: (data: { content: string; parentId?: string }) => 
      communityApi.createComment(post.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-comments", post.id] });
      setNewCommentText("");
      setReplyText("");
      setReplyingToId(null);
      toast.success("Đăng bình luận thành công!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Không thể gửi bình luận");
    },
  });

  // Mutation: Delete Comment
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: string) => communityApi.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-comments", post.id] });
      toast.success("Đã xóa bình luận!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Không thể xóa bình luận");
    },
  });

  const handleLike = () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thích bài viết");
      return;
    }
    toggleLikeMutation.mutate();
  };



  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    createCommentMutation.mutate({ content: newCommentText.trim() });
  };

  const handleAddReply = (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    createCommentMutation.mutate({ content: replyText.trim(), parentId });
  };

  const typeConfig = {
    Rental: {
      label: t("community.typeRental"),
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      dot: "bg-blue-500",
    },
    Discussion: {
      label: t("community.typeDiscussion"),
      bg: "bg-violet-50",
      text: "text-violet-700",
      border: "border-violet-200",
      dot: "bg-violet-500",
    },
    Finding: {
      label: t("community.typeFinding"),
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      dot: "bg-amber-500",
    },
  };

  const config = typeConfig[post.type];

  return (
    <article id={`post-${post.id}`} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
      {/* Header */}
      <div className="flex items-start gap-3 p-5 pb-3">
        <Avatar className="h-11 w-11 ring-2 ring-gray-100 shadow-sm">
          <AvatarImage src={post.author?.avatar} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold">
            {post.author?.fullName?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-900">
              {post.author?.fullName || "User"}
            </span>
            {post.organization?.name && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
                {post.organization.name}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-400 mt-0.5">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`${config.bg} ${config.text} ${config.border} text-[11px] font-medium px-2.5 py-0.5 rounded-full`}
          >
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${config.dot} mr-1.5`} />
            {config.label}
          </Badge>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-4 space-y-2.5">
        <h3 className="text-base font-bold text-gray-900 leading-snug">{post.title}</h3>
        <p className="text-sm text-gray-600 whitespace-pre-wrap line-clamp-4 leading-relaxed">
          {post.content}
        </p>

        {/* Meta tags */}
        {(post.price || post.address) && (
          <div className="flex flex-wrap gap-2 pt-1">
            {post.price && (
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg">
                <Tag className="h-3.5 w-3.5" />
                {new Intl.NumberFormat(language === "vi" ? "vi-VN" : "en-US", {
                  style: "currency",
                  currency: language === "vi" ? "VND" : "USD",
                }).format(post.price)}
              </div>
            )}
            {post.address && (
              <div className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg max-w-full">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                <span className="truncate">{post.address}</span>
              </div>
            )}
          </div>
        )}

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <div className="grid grid-cols-2 gap-1.5 mt-3 rounded-xl overflow-hidden">
            {post.images.slice(0, 2).map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Post image"
                className="aspect-video object-cover w-full hover:scale-105 transition-transform duration-300"
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer / Actions */}
      <div className="px-5 py-2 border-t border-gray-50 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={toggleLikeMutation.isPending}
            className={`h-9 gap-1.5 rounded-full px-3 transition-colors ${
              liked ? "text-rose-600 bg-rose-50 hover:bg-rose-100" : "text-gray-400 hover:text-rose-500 hover:bg-rose-50"
            }`}
          >
            <Heart className={`h-[18px] w-[18px] ${liked ? "fill-rose-600 text-rose-600" : ""}`} />
            <span className="text-xs font-semibold">{likeCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className={`h-9 gap-1.5 rounded-full px-3 transition-colors ${
              showComments ? "text-blue-600 bg-blue-50" : "text-gray-400 hover:text-blue-500 hover:bg-blue-50"
            }`}
          >
            <MessageCircle className="h-[18px] w-[18px]" />
            <span className="text-xs font-semibold">{comments.length}</span>
          </Button>
        </div>
        <SharePostDialog postId={post.id} postTitle={post.title} />
      </div>

      {/* Comment Section (Collapsible) */}
      {showComments && (
        <div className="border-t border-gray-50 bg-gray-50/30 p-4 space-y-4">
          {/* Write comment */}
          <form onSubmit={handleAddComment} className="flex gap-2 items-center">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-semibold">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <Input
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Viết bình luận..."
              disabled={createCommentMutation.isPending}
              className="flex-1 h-9 bg-white text-xs text-gray-900 border-gray-200 placeholder:text-gray-400 rounded-full px-4 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={createCommentMutation.isPending}
              className="h-9 w-9 bg-blue-600 hover:bg-blue-500 text-white rounded-full shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>

          {/* Comment list */}
          <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
            {comments.map((comment) => {
              // DEBUG comment author payload to confirm keys returned by API
              console.log("DEBUG COMMENT DATA:", comment);
              const parentAuthorName = (comment.author as any)?.fullName || (comment.author as any)?.name || (comment.author as any)?.hoTen || "Người dùng";

              return (
                <div key={comment.id} className="space-y-2">
                  {/* Parent Comment (Level 1) */}
                  <div className="flex gap-2 items-start text-xs group/comment">
                    <Avatar className="h-7 w-7 mt-0.5">
                      <AvatarFallback className="bg-gray-200 text-gray-600 text-[10px] font-semibold">
                        {parentAuthorName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-3.5 py-2.5 relative">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">{parentAuthorName}</span>
                        <span className="text-[10px] text-gray-400">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale })}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-1 leading-relaxed">{comment.content}</p>
                      
                      {/* Actions on parent comment */}
                      <div className="flex items-center gap-3 mt-2 text-[10px] font-medium text-gray-400">
                        <button 
                          onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                          className="hover:text-blue-500 transition-colors"
                        >
                          Phản hồi
                        </button>
                      </div>

                      {/* Delete button (Level 1) */}
                      {user && user.id === comment.authorId && (
                        <button 
                          onClick={() => deleteCommentMutation.mutate(comment.id)}
                          disabled={deleteCommentMutation.isPending}
                          className="absolute right-3 bottom-2.5 text-gray-400 hover:text-rose-500 opacity-0 group-hover/comment:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Replies Container (Level 2) */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="pl-9 space-y-3">
                      {comment.replies.map((reply) => {
                        const replyAuthorName = (reply.author as any)?.fullName || (reply.author as any)?.name || (reply.author as any)?.hoTen || "Người dùng";

                        return (
                          <div key={reply.id} className="flex gap-2 items-start text-xs group/reply">
                            <CornerDownRight className="h-4 w-4 text-gray-300 mt-1 shrink-0" />
                            <Avatar className="h-6 w-6 mt-0.5">
                              <AvatarFallback className="bg-gray-200 text-gray-600 text-[9px] font-semibold">
                                {replyAuthorName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 bg-white border border-gray-100 rounded-2xl px-3.5 py-2.5 relative">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-900">{replyAuthorName}</span>
                                <span className="text-[10px] text-gray-400">
                                  {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true, locale })}
                                </span>
                              </div>
                              <p className="text-gray-700 mt-1 leading-relaxed">{reply.content}</p>

                              {/* Delete button (Level 2) */}
                              {user && user.id === reply.authorId && (
                                <button 
                                  onClick={() => deleteCommentMutation.mutate(reply.id)}
                                  disabled={deleteCommentMutation.isPending}
                                  className="absolute right-3 bottom-2.5 text-gray-400 hover:text-rose-500 opacity-0 group-hover/reply:opacity-100 transition-opacity"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Reply Form (Indented under parent) */}
                  {replyingToId === comment.id && (
                    <form 
                      onSubmit={(e) => handleAddReply(e, comment.id)} 
                      className="pl-9 flex gap-2 items-center"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-blue-50 text-blue-600 text-[10px] font-semibold">
                          {user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <Input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`Phản hồi ${parentAuthorName}...`}
                        disabled={createCommentMutation.isPending}
                        className="flex-1 h-8 bg-white text-xs text-gray-900 border-gray-200 placeholder:text-gray-400 rounded-full px-4 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <Button 
                        type="submit" 
                        size="sm"
                        disabled={createCommentMutation.isPending}
                        className="h-8 bg-blue-600 hover:bg-blue-500 text-white rounded-full shrink-0 px-3 text-xs"
                      >
                        Phản hồi
                      </Button>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
}
