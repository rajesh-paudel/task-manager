export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  profileUrl: string;
  title: string;
  bio: string;
  role: "admin" | "user";
  createdAt: number;
}
