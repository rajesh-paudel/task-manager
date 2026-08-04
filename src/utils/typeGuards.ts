import type { UserProfile } from "../types/user";
import type { ContactMessage } from "../types/contact";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

export function isUserProfile(value: unknown): value is UserProfile {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    isNonEmptyString(v.uid) &&
    isNonEmptyString(v.name) &&
    isNonEmptyString(v.email) &&
    typeof v.profileUrl === "string" &&
    typeof v.title === "string" &&
    typeof v.bio === "string" &&
    (v.role === "admin" || v.role === "user") &&
    typeof v.createdAt === "number"
  );
}

export function isContactMessage(value: unknown): value is ContactMessage {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Omit<ContactMessage, "id">;
  return (
    isNonEmptyString(v.name) &&
    isNonEmptyString(v.email) &&
    isNonEmptyString(v.subject) &&
    typeof v.message === "string" &&
    typeof v.createdAt === "number"
  );
}