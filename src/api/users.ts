import { ref, set } from "firebase/database";
import { db } from "../utils/firebaseConfig";

export async function createUserProfile(
  uid: string,
  name: string,
  email: string,
): Promise<void> {
  await set(ref(db, `users/${uid}`), {
    uid,
    name,
    email,
    profileUrl: "",
    title: "",
    bio: "",
    role: "user",
    createdAt: Date.now(),
  });
}