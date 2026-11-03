import { Metadata } from "next";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PostCard } from "@/features/community/PostCard";
import { communityApi } from "@/lib/api/community";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SocialShareButtons } from "./SocialShareButtons";

type Props = {
  params: Promise<{ id: string }>;
};

// Generate dynamic SEO metadata for social cards (Facebook Open Graph, Twitter Cards)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const post = await communityApi.getPost(resolvedParams.id);
    const excerpt = post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content;
    const ogImage = post.images && post.images.length > 0 ? post.images[0] : "/icon.png";

    return {
      title: `${post.title} | Cộng đồng HypStay`,
      description: excerpt,
      openGraph: {
        title: post.title,
        description: excerpt,
        type: "article",
        images: [
          {
            url: ogImage,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: excerpt,
        images: [ogImage],
      },
    };
  } catch (error) {
    return {
      title: "Bài đăng không tìm thấy | HypStay",
      description: "Nội dung bài viết không tồn tại hoặc đã bị gỡ bỏ.",
    };
  }
}

export default async function PublicPostDetailPage({ params }: Props) {
  const resolvedParams = await params;
  let post;
  try {
    post = await communityApi.getPost(resolvedParams.id);
  } catch (error) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      <PublicNavbar />

      <main className="flex-1 container mx-auto max-w-3xl px-4 py-8 space-y-6">
        {/* Navigation & Action Header */}
        <div className="flex items-center justify-between">
          <Link href="/community">
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900 rounded-full pl-2 pr-4 text-xs font-semibold gap-1">
              <ChevronLeft className="h-4 w-4" />
              Quay lại cộng đồng
            </Button>
          </Link>
          
          {/* Render share buttons wrapper on client-side */}
          <SocialShareButtons postId={post.id} postTitle={post.title} />
        </div>

        {/* Post Details Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <PostCard post={post} />
        </div>
      </main>
    </div>
  );
}
