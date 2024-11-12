import { QueryParams } from "@/models/queryParams";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function createQueryParams(params: QueryParams): string {
  const searchParams = new URLSearchParams();

  // const activeUrl = window.location;

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        if (key === 'filter' && value.length > 0) {
          value.forEach((item) => {
            searchParams.append(item.split('=')[0], item.split('=')[1]);
          });
        } else {
          value.forEach((item) => {
            searchParams.append(key, item);
          });
        }
      } else {
        searchParams.append(key, value.toString());
      }
    }
  });

  return `?${searchParams.toString()}`;
}