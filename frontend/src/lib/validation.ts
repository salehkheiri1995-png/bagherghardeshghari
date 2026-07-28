export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (password.length < 8) errors.push("Password must be at least 8 characters");
  if (password.length > 128) errors.push("Password must be less than 128 characters");
  if (!/[A-Z]/.test(password)) errors.push("Password must contain at least one uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("Password must contain at least one lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("Password must contain at least one number");
  return { valid: errors.length === 0, errors };
}

export function validateName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 100;
}

export function validateMessage(message: string): boolean {
  return message.trim().length >= 10 && message.trim().length <= 2000;
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-()]{7,20}$/;
  return phoneRegex.test(phone);
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateBookingInput(data: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  country?: string;
}): ValidationResult {
  const errors: string[] = [];

  if (!data.firstName || !validateName(data.firstName)) {
    errors.push("First name must be 2-100 characters");
  }
  if (!data.lastName || !validateName(data.lastName)) {
    errors.push("Last name must be 2-100 characters");
  }
  if (!data.email || !validateEmail(data.email)) {
    errors.push("Invalid email address");
  }
  if (data.phone && !validatePhoneNumber(data.phone)) {
    errors.push("Invalid phone number");
  }

  return { valid: errors.length === 0, errors };
}
