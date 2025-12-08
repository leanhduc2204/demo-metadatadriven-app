export function formatPhoneNumber(input: string): string | null {
  // Keep only digits
  const digits = input.replace(/\D/g, "");

  // --- Vietnam: 84 / 0 + 9–10 digits ---
  // Patterns:
  //   +84XXXXXXXXX
  //   0XXXXXXXXX
  if (digits.startsWith("84") && digits.length === 11) {
    const local = digits.slice(2);
    return `+84 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
  }

  if (digits.startsWith("0") && digits.length === 10) {
    const local = digits.slice(1);
    return `+84 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
  }

  // --- USA: 1 + 10 digits or local 10 digits ---
  // Patterns:
  //   +1XXXXXXXXXX
  //   XXXXXXXXXX
  if (digits.startsWith("1") && digits.length === 11) {
    const local = digits.slice(1);
    return `+1 (${local.slice(0, 3)}) ${local.slice(3, 6)}-${local.slice(6)}`;
  }

  if (digits.length === 10) {
    return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(
      6
    )}`;
  }

  // Unknown format
  return null;
}

export function timeFromNow(inputDate: string | Date): string {
  const target =
    typeof inputDate === "string" ? new Date(inputDate) : inputDate;
  const now = new Date();

  const diffMs = target.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);

  const absSec = Math.abs(diffSec);

  const units = [
    { label: "year", sec: 60 * 60 * 24 * 365 },
    { label: "month", sec: 60 * 60 * 24 * 30 },
    { label: "week", sec: 60 * 60 * 24 * 7 },
    { label: "day", sec: 60 * 60 * 24 },
    { label: "hour", sec: 60 * 60 },
    { label: "minute", sec: 60 },
    { label: "second", sec: 1 },
  ];

  for (const { label, sec } of units) {
    const amount = Math.floor(absSec / sec);
    if (amount >= 1) {
      const plural = amount === 1 ? "" : "s";
      return diffSec < 0
        ? `${amount} ${label}${plural} ago`
        : `in ${amount} ${label}${plural}`;
    }
  }

  return "just now";
}

// Currency formatter
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

// Date/time formatter (e.g., "Dec 8, 2025 1:20 PM")
export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

const avatarBgClasses = [
  "bg-red-200",
  "bg-orange-200",
  "bg-amber-200",
  "bg-yellow-200",
  "bg-lime-200",
  "bg-green-200",
  "bg-emerald-200",
  "bg-teal-200",
  "bg-cyan-200",
  "bg-sky-200",
  "bg-blue-200",
  "bg-indigo-200",
  "bg-violet-200",
  "bg-purple-200",
  "bg-fuchsia-200",
  "bg-pink-200",
  "bg-rose-200",
];

export function pickColorBySeed(seed: string): string {
  if (!seed) return avatarBgClasses[0];
  const hash = seed
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return avatarBgClasses[hash % avatarBgClasses.length];
}
