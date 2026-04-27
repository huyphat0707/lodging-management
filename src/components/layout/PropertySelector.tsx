"use client";

import { usePropertyContext } from "@/components/providers/PropertyContext";
import { useI18n } from "@/components/providers/LanguageProvider";
import { ChevronDown } from "lucide-react";

export function PropertySelector() {
  const { selectedPropertyType, setSelectedPropertyType } =
    usePropertyContext();
  const { t } = useI18n();

  const propertyTypes = [
    { value: "Boarding", label: t("properties.typeBoarding") },
    { value: "Hotel", label: t("properties.typeHotel") },
    { value: "Homestay", label: t("properties.typeHomestay") },
  ];

  return (
    <div className="px-4 py-3 mb-2 border-b border-white/10">
      <label className="text-xs font-semibold text-zinc-300 mb-2 block uppercase tracking-wide">
        {t("sidebar.propertyType")}
      </label>
      <div className="relative">
        <select
          value={selectedPropertyType}
          onChange={(e) => setSelectedPropertyType(e.target.value as any)}
          className="w-full px-3 py-2.5 rounded-lg text-sm font-medium appearance-none cursor-pointer transition-all bg-zinc-800/50 border border-zinc-700/50 text-zinc-100 hover:bg-zinc-700/50 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 focus:bg-blue-500/10"
        >
          {propertyTypes.map((type) => (
            <option
              key={type.value}
              value={type.value}
              className="bg-zinc-900 text-zinc-100"
            >
              {type.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
      </div>
    </div>
  );
}
