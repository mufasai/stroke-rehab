import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Returns time-appropriate greeting in Indonesian based on local hour.
 * 04:00 - 10:59: Selamat Pagi
 * 11:00 - 14:59: Selamat Siang
 * 15:00 - 17:59: Selamat Sore
 * 18:00 - 03:59: Selamat Malam
 * @param {Date} date
 * @returns {string}
 */
export function getTimeGreeting(date = new Date()) {
  const hour = date.getHours()

  if (hour >= 4 && hour < 11) {
    return 'Selamat Pagi'
  }
  if (hour >= 11 && hour < 15) {
    return 'Selamat Siang'
  }
  if (hour >= 15 && hour < 18) {
    return 'Selamat Sore'
  }
  return 'Selamat Malam'
}

