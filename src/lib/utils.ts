import { constants } from "@/constants";
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

export function generateRandomString(
  length: number = constants.RANDOM_STRING_LENGTH
): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
