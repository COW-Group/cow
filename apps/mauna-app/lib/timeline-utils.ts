import { TIMELINE_CONSTANTS } from "./timeline-constants"
import { isSameDay } from "date-fns"

export interface TimelineItem {
  id: string
  label: string
  description: string
  color: string
  scheduledTime: string
  duration: number
  type: "habit" | "activity"
  isCompleted: boolean
  icon?: string
  frequency?: string
  isBuildHabit?: boolean
  history?: string[]
  breaths?: any[]
}

export interface TimelineItemWithPosition {
  item: TimelineItem
  itemStartMinutes: number
  itemEndMinutes: number
  topPosition: number
  height: number
  overlaps: TimelineItem[]
  index: number
}

/**
 * Convert HH:mm time string to minutes from midnight
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * TIMELINE_CONSTANTS.MINUTES_PER_HOUR + minutes
}

/**
 * Convert minutes from midnight to HH:mm time string
 */
export function minutesToTime(minutes: number): string {
  const hours = Math.floor(minutes / TIMELINE_CONSTANTS.MINUTES_PER_HOUR)
    .toString()
    .padStart(2, "0")
  const mins = (minutes % TIMELINE_CONSTANTS.MINUTES_PER_HOUR).toString().padStart(2, "0")
  return `${hours}:${mins}`
}

/**
 * Calculate timeline bounds based on scheduled items
 */
export function calculateTimelineBounds(items: TimelineItem[]): { start: number; end: number } {
  if (items.length === 0) {
    return { start: 0, end: TIMELINE_CONSTANTS.MINUTES_PER_DAY }
  }

  const startMinutes = items.map((item) => timeToMinutes(item.scheduledTime))
  const endMinutes = items.map((item) => timeToMinutes(item.scheduledTime) + item.duration)

  const earliestStart = Math.min(...startMinutes)
  const latestEnd = Math.max(...endMinutes)

  // Round to nearest hour
  const startHour = Math.floor(earliestStart / TIMELINE_CONSTANTS.MINUTES_PER_HOUR) * TIMELINE_CONSTANTS.MINUTES_PER_HOUR
  const endHour = Math.ceil(latestEnd / TIMELINE_CONSTANTS.MINUTES_PER_HOUR) * TIMELINE_CONSTANTS.MINUTES_PER_HOUR

  return { start: startHour, end: endHour }
}

/**
 * Check if two timeline items overlap
 */
export function itemsOverlap(
  item1Start: number,
  item1End: number,
  item2Start: number,
  item2End: number
): boolean {
  return item1Start < item2End && item1End > item2Start
}

/**
 * Find all items that overlap with a given item
 */
export function findOverlappingItems(
  targetItem: TimelineItem,
  allItems: TimelineItem[]
): TimelineItem[] {
  const targetStart = timeToMinutes(targetItem.scheduledTime)
  const targetEnd = targetStart + targetItem.duration

  return allItems.filter((otherItem) => {
    if (otherItem.id === targetItem.id) return false
    const otherStart = timeToMinutes(otherItem.scheduledTime)
    const otherEnd = otherStart + otherItem.duration
    return itemsOverlap(targetStart, targetEnd, otherStart, otherEnd)
  })
}

/**
 * Calculate positioning for timeline items with overlap detection
 */
export function calculateItemPositions(
  items: TimelineItem[],
  timelineBounds: { start: number; end: number }
): TimelineItemWithPosition[] {
  return items.map((item, index) => {
    const itemStartMinutes = timeToMinutes(item.scheduledTime)
    const itemEndMinutes = itemStartMinutes + item.duration
    const topPosition = ((itemStartMinutes - timelineBounds.start) / TIMELINE_CONSTANTS.MINUTES_PER_HOUR) * TIMELINE_CONSTANTS.HOUR_HEIGHT_PX
    const height = (item.duration / TIMELINE_CONSTANTS.MINUTES_PER_HOUR) * TIMELINE_CONSTANTS.HOUR_HEIGHT_PX

    const overlaps = findOverlappingItems(item, items)

    return {
      item,
      itemStartMinutes,
      itemEndMinutes,
      topPosition,
      height,
      overlaps,
      index,
    }
  })
}

/**
 * Calculate horizontal layout for overlapping items
 */
export function calculateOverlapLayout(hasOverlaps: boolean, index: number): {
  width: string
  offsetPercent: number
} {
  if (!hasOverlaps) {
    return {
      width: `calc(${TIMELINE_CONSTANTS.NO_OVERLAP_WIDTH_PERCENT}% - 40px)`,
      offsetPercent: 0,
    }
  }

  return {
    width: `calc(${TIMELINE_CONSTANTS.OVERLAP_WIDTH_PERCENT}% - 40px)`,
    offsetPercent: (index % 2) * TIMELINE_CONSTANTS.OVERLAP_OFFSET_PERCENT,
  }
}

/**
 * Filter items for a specific date
 */
export function filterItemsByDate(items: TimelineItem[], targetDate: Date): TimelineItem[] {
  // In a real implementation, you would filter based on actual scheduled dates
  // For now, this returns all items as the current implementation doesn't
  // store date information with scheduled times
  // TODO: Update when date-based scheduling is added to the schema
  return items
}

/**
 * Get items scheduled for a specific day (for the day selector dots)
 */
export function getItemsForDay(items: TimelineItem[], day: Date, maxItems: number = TIMELINE_CONSTANTS.MAX_DAY_DOTS): TimelineItem[] {
  // TODO: Implement actual date filtering when date field is added to schema
  // For now, filter by checking if the day matches the selected date
  // This is a placeholder implementation
  const filteredItems = filterItemsByDate(items, day)
  return filteredItems.slice(0, maxItems)
}

/**
 * Generate time slots for timeline display
 */
export function generateTimeSlots(startMinutes: number, endMinutes: number): Array<{ time: string; minutes: number }> {
  const slots: Array<{ time: string; minutes: number }> = []
  const startHour = Math.floor(startMinutes / TIMELINE_CONSTANTS.MINUTES_PER_HOUR)
  const endHour = Math.ceil(endMinutes / TIMELINE_CONSTANTS.MINUTES_PER_HOUR)

  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push({
      time: `${hour.toString().padStart(2, "0")}:00`,
      minutes: hour * TIMELINE_CONSTANTS.MINUTES_PER_HOUR,
    })
  }

  return slots
}
