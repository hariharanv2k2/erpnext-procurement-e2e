export function futureDate(daysAhead: number = 7): string {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split('T')[0]!;
}
