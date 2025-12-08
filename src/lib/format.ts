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
