import {
  get,
  onValue,
  ref,
  remove,
  set,
  update,
  type Unsubscribe,
} from "firebase/database";
import { db } from "../utils/firebaseConfig";
import { isUserProfile } from "../utils/typeGuards";
import type { UserProfile } from "../types/user";

export async function createUserProfile(
  uid: string,
  name: string,
  email: string,
): Promise<UserProfile> {
  const profile: UserProfile = {
    uid,
    name,
    email,
    profileUrl: "",
    title: "",
    bio: "",
    role: "user",
    createdAt: Date.now(),
  };
  await set(ref(db, `users/${uid}`), profile);
  return profile;
}

export function subscribeToUserProfile(
  uid: string,
  callback: (profile: UserProfile | null) => void,
): Unsubscribe {
  return onValue(ref(db, `users/${uid}`), (snapshot) => {
    const data = snapshot.val();
    callback(isUserProfile(data) ? data : null);
  });
}

export async function updateUserProfile(
  uid: string,
  changes: Partial<UserProfile>,
): Promise<void> {
  await update(ref(db, `users/${uid}`), changes);
}

export async function fetchAllUsers(): Promise<UserProfile[]> {
  const snapshot = await get(ref(db, "users"));
  const data = snapshot.val() || {};
  const list: UserProfile[] = Object.values(data).filter(isUserProfile);
  list.sort((a, b) => b.createdAt - a.createdAt);
  return list;
}

export async function updateUserRole(
  uid: string,
  role: "admin" | "user",
): Promise<void> {
  await update(ref(db, `users/${uid}`), { role });
}

export async function deleteUserData(uid: string): Promise<void> {
  await remove(ref(db, `tasks/${uid}`));
  await remove(ref(db, `users/${uid}`));
}