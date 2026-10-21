/** Final-year placement season for a 4-year B.Tech, from the year they are in now. */
export function placementYearFromCurrentYear(currentYear: number, today = new Date()): number {
  const year = Math.min(4, Math.max(1, Math.round(currentYear) || 1));
  return today.getFullYear() + (4 - year);
}
