import { format, parseISO } from 'date-fns';

// Get current date/time
export function getCurrentDate(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getCurrentTime(): string {
  return format(new Date(), 'HH:mm');
}

// Format dates for display
export function formatDateForDisplay(date: string): string {
  return format(parseISO(date), 'MM/dd/yyyy');
}

// Format date for calendar
export function formatCalendarDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

// Format date/time for database
export function formatForDatabase(date: string, time: string): string {
  return `${date} ${time}`;
}

// Convert between local and UTC
export function toUTCDate(localDate: string): string {
  const date = new Date(localDate);
  return format(date, 'yyyy-MM-dd');
}

export function toLocalDate(utcDate: string): string {
  const date = new Date(utcDate);
  return format(date, 'yyyy-MM-dd');
}

export function toUTCTime(localTime: string): string {
  const [hours, minutes] = localTime.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return format(date, 'HH:mm');
}

export function toLocalTime(utcTime: string): string {
  const [hours, minutes] = utcTime.split(':');
  const date = new Date();
  date.setUTCHours(parseInt(hours), parseInt(minutes));
  return format(date, 'HH:mm');
}