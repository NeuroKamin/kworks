import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getWeek(offset: number = 0) {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(
    today.setDate(
      today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + offset * 7,
    ),
  );
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  return { startOfWeek, endOfWeek };
}
