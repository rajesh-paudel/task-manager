import { FirebaseError } from "firebase/app";

export function getAuthErrorMessage(err: unknown): string {
  if (!(err instanceof FirebaseError)) {
    return "Something went wrong. Please try again.";
  }

  switch (err.code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "Current password is incorrect.";

    case "auth/weak-password":
      return "Your new password is too weak.";

    case "auth/requires-recent-login":
      return "Please sign in again and try changing your password.";

    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";

    case "auth/network-request-failed":
      return "Network error. Check your internet connection.";

    default:
      return err.message || "Something went wrong.";
  }
}

export function getRegisterErrorMessage(err: unknown): string {
  const code = err instanceof FirebaseError ? err.code : "";
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";

    case "auth/invalid-email":
      return "Invalid email address.";

    case "auth/weak-password":
      return "Password is too weak.";

    default:
      return "Registration failed.";
  }
}

export function getErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}