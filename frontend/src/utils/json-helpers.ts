/**
 * Safe JSON helpers for Prisma String fields that store JSON arrays.
 *
 * In SQLite, JSON data is stored as String columns (e.g. includes, excludes,
 * itinerary, galleryImages, tags). When migrating to PostgreSQL these fields
 * should be converted to native Json type.
 *
 * Usage:
 *   const items: string[] = parseJsonField<string>(row.includes);
 *   const json: string = stringifyJsonField<string>(items);
 */

/**
 * Safely parse a JSON string field into an array.
 * Returns the default value if parsing fails or the value is empty.
 */
export function parseJsonField<T>(value: string | null | undefined, defaultValue: T[] = []): T[] {
  if (!value || value === "" || value === "null" || value === "undefined") {
    return defaultValue;
  }

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed as T[];
    }
    // If it's a single value wrapped somehow, wrap it in an array
    return [parsed] as T[];
  } catch {
    return defaultValue;
  }
}

/**
 * Safely stringify an array into a JSON string for storage.
 * Always returns a valid JSON array string, never null.
 */
export function stringifyJsonField<T>(value: T[] | null | undefined): string {
  if (!value || !Array.isArray(value)) {
    return "[]";
  }

  try {
    return JSON.stringify(value);
  } catch {
    return "[]";
  }
}
