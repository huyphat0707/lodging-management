"use client";

import Image from "next/image";
import {
  Bell,
  CalendarDays,
  FileText,
  Home,
  LayoutDashboard,
  ReceiptText,
  User,
  Users,
  Wallet,
  BarChart3,
} from "lucide-react";
import { useI18n } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

const ROOM_STATUS = [
  { key: "home.mock.occupied", value: 70, color: "#16a34a" },
  { key: "home.mock.vacant", value: 20, color: "#86efac" },
  { key: "home.mock.expiring", value: 10, color: "#facc15" },
];

const REVENUE_POINTS = [18, 34, 28, 52, 44, 70, 62, 88];
const MONTHLY_BARS = [30, 45, 38, 62, 55, 80];

export function BrandLogo({ className, textClassName }: { className?: string; textClassName?: string }) {
  return (
    <span className={cn("flex items-center gap-1.5", className)}>
      <Home className="h-[1.25em] w-[1.25em] text-green-700" strokeWidth={2.5} />
      <span className={cn("font-bold tracking-tight text-slate-900", textClassName)}>HypStay</span>
    </span>
  );
}

export function DonutChart({ className }: { className?: string }) {
  const radius = 15.9155;
  let offset = 25;
  return (
    <svg viewBox="0 0 42 42" className={className} aria-hidden>
      <circle cx="21" cy="21" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="7" />
      {ROOM_STATUS.map((s) => {
        const el = (
          <circle
            key={s.key}
            cx="21"
            cy="21"
            r={radius}
            fill="none"
            stroke={s.color}
            strokeWidth="7"
            strokeDasharray={`${s.value} ${100 - s.value}`}
            strokeDashoffset={offset}
          />
        );
        offset -= s.value;
        return el;
      })}
    </svg>
  );
}

export function RevenueChart({ className }: { className?: string }) {
  const { t } = useI18n();
  const w = 200;
  const h = 80;
  const step = w / (REVENUE_POINTS.length - 1);
  const pts = REVENUE_POINTS.map((v, i) => [i * step, h - (v / 100) * h] as const);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

  return (
    <div className={className}>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full overflow-visible" preserveAspectRatio="none" aria-hidden>
        <defs>
          <linearGradient id="revenue-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${line} L${w},${h} L0,${h} Z`} fill="url(#revenue-fill)" />
        <path d={line} fill="none" stroke="#16a34a" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-1 flex justify-between text-[0.55em] text-slate-400">
        {Array.from({ length: 6 }, (_, i) => (
          <span key={i}>{t("home.mock.monthPrefix")}{i + 1}</span>
        ))}
      </div>
    </div>
  );
}

function StatusLegend() {
  const { t } = useI18n();
  return (
    <ul className="space-y-1.5 text-[0.6em] text-slate-600">
      {ROOM_STATUS.map((s) => (
        <li key={s.key} className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
          {t(s.key)}
        </li>
      ))}
    </ul>
  );
}

/** Desktop dashboard preview, scaled with the font-size of its container. */
export function DashboardMockup({ className }: { className?: string }) {
  const { t } = useI18n();

  const nav = [
    { icon: LayoutDashboard, label: t("home.mock.overview"), active: true },
    { icon: Home, label: t("home.mock.properties") },
    { icon: User, label: t("home.mock.tenants") },
    { icon: FileText, label: t("home.mock.contracts") },
    { icon: ReceiptText, label: t("home.mock.invoices") },
    { icon: Wallet, label: t("home.mock.cashflow") },
    { icon: BarChart3, label: t("home.mock.reports") },
  ];

  return (
    <div className={cn("flex overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl shadow-green-900/10", className)}>
      <aside className="w-[24%] shrink-0 border-r border-slate-100 bg-slate-50/60 p-[0.9em]">
        <BrandLogo className="mb-[1.2em] text-[0.85em]" />
        <ul className="space-y-[0.35em]">
          {nav.map((item) => (
            <li
              key={item.label}
              className={cn(
                "flex items-center gap-[0.5em] rounded-md px-[0.5em] py-[0.4em] text-[0.6em] text-slate-600",
                item.active && "bg-green-100 font-semibold text-green-800"
              )}
            >
              <item.icon className="h-[1.2em] w-[1.2em] shrink-0" />
              <span className="truncate">{item.label}</span>
            </li>
          ))}
        </ul>
      </aside>

      <div className="min-w-0 flex-1 p-[0.9em]">
        <div className="mb-[0.8em] flex items-center justify-end gap-[0.8em]">
          <Bell className="h-[0.9em] w-[0.9em] text-slate-400" />
          <Image src="/icon.png" alt="" width={24} height={24} className="h-[1.4em] w-[1.4em] rounded-full border border-slate-200" />
        </div>

        <div className="grid grid-cols-3 gap-[0.6em]">
          <StatCard icon={Home} label={t("home.mock.properties")} value="12" />
          <StatCard icon={Users} label={t("home.mock.tenants")} value="24" />
          <StatCard icon={ReceiptText} label={t("home.mock.invoices")} hint={t("home.mock.thisMonth")} trailing={CalendarDays} />
        </div>

        <div className="mt-[0.6em] grid grid-cols-2 gap-[0.6em]">
          <div className="rounded-xl border border-slate-100 p-[0.7em]">
            <p className="mb-[0.6em] text-[0.62em] font-semibold text-slate-800">{t("home.mock.roomStatus")}</p>
            <div className="flex items-center gap-[0.8em]">
              <DonutChart className="h-[4.5em] w-[4.5em] shrink-0" />
              <StatusLegend />
            </div>
          </div>
          <div className="rounded-xl border border-slate-100 p-[0.7em]">
            <p className="mb-[0.6em] text-[0.62em] font-semibold text-slate-800">{t("home.mock.revenue")}</p>
            <RevenueChart className="h-[4.5em] text-[1em]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  trailing: Trailing,
}: {
  icon: typeof Home;
  label: string;
  value?: string;
  hint?: string;
  trailing?: typeof Home;
}) {
  return (
    <div className="relative rounded-xl border border-slate-100 p-[0.7em]">
      <Icon className="mb-[0.5em] h-[1.3em] w-[1.3em] text-green-700" />
      <p className="truncate text-[0.6em] text-slate-600">{label}</p>
      {value && <p className="text-[0.85em] font-bold text-slate-900">{value}</p>}
      {hint && <p className="text-[0.55em] text-slate-400">{hint}</p>}
      {Trailing && <Trailing className="absolute right-[0.7em] top-1/2 h-[0.9em] w-[0.9em] text-green-600" />}
    </div>
  );
}

/** Mobile app preview used alongside the laptop mockup. */
export function PhoneMockup({ className }: { className?: string }) {
  const { t } = useI18n();

  return (
    <div className={cn("rounded-[2.2em] border-[0.45em] border-slate-900 bg-white p-[0.7em] shadow-2xl shadow-slate-900/20", className)}>
      <div className="mx-auto mb-[0.8em] h-[0.5em] w-[35%] rounded-full bg-slate-900" />
      <BrandLogo className="mb-[0.8em] text-[0.8em]" />
      <div className="space-y-[0.5em]">
        {[
          { icon: Home, label: t("home.mock.properties"), value: "12" },
          { icon: Users, label: t("home.mock.tenants"), value: "24" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-[0.6em] rounded-xl border border-slate-100 p-[0.6em]">
            <item.icon className="h-[1.1em] w-[1.1em] text-green-700" />
            <div>
              <p className="text-[0.55em] text-slate-500">{item.label}</p>
              <p className="text-[0.75em] font-bold text-slate-900">{item.value}</p>
            </div>
          </div>
        ))}
        <div className="rounded-xl border border-slate-100 p-[0.6em]">
          <p className="mb-[0.6em] text-[0.58em] font-semibold text-slate-800">{t("home.mock.revenueThisMonth")}</p>
          <div className="flex h-[4.5em] items-end justify-between gap-[0.3em]">
            {MONTHLY_BARS.map((v, i) => (
              <span key={i} className="flex-1 rounded-t bg-green-500" style={{ height: `${v}%`, opacity: 0.55 + i * 0.09 }} />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-[0.8em] flex justify-around border-t border-slate-100 pt-[0.5em] text-[0.5em] text-slate-500">
        <span className="flex flex-col items-center text-green-700">
          <Home className="h-[1.6em] w-[1.6em]" />
          {t("home.mock.home")}
        </span>
        <span className="flex flex-col items-center">
          <ReceiptText className="h-[1.6em] w-[1.6em]" />
          {t("home.mock.invoices")}
        </span>
        <span className="flex flex-col items-center">
          <BarChart3 className="h-[1.6em] w-[1.6em]" />
          {t("home.mock.reports")}
        </span>
      </div>
    </div>
  );
}
