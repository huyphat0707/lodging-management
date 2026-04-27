"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/components/providers/LanguageProvider";

export function RevenueReport() {
  const { t } = useI18n();

  const revenueData = [
    { month: "Jan", revenue: 12000, target: 15000 },
    { month: "Feb", revenue: 13500, target: 15000 },
    { month: "Mar", revenue: 14200, target: 15000 },
    { month: "Apr", revenue: 15800, target: 15000 },
  ];

  const maxRevenue = Math.max(...revenueData.map((d) => d.target));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("reports.revenue")}</CardTitle>
        <CardDescription>{t("reports.revenueDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {revenueData.map((data) => (
            <div key={data.month} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{data.month}</span>
                <span className="text-muted-foreground">${data.revenue.toLocaleString()}</span>
              </div>
              <div className="flex gap-1 h-4">
                <div
                  className="h-full bg-blue-500 rounded-sm"
                  style={{ width: `${(data.revenue / maxRevenue) * 100}%` }}
                ></div>
                <div
                  className="h-full bg-gray-200 rounded-sm"
                  style={{ width: `${((data.target - data.revenue) / maxRevenue) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
