export function getAdminEmailAllowlist(): string[] {
  // Comma-separated list (recommended). Example: "abdinur@risinghorn.com"
  // You can set either ADMIN_EMAILS or ADMIN_EMAIL.
  const raw = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "";
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isEmailAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  const allow = getAdminEmailAllowlist();
  if (allow.length === 0) return false;
  return allow.includes(email.trim().toLowerCase());
}
