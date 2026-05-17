"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Home,
  FileText,
  CreditCard,
  Settings,
  BarChart,
  Building2,
  ClipboardList,
  CalendarDays,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/providers/LanguageProvider";
import { usePropertyContext } from "@/components/providers/PropertyContext";
import { PropertySelector } from "./PropertySelector";
import { useAuth } from "@/components/providers/AuthContext";

const allSidebarLinks = [
  { key: "nav.dashboard", href: "/admin/dashboard", icon: LayoutDashboard, show: ["Boarding", "Hotel", "Homestay"] },
  { key: "nav.community", href: "/admin/community", icon: Globe, show: ["Boarding", "Hotel", "Homestay"] },
  { key: "nav.properties", href: "/admin/properties", icon: Building2, show: ["Boarding", "Hotel", "Homestay"] },
  { key: "nav.rooms", href: "/admin/rooms", icon: Home, show: ["Boarding", "Hotel", "Homestay"] },
  { key: "nav.bookings", href: "/admin/bookings", icon: CalendarDays, show: ["Hotel", "Homestay"] },
  { key: "nav.tenants", href: "/admin/tenants", icon: Users, show: ["Boarding", "Homestay", "Hotel"] },
  { key: "nav.users", href: "/admin/users", icon: Users, show: ["Boarding", "Hotel", "Homestay"], roles: ["super_admin"] },
  { key: "nav.tasks", href: "/admin/tasks", icon: ClipboardList, show: ["Hotel", "Homestay"] },
  { key: "nav.contracts", href: "/admin/contracts", icon: FileText, show: ["Boarding", "Homestay"] },
  { key: "nav.billing", href: "/admin/billing", icon: CreditCard, show: ["Boarding", "Hotel", "Homestay"] },
  { key: "nav.reports", href: "/admin/reports", icon: BarChart, show: ["Boarding", "Hotel", "Homestay"], roles: ["admin", "super_admin"] },
  { key: "nav.settings", href: "/admin/settings", icon: Settings, show: ["Boarding", "Hotel", "Homestay"], roles: ["admin", "super_admin"] },
];

import { DonateDialog } from "../shared/DonateDialog";

import Image from "next/image";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { t } = useI18n();
  const { selectedPropertyType } = usePropertyContext();
  const { user } = useAuth();

  const filteredLinks = allSidebarLinks.filter(link => {
    const matchesProperty = link.show.includes(selectedPropertyType);
    const matchesRole = !link.roles || (user?.role && link.roles.includes(user.role as any));

    return matchesProperty && matchesRole;
  });

  return (
    <aside className="h-full w-64 border-r border-white/10 bg-[#0F172A] text-zinc-100 flex flex-col">
      <div className="flex h-16 items-center border-b border-white/10 px-6 shrink-0 gap-3">
        <div className="relative h-8 w-8 overflow-hidden rounded-md">
          <Image
            src="/icon.png"
            alt="HypStay Logo"
            fill
            className="object-contain"
          />
        </div>
        <span className="text-xl font-bold tracking-tight">HypStay</span>
      </div>
      <PropertySelector />
      <div className="flex-1 overflow-y-auto">
        <nav className="space-y-1 px-3 py-4">
          {filteredLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.key}
                href={link.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-zinc-800 hover:text-white",
                  pathname === link.href
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400"
                )}
              >
                <Icon className="h-4 w-4" />
                {t(link.key)}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-white/10">
        <DonateDialog />
      </div>
    </aside>
  );
}
