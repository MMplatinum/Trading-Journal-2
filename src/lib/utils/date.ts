import { format, parseISO } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

export function getCurrentDate(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function getCurrentTime(): string {
  return format(new Date(), 'HH:mm');
}

export function toUTCDate(localDate: string): string {
  const date = parseISO(localDate);
  const utcDate = zonedTimeToUtc(date, Intl.DateTimeFormat().resolvedOptions().timeZone);
  return format(utcDate, 'yyyy-MM-dd');
}

export function toLocalDate(utcDate: string): string {
  const date = parseISO(utcDate);
  const localDate = utcToZonedTime(date, Intl.DateTimeFormat().resolvedOptions().timeZone);
  return format(localDate, 'yyyy-MM-dd');
}

export function formatDateTime(date: string, time: string): string {
  return `${date} ${time}`;
}