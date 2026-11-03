"use client";

import { useState, useEffect, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/wrappers/ProtectedRoute";
import { StatsCard } from "@/features/dashboard/StatsCard";
import { Users, Home, DollarSign, Activity, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/api/analytics";
import { useI18n } from "@/components/providers/LanguageProvider";
import { toast } from "sonner";

// Custom Interactive SVG Area Chart Component
function InteractiveChart({ language }: { language: string }) {
  const data = [
    { label: language === "vi" ? "Tháng 1" : "Jan", value: 4500 },
    { label: language === "vi" ? "Tháng 2" : "Feb", value: 6500 },
    { label: language === "vi" ? "Tháng 3" : "Mar", value: 5200 },
    { label: language === "vi" ? "Tháng 4" : "Apr", value: 7800 },
    { label: language === "vi" ? "Tháng 5" : "May", value: 6000 },
    { label: language === "vi" ? "Tháng 6" : "Jun", value: 8500 },
    { label: language === "vi" ? "Tháng 7" : "Jul", value: 9200 },
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // SVG dimensions
  const width = 500;
  const height = 200;
  const padding = 30;

  const maxVal = Math.max(...data.map(d => d.value)) * 1.1;
  const minVal = 0;

  // Compute points
  const points = data.map((d, i) => {
    const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
    const y = height - padding - ((d.value - minVal) * (height - 2 * padding)) / (maxVal - minVal);
    return { x, y, ...d };
  });

  // Create path strings
  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="relative w-full h-full flex flex-col justify-between p-2">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-zinc-300">
          {language === "vi" ? "Biểu đồ doanh thu 7 tháng" : "7-Month Revenue Chart"}
        </h4>
        {hoveredIndex !== null && (
          <div className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full animate-fade-in font-mono">
            {points[hoveredIndex].label}: ${points[hoveredIndex].value.toLocaleString()}
          </div>
        )}
      </div>

      <div className="flex-1 w-full relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#10b981" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = padding + ratio * (height - 2 * padding);
            return (
              <line
                key={idx}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Area under the line */}
          <path d={areaPath} fill="url(#chart-gradient)" className="transition-all duration-500" />

          {/* Glowing Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#10b981"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            className="transition-all duration-500"
          />

          {/* Data points */}
          {points.map((p, i) => (
            <g key={i}>
              {/* Invisible larger hover target circle */}
              <circle
                cx={p.x}
                cy={p.y}
                r="12"
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              {/* Visible circle */}
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === i ? "6" : "4.5"}
                fill={hoveredIndex === i ? "#ffffff" : "#10b981"}
                stroke="#10b981"
                strokeWidth="2.5"
                className="pointer-events-none transition-all duration-150"
              />
            </g>
          ))}

          {/* X axis labels */}
          {points.map((p, i) => (
            <text
              key={i}
              x={p.x}
              y={height - 8}
              textAnchor="middle"
              className="text-[9px] fill-zinc-500 font-medium"
            >
              {p.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { t, language } = useI18n();
  const [activities, setActivities] = useState<any[]>([]);

  // Automatically refetch overview statistics every 15 seconds for real-time sync
  const { data: stats, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => analyticsApi.getOverviewStats(),
    refetchInterval: 15000,
  });

  // Initialize activities when stats are loaded
  useEffect(() => {
    if (stats?.recentActivity) {
      setActivities(stats.recentActivity);
    }
  }, [stats]);

  // Simulated Real-Time Activity Feed Generator
  useEffect(() => {
    const activityTemplates = [
      {
        title: language === "vi" ? "Thanh toán thành công" : "Payment Completed",
        desc: language === "vi" ? "Phòng {room} vừa thanh toán hóa đơn $180" : "Room {room} paid invoice amount of $180",
      },
      {
        title: language === "vi" ? "Đã dọn dẹp phòng" : "Task Completed",
        desc: language === "vi" ? "Nhân viên đã hoàn tất dọn vệ sinh phòng {room}" : "Staff finished cleaning room {room}",
      },
      {
        title: language === "vi" ? "Đã ký hợp đồng mới" : "Contract Signed",
        desc: language === "vi" ? "Đã lập hợp đồng thuê mới cho phòng {room}" : "Created a new contract for room {room}",
      },
      {
        title: language === "vi" ? "Yêu cầu bảo trì mới" : "Maintenance Request",
        desc: language === "vi" ? "Khách thuê phòng {room} báo hỏng máy lạnh" : "Tenant in room {room} reported broken AC",
      },
      {
        title: language === "vi" ? "Khách hàng nhận phòng" : "Guest Checked In",
        desc: language === "vi" ? "Phòng {room} vừa hoàn tất thủ tục check-in" : "Room {room} checked in successfully",
      },
    ];

    const interval = setInterval(() => {
      const randomRoom = Math.floor(Math.random() * 200) + 101;
      const template = activityTemplates[Math.floor(Math.random() * activityTemplates.length)];
      const resolvedDesc = template.desc.replace("{room}", randomRoom.toString());

      const newActivity = {
        title: template.title,
        description: resolvedDesc,
        time: language === "vi" ? "Vừa xong" : "Just now",
      };

      // Push notification toast
      toast.info(`${newActivity.title}: ${newActivity.description}`, {
        icon: "⚡",
        duration: 3500,
      });

      // Update local activities feed
      setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
    }, 18000); // Trigger a simulated real-time event every 18 seconds

    return () => clearInterval(interval);
  }, [language]);

  if (isLoading) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="flex h-[80vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="flex-1 space-y-6">
          {/* Header with real-time status */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="text-3xl font-bold tracking-tight">{t("dashboard.title")}</h2>
            
            <div className="flex items-center gap-3 self-start">
              {/* Real-time Indicator Dot */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs text-emerald-400 font-semibold tracking-wide uppercase font-mono">
                  {language === "vi" ? "Real-time đang hoạt động" : "Real-time Active"}
                </span>
              </div>

              {/* Force refresh indicator/button */}
              <button
                onClick={() => {
                  refetch();
                  toast.success(language === "vi" ? "Đã làm mới dữ liệu" : "Data refreshed");
                }}
                disabled={isRefetching}
                className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg border border-white/5 transition-all flex items-center justify-center disabled:opacity-50"
                title={language === "vi" ? "Tải lại dữ liệu" : "Reload data"}
              >
                <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin text-emerald-500" : ""}`} />
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title={t("dashboard.totalRevenue")}
              value={`$${stats?.revenue?.total?.toLocaleString('en-US') || "0"}`}
              icon={DollarSign}
              trend={{ value: 12.5, isPositive: true }}
              description={t("dashboard.fromLastMonth")}
            />
            <StatsCard
              title={t("dashboard.occupiedRooms")}
              value={stats?.rooms?.occupied?.toString() || "0"}
              icon={Home}
              trend={{ value: 8.2, isPositive: true }}
              description={t("dashboard.totalRooms").replace("{count}", (stats?.rooms?.total || 0).toString())}
            />
            <StatsCard
              title={t("dashboard.activeTenants")}
              value={stats?.tenants?.active?.toString() || "0"}
              icon={Users}
              trend={{ value: 5.4, isPositive: true }}
              description={t("dashboard.activeLeases")}
            />
            <StatsCard
              title={t("dashboard.pendingTasks")}
              value={stats?.tasks?.pending?.toString() || "0"}
              icon={Activity}
              trend={{ value: 2, isPositive: false }}
              description={t("dashboard.requiresAttention")}
            />
          </div>

          {/* Chart and Activity Section */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Visual SVG interactive Area Chart */}
            <Card className="col-span-4 border-white/10 bg-zinc-900/40 backdrop-blur-sm shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-zinc-100">{t("dashboard.overview")}</CardTitle>
                <CardDescription>
                  {language === "vi"
                    ? "Hiển thị biến động dòng tiền doanh thu toàn hệ thống theo thời gian."
                    : "Displays the system-wide cash flow and revenue fluctuations over time."}
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[280px] mt-2 flex items-center justify-center">
                <InteractiveChart language={language} />
              </CardContent>
            </Card>

            {/* Dynamic Activity List */}
            <Card className="col-span-3 border-white/10 bg-zinc-900/40 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="text-zinc-100">{t("dashboard.recentActivity")}</CardTitle>
                <CardDescription>
                  {t("dashboard.recentActivityDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 max-h-[260px] overflow-y-auto pr-1">
                  {activities.length ? (
                    activities.map((activity: any, i: number) => (
                      <div key={i} className="flex items-start gap-3 border-b border-white/5 pb-3 last:border-0 last:pb-0 group">
                        <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500 group-hover:scale-125 transition-all duration-150 shadow-[0_0_8px_#10b981]"></div>
                        <div className="space-y-0.5 flex-1">
                          <p className="text-sm font-semibold text-zinc-200 leading-none">{activity.title}</p>
                          <p className="text-xs text-zinc-400">
                            {activity.description}
                          </p>
                        </div>
                        <div className="text-[10px] text-zinc-500 font-medium whitespace-nowrap">
                          {activity.time}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">{t("dashboard.noActivity")}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>
    </ProtectedRoute>
  );
}
