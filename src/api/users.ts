import { ref, set } from "firebase/database";
import { db } from "../utils/firebaseConfig";
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