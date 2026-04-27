"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type PropertyType = "Boarding" | "Hotel" | "Homestay";

interface PropertyContextType {
  selectedPropertyType: PropertyType;
  setSelectedPropertyType: (type: PropertyType) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [selectedPropertyType, setSelectedPropertyType] = useState<PropertyType>("Boarding");

  return (
    <PropertyContext.Provider value={{ selectedPropertyType, setSelectedPropertyType }}>
      {children}
    </PropertyContext.Provider>
  );
}

export function usePropertyContext() {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error("usePropertyContext must be used within PropertyProvider");
  }
  return context;
}
