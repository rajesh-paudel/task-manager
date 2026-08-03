import { ref, push } from "firebase/database";
import { db } from "../utils/firebaseConfig";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function submitContactForm(data: ContactFormData): Promise<void> {
  await push(ref(db, "/forms"), {
    ...data,
    createdAt: Date.now(),
  });
}

const MIN_FILL_TIME = 3000;

let formLoadedAt = Date.now();

export function resetFormLoadedAt(): void {
  formLoadedAt = Date.now();
}

export function isFilledTooFast(): boolean {
  return Date.now() - formLoadedAt < MIN_FILL_TIME;
}