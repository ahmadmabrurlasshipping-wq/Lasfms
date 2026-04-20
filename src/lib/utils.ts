import { clsx, type ClassValue } from "clsx";
import { format, differenceInDays, formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(dateString: string | Date | null | undefined, formatStr?: string) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return format(date, formatStr || 'dd MMM yyyy', { locale: id });
}

export function formatDateTime(dateString: string | Date | null | undefined, formatStr?: string) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return format(date, formatStr || 'dd MMM yyyy HH:mm', { locale: id });
}

export function formatNumber(num: number | null | undefined, decimals?: number) {
  if (num === null || num === undefined) return '-';
  return num.toLocaleString('id-ID', decimals !== undefined ? { minimumFractionDigits: decimals, maximumFractionDigits: decimals } : undefined);
}

export function daysUntil(dateString: string | Date | null | undefined) {
  if (!dateString) return 0;
  return differenceInDays(new Date(dateString), new Date());
}

export function formatRelativeTime(dateString: string | Date | null | undefined) {
  if (!dateString) return '-';
  return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: id });
}

export function getInitials(name: string | null | undefined) {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function getAvatarColor(name: string | null | undefined) {
  if (!name) return 'bg-navy-700';
  const colors = [
    'bg-blue-500',
    'bg-red-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
  ];
  const index = name.length % colors.length;
  return colors[index];
}
