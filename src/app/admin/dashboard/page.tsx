"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute } from "@/components/wrappers/ProtectedRoute";
import { StatsCard } from "@/features/dashboard/StatsCard";
import { Users, Home, DollarSign, Activity, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/api/analytics";
import { useI18n } from "@/components/providers/LanguageProvider";

export default function DashboardPage() {
  const { t } = useI18n();
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => analyticsApi.getOverviewStats(),
  });

  if (isLoading) {
    return (
      <ProtectedRoute>
        <AppLayout>
          <div className="flex h-[80vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </AppLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <AppLayout>
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">{t("dashboard.title")}</h2>
          </div>

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

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>{t("dashboard.overview")}</CardTitle>
              </CardHeader>
              <CardContent className="m-4 flex h-[350px] items-end justify-between rounded-lg border border-emerald-200/50 bg-gradient-to-br from-emerald-400/35 via-emerald-500/20 to-emerald-700/20 p-6">
                {[45, 65, 52, 78, 60, 82, 70].map((height, idx) => (
                  <div
                    key={idx}
                    className="w-8 rounded-t-md bg-gradient-to-t from-emerald-700 to-emerald-400 shadow-sm"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>{t("dashboard.recentActivity")}</CardTitle>
                <CardDescription>
                  {t("dashboard.recentActivityDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {stats?.recentActivity?.length ? (
                    stats.recentActivity.map((activity: any, i: number) => (
                      <div key={i} className="flex items-center">
                        <div className="ml-4 space-y-1">
                          <p className="text-sm font-medium leading-none">{activity.title || "User Action"}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.description || "Updated property status"}
                          </p>
                        </div>
                        <div className="ml-auto font-medium text-xs text-muted-foreground">
                          {activity.time || "Just now"}
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
