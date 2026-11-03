"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Share2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

type SharePostDialogProps = {
  postId: string;
  postTitle: string;
  trigger?: React.ReactElement;
};

export function SharePostDialog({ postId, postTitle, trigger }: SharePostDialogProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/community/posts/${postId}` : "";

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      toast.success("Đã sao chép liên kết chia sẻ!");
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast.error("Không thể sao chép liên kết.");
    });
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(shareUrl);
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(fbUrl, "_blank", "width=600,height=400");
    toast.success("Đang mở chia sẻ Facebook...");
  };

  const shareToTwitter = () => {
    const url = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(postTitle);
    const twUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    window.open(twUrl, "_blank", "width=600,height=400");
    toast.success("Đang mở chia sẻ Twitter/X...");
  };

  const shareToTelegram = () => {
    const url = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(postTitle);
    const teleUrl = `https://t.me/share/url?url=${url}&text=${text}`;
    window.open(teleUrl, "_blank", "width=600,height=400");
    toast.success("Đang mở chia sẻ Telegram...");
  };

  const defaultTrigger = (
    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
      <Share2 className="h-[18px] w-[18px]" />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger ? trigger : defaultTrigger} />
      <DialogContent className="sm:max-w-md bg-white border-gray-200 text-gray-900 rounded-2xl p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900 text-center">Chia sẻ bài viết</DialogTitle>
          <DialogDescription className="text-gray-500 text-center text-xs">
            Chia sẻ bài viết này với bạn bè và các mạng xã hội của bạn.
          </DialogDescription>
        </DialogHeader>

        {/* Social Icons grid */}
        <div className="flex justify-center gap-6 py-6 border-b border-gray-100">
          {/* Facebook */}
          <button
            onClick={shareToFacebook}
            className="flex flex-col items-center gap-2 group outline-none"
          >
            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors shadow-sm">
              <svg className="h-5 w-5 fill-blue-600" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </div>
            <span className="text-[11px] font-medium text-gray-600 group-hover:text-gray-900">Facebook</span>
          </button>

          {/* Twitter / X */}
          <button
            onClick={shareToTwitter}
            className="flex flex-col items-center gap-2 group outline-none"
          >
            <div className="h-12 w-12 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gray-100 transition-colors shadow-sm">
              <svg className="h-4.5 w-4.5 fill-gray-900" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            <span className="text-[11px] font-medium text-gray-600 group-hover:text-gray-900">Twitter</span>
          </button>

          {/* Telegram */}
          <button
            onClick={shareToTelegram}
            className="flex flex-col items-center gap-2 group outline-none"
          >
            <div className="h-12 w-12 rounded-full bg-sky-50 flex items-center justify-center group-hover:bg-sky-100 transition-colors shadow-sm">
              <svg className="h-5 w-5 fill-sky-500" viewBox="0 0 24 24">
                <path d="M11.944 0C5.356 0 0 5.356 0 11.944 0 18.532 5.356 23.888 11.944 23.888 18.532 23.888 23.888 18.532 23.888 11.944 23.888 5.356 18.532 0 11.944 0zm5.827 8.219l-1.928 9.088c-.144.65-.531.809-1.078.503l-2.938-2.166-1.416 1.363c-.156.156-.288.288-.591.288l.211-2.997 5.459-4.931c.238-.212-.053-.331-.372-.119l-6.747 4.247-2.906-.909c-.631-.197-.644-.631.131-.934l11.366-4.381c.528-.194.991.122.829.951z" />
              </svg>
            </div>
            <span className="text-[11px] font-medium text-gray-600 group-hover:text-gray-900">Telegram</span>
          </button>
        </div>

        {/* Copy Link Input group */}
        <div className="flex items-center gap-2 mt-4">
          <Input
            value={shareUrl}
            readOnly
            className="flex-1 h-9 bg-gray-50 text-xs text-gray-500 border-gray-200 rounded-lg px-3 outline-none"
          />
          <Button
            onClick={handleCopy}
            size="sm"
            variant="outline"
            className="h-9 border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 gap-1.5 rounded-lg text-xs"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">Đã copy</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
