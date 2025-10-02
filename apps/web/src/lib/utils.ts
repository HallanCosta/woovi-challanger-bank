import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function maskEmail(email?: string): string {
  if (!email) return '';
  const [user, domain] = email.split('@');
  if (!user || !domain) return email;
  return `${user.substring(0, 2)}****@${domain}`;
}
