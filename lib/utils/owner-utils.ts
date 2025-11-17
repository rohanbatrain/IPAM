/**
 * Utility functions for handling owner fields in IPAM resources.
 * 
 * The backend is transitioning from storing user_id to username in the owner field.
 * These utilities provide graceful fallbacks during the transition.
 */

/**
 * Check if a string looks like a MongoDB ObjectId (24 hex characters)
 */
export function isMongoId(value: string | null | undefined): boolean {
  if (!value) return false;
  return value.length === 24 && /^[0-9a-f]{24}$/i.test(value);
}

/**
 * Format owner field for display.
 * If the owner is a MongoDB ObjectId, show a truncated version with a hint.
 * Otherwise, show the username as-is.
 * 
 * @param owner - The owner field from the API (could be username or user_id)
 * @returns Formatted owner string for display
 */
export function formatOwner(owner: string | null | undefined): string {
  if (!owner) {
    return '-';
  }
  
  // If it looks like a MongoDB ObjectId, show truncated version
  if (isMongoId(owner)) {
    return `${owner.substring(0, 8)}... (ID)`;
  }
  
  // Otherwise, it's a username - show as-is
  return owner;
}

/**
 * Get a tooltip/title for the owner field.
 * Provides helpful context when the owner is a user_id instead of username.
 * 
 * @param owner - The owner field from the API
 * @returns Tooltip text
 */
export function getOwnerTooltip(owner: string | null | undefined): string {
  if (!owner) {
    return 'No owner assigned';
  }
  
  if (isMongoId(owner)) {
    return `User ID: ${owner}\n(Backend migration pending - will show username soon)`;
  }
  
  return `Owner: ${owner}`;
}

/**
 * Check if the owner field needs migration (is a user_id instead of username)
 */
export function ownerNeedsMigration(owner: string | null | undefined): boolean {
  return isMongoId(owner);
}
