// Utility functions for week calculations

/**
 * Calculate the start and end dates of the current week based on user settings
 * @param weekStart - Day of week that starts the week (0 = Sunday, 1 = Monday, etc.)
 * @param timeZone - IANA time zone identifier (e.g., 'America/Los_Angeles')
 * @returns Object with startDate and endDate as ISO strings
 */
export function getCurrentWeekBoundaries(
  weekStart: number = 0,
  timeZone: string = 'America/Los_Angeles'
): { startDate: string; endDate: string } {
  // Get current date in the specified time zone
  const now = new Date()
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const parts = formatter.formatToParts(now)
  const year = parseInt(parts.find(p => p.type === 'year')?.value || '0')
  const month = parseInt(parts.find(p => p.type === 'month')?.value || '0') - 1
  const day = parseInt(parts.find(p => p.type === 'day')?.value || '0')

  // Create date object in the specified time zone
  const currentDate = new Date(year, month, day)
  const currentDayOfWeek = currentDate.getDay() // 0 = Sunday, 1 = Monday, etc.

  // Calculate days to subtract to get to the start of the week
  let daysToSubtract = currentDayOfWeek - weekStart
  if (daysToSubtract < 0) {
    daysToSubtract += 7
  }

  // Calculate start of week
  const startOfWeek = new Date(currentDate)
  startOfWeek.setDate(currentDate.getDate() - daysToSubtract)
  startOfWeek.setHours(0, 0, 0, 0)

  // Calculate end of week (6 days after start)
  const endOfWeek = new Date(startOfWeek)
  endOfWeek.setDate(startOfWeek.getDate() + 6)
  endOfWeek.setHours(23, 59, 59, 999)

  return {
    startDate: startOfWeek.toISOString(),
    endDate: endOfWeek.toISOString(),
  }
}

/**
 * Format a date range as a readable string
 * @param startDate - ISO date string
 * @param endDate - ISO date string
 * @returns Formatted date range (e.g., "1/1/2025 → 1/7/2025")
 */
export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate)
  const end = new Date(endDate)

  const formatOptions: Intl.DateTimeFormatOptions = {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  }

  const startStr = start.toLocaleDateString('en-US', formatOptions)
  const endStr = end.toLocaleDateString('en-US', formatOptions)

  return `${startStr} → ${endStr}`
}

/**
 * Get the day name from a day number
 * @param dayNumber - 0-6 representing Sunday-Saturday
 * @returns Day name (e.g., "Sunday", "Monday")
 */
export function getDayName(dayNumber: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[dayNumber] || 'Sunday'
}

/**
 * Check if a reset period is for the current week
 * @param periodStart - Period start date
 * @param periodEnd - Period end date
 * @param weekStart - Day of week that starts the week
 * @param timeZone - IANA time zone identifier
 * @returns true if the period matches the current week
 */
export function isCurrentWeek(
  periodStart: string,
  periodEnd: string,
  weekStart: number = 0,
  timeZone: string = 'America/Los_Angeles'
): boolean {
  const currentWeek = getCurrentWeekBoundaries(weekStart, timeZone)

  const periodStartDate = new Date(periodStart).toISOString().split('T')[0]
  const periodEndDate = new Date(periodEnd).toISOString().split('T')[0]
  const currentStartDate = new Date(currentWeek.startDate).toISOString().split('T')[0]
  const currentEndDate = new Date(currentWeek.endDate).toISOString().split('T')[0]

  return periodStartDate === currentStartDate && periodEndDate === currentEndDate
}
