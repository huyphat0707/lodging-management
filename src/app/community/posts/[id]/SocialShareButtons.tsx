"use client";

import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";
import { toast } from "sonner";

type ShareProps = {
  postId: string;
  postTitle: string;
};

export function SocialShareButtons({ postId, postTitle }: ShareProps) {
  const getShareUrl = () => `${window.location.origin}/community/posts/${postId}`;

  const shareToFacebook = () => {
    const url = encodeURIComponent(getShareUrl());
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(facebookShareUrl, "_blank", "width=600,height=400");
    toast.success("Đang mở liên kết chia sẻ Facebook...");
  };

  const copyLink = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Đã sao chép liên kết bài viết!");
    }).catch(() => {
      toast.error("Không thể sao chép liên kết.");
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        onClick={shareToFacebook}
        size="sm"
        variant="outline"
        className="text-xs font-semibold text-blue-600 border-blue-100 bg-blue-50/50 hover:bg-blue-50 rounded-full px-3.5 gap-1.5"
      >
        <svg className="h-4 w-4 fill-blue-600" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        Chia sẻ Facebook
      </Button>
      <Button
        onClick={copyLink}
        size="icon"
        variant="outline"
        className="h-9 w-9 rounded-full border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
        title="Sao chép liên kết"
      >
        <Link2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
