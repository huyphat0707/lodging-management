"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/components/providers/LanguageProvider";

export function OccupancyReport() {
  const { t } = useI18n();

  const occupancyData = [
    { property: "Sunrise Boarding House", occupied: 18, total: 24, rate: 75 },
    { property: "Coastal Homestay", occupied: 7, total: 8, rate: 87.5 },
    { property: "City Inn Hotel", occupied: 35, total: 42, rate: 83 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("reports.occupancy")}</CardTitle>
        <CardDescription>{t("reports.occupancyDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {occupancyData.map((data) => (
            <div key={data.property} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{data.property}</span>
                <span className="text-muted-foreground">
                  {data.occupied}/{data.total} ({data.rate.toFixed(1)}%)
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${data.rate}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
