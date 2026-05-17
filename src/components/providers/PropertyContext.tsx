"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";

export type PropertyType = "Boarding" | "Hotel" | "Homestay";

interface PropertyContextType {
  selectedPropertyType: PropertyType;
  setSelectedPropertyType: (type: PropertyType) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [selectedPropertyType, setSelectedPropertyType] = useState<PropertyType>("Boarding");

  useEffect(() => {
    if (user && user.propertyType) {
      if (user.role !== "super_admin") {
        setSelectedPropertyType(user.propertyType as PropertyType);
      } else if (!selectedPropertyType) {
        setSelectedPropertyType(user.propertyType as PropertyType);
      }
    }
  }, [user]);

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
