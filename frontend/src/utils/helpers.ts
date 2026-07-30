export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

const USD_TO_TOMAN = 60000;

export function formatCurrency(amount: number, currency: string = "USD"): string {
  const formatters: Record<string, Intl.NumberFormat> = {
    USD: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
    EUR: new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }),
    IRR: new Intl.NumberFormat("fa-IR", { style: "currency", currency: "IRR" }),
    JPY: new Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" }),
  };
  return formatters[currency]?.format(amount) || `${currency} ${amount.toLocaleString()}`;
}

export function formatPrice(amount: number, locale: string = "en"): string {
  if (locale === "fa") {
    const toman = Math.round(amount * USD_TO_TOMAN);
    return `${toman.toLocaleString("fa-IR")} تومان`;
  }
  return `$${amount.toLocaleString("en-US")}`;
}

export function formatDate(date: Date | string, locale: string = "en"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
}

export function getTourTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    MOUNTAIN: "Mountaineering",
    FOREST: "Forest & Jungle",
    CITY: "City Tour",
    VILLAGE: "Village & Rural",
    NATURE: "Nature & Desert",
  };
  return labels[type] || type;
}

export function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    EASY: "Easy",
    MODERATE: "Moderate",
    HARD: "Hard",
    VERY_HARD: "Very Hard",
  };
  return labels[difficulty] || difficulty;
}

export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    EASY: "text-green-600 bg-green-50",
    MODERATE: "text-yellow-600 bg-yellow-50",
    HARD: "text-orange-600 bg-orange-50",
    VERY_HARD: "text-red-600 bg-red-50",
  };
  return colors[difficulty] || "text-gray-600 bg-gray-50";
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "Pending",
    PAID: "Paid",
    CONFIRMED: "Confirmed",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    REFUNDED: "Refunded",
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: "text-yellow-600 bg-yellow-50",
    PAID: "text-blue-600 bg-blue-50",
    CONFIRMED: "text-green-600 bg-green-50",
    IN_PROGRESS: "text-purple-600 bg-purple-50",
    COMPLETED: "text-emerald-600 bg-emerald-50",
    CANCELLED: "text-red-600 bg-red-50",
    REFUNDED: "text-gray-600 bg-gray-50",
  };
  return colors[status] || "text-gray-600 bg-gray-50";
}
