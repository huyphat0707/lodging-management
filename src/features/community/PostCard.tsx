"use client";

import { CommunityPost } from "@/lib/api/types";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { MapPin, Tag, Share2, MessageCircle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PostCard({ post }: { post: CommunityPost }) {
  const { t, language } = useI18n();

  const locale = language === "vi" ? vi : enUS;

  const typeColor = {
    Rental: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    Discussion: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    Finding: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  };

  const typeLabel = {
    Rental: t("community.typeRental"),
    Discussion: t("community.typeDiscussion"),
    Finding: t("community.typeFinding"),
  };

  return (
    <Card className="bg-[#1E293B]/50 border-white/5 overflow-hidden hover:border-white/10 transition-all duration-300">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar className="h-10 w-10 border border-white/10">
          <AvatarImage src={post.author?.avatar} />
          <AvatarFallback className="bg-zinc-800 text-xs">
            {post.author?.fullName?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-zinc-100">{post.author?.fullName || "User"}</span>
            {post.organization?.name && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-white/5">
                {post.organization.name}
              </span>
            )}
          </div>
          <span className="text-xs text-zinc-500">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale })}
          </span>
        </div>
        <Badge variant="outline" className={typeColor[post.type]}>
          {typeLabel[post.type]}
        </Badge>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 space-y-3">
        <h3 className="text-lg font-bold text-white leading-tight">{post.title}</h3>
        <p className="text-sm text-zinc-400 whitespace-pre-wrap line-clamp-4">
          {post.content}
        </p>

        {(post.price || post.address) && (
          <div className="flex flex-wrap gap-3 pt-2">
            {post.price && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">
                <Tag className="h-3 w-3" />
                {new Intl.NumberFormat(language === "vi" ? "vi-VN" : "en-US", {
                  style: "currency",
                  currency: language === "vi" ? "VND" : "USD",
                }).format(post.price)}
              </div>
            )}
            {post.address && (
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded-md max-w-full">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate">{post.address}</span>
              </div>
            )}
          </div>
        )}

        {post.images && post.images.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mt-4 rounded-xl overflow-hidden border border-white/5">
             {post.images.slice(0, 2).map((img, i) => (
               <img key={i} src={img} alt="Post image" className="aspect-video object-cover w-full" />
             ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-2 px-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10">
            <Heart className="h-4 w-4" />
            <span className="text-xs">0</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-zinc-500">
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">0</span>
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-zinc-500">
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
