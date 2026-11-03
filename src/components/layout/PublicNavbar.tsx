"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/AuthContext";
import { Globe, LogIn, LayoutDashboard } from "lucide-react";

export function PublicNavbar() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand logo */}
        <Link href="/community" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform duration-300">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <span className="font-heading text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            HypStay <span className="text-xs text-blue-500 font-semibold ml-1">Community</span>
          </span>
        </Link>

        {/* Action button */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link href="/admin/dashboard">
              <Button size="sm" variant="outline" className="gap-2 border-gray-200 hover:bg-gray-50 rounded-full text-xs font-semibold px-4">
                <LayoutDashboard className="h-3.5 w-3.5 text-blue-500" />
                Quản trị
              </Button>
            </Link>
          ) : (
            <Link href="/admin/login">
              <Button size="sm" className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full text-xs font-semibold px-4 shadow-md shadow-blue-500/10">
                <LogIn className="h-3.5 w-3.5" />
                Đăng nhập
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
