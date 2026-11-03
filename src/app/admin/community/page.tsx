"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { useI18n } from "@/components/providers/LanguageProvider";
import { CommunityFeed } from "@/features/community/CommunityFeed";
import { CreatePostDialog } from "@/features/community/CreatePostDialog";
import { Users, Shield, Flame, UserCheck, Image, Home, Smile } from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

export default function CommunityPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [composerOpen, setComposerOpen] = useState(false);

  // Suggested members / Active members simulated data
  const suggestedMembers = [
    { name: "Trần Thanh Sơn", role: "Chủ chuỗi căn hộ đà nẵng", avatar: "", color: "from-pink-500 to-rose-600" },
    { name: "Nguyễn Minh Anh", role: "Quản lý Homestay Nha Trang", avatar: "", color: "from-amber-500 to-orange-600" },
    { name: "Lê Hoàng Long", role: "Chủ nhà trọ Quận 7, HCM", avatar: "", color: "from-emerald-500 to-teal-600" },
  ];

  // Hot topics / Trending tags
  const trendingTopics = [
    { tag: "#KinhNghiemKinhDoanh", posts: "42 bài viết", label: "Hot" },
    { tag: "#ChoThuePhongTro", posts: "28 bài viết", label: "New" },
    { tag: "#ThietKeNoiThat", posts: "19 bài viết", label: "" },
    { tag: "#HopDongThueNha", posts: "15 bài viết", label: "" },
  ];

  return (
    <AppLayout>
      <div className="flex-1 space-y-6 max-w-7xl mx-auto px-4 md:px-0">
        {/* Page Header - Sleek Tech Giant Style Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 md:p-10 shadow-2xl border border-white/5">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
          
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg">
                <Users className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-indigo-200">
                  {t("community.title")}
                </h2>
                <p className="text-sm text-gray-300 mt-1.5 max-w-xl leading-relaxed">
                  {t("community.description") || "Kết nối với những chủ hộ khác, đăng tin cho thuê hoặc thảo luận."}
                </p>
              </div>
            </div>
            
            <div className="shrink-0">
              <CreatePostDialog 
                open={composerOpen} 
                onOpenChange={setComposerOpen} 
              />
            </div>
          </div>
        </div>

        {/* Main Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Feed & Composer (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Facebook-style Interactive Composer Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-gray-100">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold">
                    {user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => setComposerOpen(true)}
                  className="flex-1 text-left px-5 py-3 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-100 text-gray-400 hover:text-gray-500 text-sm transition-all duration-200 focus:outline-none"
                >
                  {user?.name ? `${user.name} ơi, bạn đang nghĩ gì thế?` : "Bạn đang nghĩ gì thế? Chia sẻ ngay..."}
                </button>
              </div>
              
              <div className="border-t border-gray-50 pt-3 flex items-center justify-around gap-2 text-gray-500 text-xs font-semibold">
                <button 
                  onClick={() => setComposerOpen(true)}
                  className="flex items-center gap-2 hover:bg-gray-50 px-4 py-2.5 rounded-xl transition-all duration-200 text-emerald-600 hover:text-emerald-700"
                >
                  <Home className="h-4 w-4" />
                  <span>Phòng trống</span>
                </button>
                <button 
                  onClick={() => setComposerOpen(true)}
                  className="flex items-center gap-2 hover:bg-gray-50 px-4 py-2.5 rounded-xl transition-all duration-200 text-blue-600 hover:text-blue-700"
                >
                  <Image className="h-4 w-4" />
                  <span>Hình ảnh</span>
                </button>
                <button 
                  onClick={() => setComposerOpen(true)}
                  className="flex items-center gap-2 hover:bg-gray-50 px-4 py-2.5 rounded-xl transition-all duration-200 text-amber-500 hover:text-amber-600"
                >
                  <Smile className="h-4 w-4" />
                  <span>Cảm xúc</span>
                </button>
              </div>
            </div>

            {/* Post Feed */}
            <CommunityFeed />
          </div>

          {/* Right Column: Sticky Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* Guidelines Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-4">
                <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm">Tiêu chuẩn cộng đồng</h3>
              </div>
              <ul className="space-y-3 text-xs text-gray-500">
                <li className="flex gap-2 items-start">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Chia sẻ thông tin chính xác, trung thực về phòng trọ và giá cả.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Tôn trọng ý kiến đóng góp và luôn giữ văn minh khi bình luận.</span>
                </li>
                <li className="flex gap-2 items-start">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>Không đăng tin quảng cáo rác hoặc lừa đảo người dùng khác.</span>
                </li>
              </ul>
            </div>

            {/* Trending Topics Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-4">
                <div className="h-9 w-9 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                  <Flame className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm">Chủ đề thảo luận nổi bật</h3>
              </div>
              <div className="space-y-4">
                {trendingTopics.map((topic, index) => (
                  <div key={index} className="flex justify-between items-center group cursor-pointer">
                    <div>
                      <span className="text-xs font-semibold text-gray-800 group-hover:text-blue-600 transition-colors block">
                        {topic.tag}
                      </span>
                      <span className="text-[10px] text-gray-400 block mt-0.5">{topic.posts}</span>
                    </div>
                    {topic.label && (
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        topic.label === "Hot" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                      }`}>
                        {topic.label}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Active Landlords Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-4">
                <div className="h-9 w-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <UserCheck className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm">Chủ hộ tích cực</h3>
              </div>
              <div className="space-y-4">
                {suggestedMembers.map((member, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className={`bg-gradient-to-br ${member.color} text-white text-xs font-semibold`}>
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold text-gray-900 block truncate">{member.name}</span>
                      <span className="text-[10px] text-gray-400 block truncate mt-0.5">{member.role}</span>
                    </div>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
