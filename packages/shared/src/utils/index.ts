// Date utilities
export function formatDate(date: Date, locale = 'en-US'): string {
  return new Date(date).toLocaleDateString(locale);
}

export function formatDateTime(date: Date, locale = 'en-US'): string {
  return new Date(date).toLocaleString(locale);
}

export function getWeekStart(date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

export function getWeekEnd(date = new Date()): Date {
  const start = getWeekStart(date);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return end;
}

// Distance utilities
export function convertYardsToMeters(yards: number): number {
  return Math.round(yards * 0.9144 * 10) / 10;
}

export function convertMetersToYards(meters: number): number {
  return Math.round(meters * 1.0936 * 10) / 10;
}

export function formatDistance(meters: number, unit: 'm' | 'y' = 'm'): string {
  if (unit === 'y') {
    return `${convertMetersToYards(meters)}y`;
  }
  return `${meters}m`;
}

// Pace utilities (assumes meters and seconds)
export function calculatePace(distanceMeters: number, timeSeconds: number): string {
  const pace100m = (timeSeconds / distanceMeters) * 100;
  const minutes = Math.floor(pace100m / 60);
  const seconds = Math.round(pace100m % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')} / 100m`;
}

// Time utilities
export function formatSeconds(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
