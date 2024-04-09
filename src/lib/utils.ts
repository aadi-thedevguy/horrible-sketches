import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createAvatar(fullName: string) {
  if (fullName && fullName.length > 3) {
    const nameArray = fullName.split(" ");
    const avatar = nameArray[0].substring(0, 2);
    return avatar.toUpperCase();
  }
  return "HS";
}
