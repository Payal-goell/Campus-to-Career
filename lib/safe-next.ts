/** Allow only same-origin relative paths after login. */
export function safeNextPath(raw: string | null | undefined, fallback = '/dashboard'): string {
  if (!raw) return fallback;
  const value = raw.trim();
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('://')) {
    return fallback;
  }
  // Block auth loops
  if (value.startsWith('/login') || value.startsWith('/register') || value.startsWith('/verify-email')) {
    return fallback;
  }
  return value;
}
