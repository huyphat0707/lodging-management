"use client";

import { useRouter } from "next/navigation";
import { Bell, Menu, Search, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/components/providers/LanguageProvider";
import { useAuth } from "@/components/providers/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

export function Header({ onOpenMobileMenu }: { onOpenMobileMenu: () => void }) {
  const { language, setLanguage, t } = useI18n();
  const { user, logout } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const changeLanguage = (lang: "en" | "vi") => {
    setLanguage(lang);
    queryClient.invalidateQueries();
  };

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onOpenMobileMenu}
      >
        <Menu className="h-4 w-4" />
        <span className="sr-only">{t("app.openMenu")}</span>
      </Button>
      <div className="flex flex-1 items-center gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("app.searchPlaceholder")}
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant={language === "en" ? "default" : "ghost"}
          size="icon"
          onClick={() => changeLanguage("en")}
          aria-label="Switch to English"
          title="English"
        >
          🇬🇧
        </Button>
        <Button
          variant={language === "vi" ? "default" : "ghost"}
          size="icon"
          onClick={() => changeLanguage("vi")}
          aria-label="Chuyen sang tieng Viet"
          title="Tieng Viet"
        >
          🇻🇳
        </Button>
      </div>
      <Button variant="ghost" size="icon" className="rounded-full">
        <Bell className="h-4 w-4" />
        <span className="sr-only">{t("app.notifications")}</span>
      </Button>
      
      {/* User Profile Dropdown */}
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all">
                {(user?.name?.[0] || user?.email?.[0] || "U").toUpperCase()}
              </div>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem disabled>{t("auth.role")}: {user.role}</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              {t("auth.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  );
}
