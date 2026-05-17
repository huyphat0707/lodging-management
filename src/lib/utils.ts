import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrencyInput(value: string | number) {
  if (!value && value !== 0) return "";
  let number: number;
  if (typeof value === "number") {
    number = Math.round(value);
  } else {
    if (/^\d+\.00$/.test(value.trim())) {
      number = Math.round(parseFloat(value));
    } else {
      number = parseInt(value.replace(/\D/g, ""));
    }
  }
  if (isNaN(number)) return "";
  return new Intl.NumberFormat("vi-VN").format(number);
}

export function parseCurrencyInput(value: string) {
  return value.replace(/\D/g, "");
}
