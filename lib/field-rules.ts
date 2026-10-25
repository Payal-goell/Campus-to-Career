/** Shared checks for sign-in, registration, and onboarding. */

export const DEFAULT_COLLEGE = 'Sagar Institute of Science and Technology (SISTec), Gandhi Nagar, Bhopal';

export const CAREER_GOALS = [
  'Secure a product-company SDE internship',
  'Clear a campus drive (TCS, Infosys, Wipro, or the college pool)',
  'Prepare for GATE',
  'Build a placement-ready project portfolio',
  'Land a core engineering role for my branch',
  'Prepare for higher studies (M.Tech or MS)',
  'Other',
] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function emailError(value: string): string {
  const email = value.trim();
  if (!email) return 'Email is required';
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) return 'Enter a valid email address';
  return '';
}

export function loginPasswordError(value: string): string {
  if (!value) return 'Password is required';
  if (value.length > 72) return 'That password is too long';
  return '';
}

export function newPasswordError(value: string): string {
  if (!value) return 'Password is required';
  if (value.length < 8) return 'Use at least 8 characters';
  if (value.length > 72) return 'Use at most 72 characters';
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return 'Include a letter and a number';
  return '';
}

/** Returns +91 and 10 digits, or null when the number is not an Indian mobile. */
export function normalizeIndianMobile(value: string): string | null {
  const digits = value.replace(/\D/g, '');
  let local = digits;
  if (digits.length === 12 && digits.startsWith('91')) local = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith('0')) local = digits.slice(1);
  if (!/^[6-9]\d{9}$/.test(local)) return null;
  return `+91${local}`;
}

export function phoneError(value: string): string {
  if (!value.trim()) return 'Mobile number is required';
  if (!normalizeIndianMobile(value)) return 'Enter a 10-digit Indian mobile number';
  return '';
}

export function cgpaError(value: string): string {
  if (!value.trim()) return 'CGPA is required';
  const score = Number(value);
  if (!Number.isFinite(score) || score < 0 || score > 10) return 'Enter a CGPA from 0 to 10';
  return '';
}

export function avatarError(value: string): string {
  const link = value.trim();
  if (!link) return '';
  try {
    const url = new URL(link);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return 'Use an http or https image link';
    return '';
  } catch {
    return 'Use a full image link, or leave the suggested photo';
  }
}

export function goalText(choice: string, custom: string): string {
  if (choice === 'Other') return custom.trim();
  return choice.trim();
}

export function goalError(choice: string, custom: string): string {
  if (!choice) return 'Choose a career milestone';
  if (choice === 'Other' && custom.trim().length < 8) return 'Write the milestone in a short sentence';
  return '';
}
