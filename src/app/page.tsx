import { Metadata } from "next";
import { LandingPageContent } from "@/components/landing/LandingPageContent";

export const metadata: Metadata = {
  title: "HypStay - Nền tảng Quản lý Cư trú & Cộng đồng Thông minh",
  description: "Giải pháp công nghệ 4.0 giúp xây dựng cộng đồng gắn kết và tự động hóa vận hành cho nhà trọ, homestay, căn hộ và không gian sống chia sẻ.",
  keywords: "quản lý cư trú, cộng đồng nhà trọ, quản lý homestay, quản lý căn hộ, HypStay, quản lý cư dân",
  openGraph: {
    title: "HypStay - Quản lý Cư trú & Kết nối Cộng đồng",
    description: "Hệ sinh thái cư trú đầu tiên tập trung vào trải nghiệm cộng đồng và vận hành thông minh.",
    type: "website",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://hypstay.com",
    images: [
      {
        url: "/hero_property_management_1777278500733.png",
        width: 1200,
        height: 630,
        alt: "HypStay Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HypStay - Quản lý Lưu trú Chuyên nghiệp",
    description: "Tiết kiệm 80% thời gian vận hành cho chủ cơ sở lưu trú.",
    images: ["/hero_property_management_1777278500733.png"],
  },
};

export default function Page() {
  return <LandingPageContent />;
}
