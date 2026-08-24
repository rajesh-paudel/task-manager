import {
  get,
  onValue,
  ref,
  remove,
  update,
  type Unsubscribe,
} from "firebase/database";
import { db } from "../utils/firebaseConfig";
import { isUserProfile } from "../utils/typeGuards";
import type { UserProfile } from "../types/user";
import { syncWorkspaceMemberProfile } from "./workspaces";

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
  await update(ref(db), {
    [`users/${uid}`]: profile,
    [`publicProfiles/${uid}`]: {
      uid,
      name,
      profileUrl: "",
    },
  });
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

export async function syncPublicUserProfile(
  profile: UserProfile,
): Promise<void> {
  await update(ref(db), {
    [`publicProfiles/${profile.uid}`]: {
      uid: profile.uid,
      name: profile.name,
      profileUrl: profile.profileUrl,
    },
  });
}

export async function updateUserProfile(
  uid: string,
  changes: Partial<UserProfile>,
): Promise<void> {
  const profileSnapshot = await get(ref(db, `users/${uid}`));
  const profile = profileSnapshot.val();
  if (!isUserProfile(profile)) {
    throw new Error("Unable to update profile. Please try again.");
  }
  const updatedProfile = { ...profile, ...changes };

  await update(ref(db), {
    [`users/${uid}`]: changes,
    [`publicProfiles/${uid}`]: {
      uid,
      name: updatedProfile.name,
      profileUrl: updatedProfile.profileUrl,
    },
  });
  await syncWorkspaceMemberProfile(updatedProfile);
}

export async function fetchAllUsers(): Promise<UserProfile[]> {
  const snapshot = await get(ref(db, "users"));
  const data = snapshot.val() || {};
  const list: UserProfile[] = Object.values(data).filter(isUserProfile);
  list.sort((a, b) => b.createdAt - a.createdAt);
  return list;
}

export async function findUserByEmail(
  email: string,
): Promise<UserProfile | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const users = await fetchAllUsers();
  return (
    users.find((user) => user.email.toLowerCase() === normalizedEmail) ?? null
  );
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
