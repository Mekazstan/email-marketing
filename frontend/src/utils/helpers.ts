import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper to combine class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date string
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Convert HTML to plain text (for previews)
export function htmlToText(html: string): string {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
}

// Calculate read time for emails
export function calculateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const readingTimeMin = Math.ceil(words / 200); // Assuming 200 words per minute reading speed
  return `${readingTimeMin} min read`;
}

// Generate initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
