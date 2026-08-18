import { get, push, ref, remove } from "firebase/database";
import { db } from "../utils/firebaseConfig";
import { isContactMessage } from "../utils/typeGuards";
import type { ContactMessage } from "../types/contact";

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

export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const snapshot = await get(ref(db, "/forms"));
  const data = snapshot.val() || {};
  const list: ContactMessage[] = Object.entries(data).flatMap(
    ([id, value]) => {
      if (!isContactMessage(value)) return [];
      const message: ContactMessage = {
        id,
        name: value.name,
        email: value.email,
        subject: value.subject,
        message: value.message,
        createdAt: value.createdAt,
      };
      return [message];
    },
  );
  list.sort((a, b) => b.createdAt - a.createdAt);
  return list;
}

export async function deleteContactMessage(id: string): Promise<void> {
  await remove(ref(db, `/forms/${id}`));
}

const MIN_FILL_TIME = 3000;

let formLoadedAt = Date.now();

export function resetFormLoadedAt(): void {
  formLoadedAt = Date.now();
}

export function isFilledTooFast(): boolean {
  return Date.now() - formLoadedAt < MIN_FILL_TIME;
}