import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, curr: "NGN" | "EUR"){
  switch(curr){
    case "NGN":
      return (amount || 0).toLocaleString("en-NG", { style: "currency", currency: "NGN"} )
    case "EUR":
      return (amount || 0).toLocaleString("en-EU", { style: "currency", currency: "EUR"} )
    default:
      return (amount || 0).toLocaleString("en-US", { style: "currency", currency: "USD"} )
  }
}