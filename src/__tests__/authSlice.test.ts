import { describe, expect, it } from "vitest";
import reducer, {
  setProfile,
  clearProfile,
  setAuthLoading,
} from "../store/authSlice";
import type { UserProfile } from "../types/user";

const makeProfile = (overrides: Partial<UserProfile> = {}): UserProfile => ({
  uid: "u1",
  name: "Rajesh Paudel",
  email: "rajesh@example.com",
  profileUrl: "https://example.com/avatar.png",
  title: "Developer",
  bio: "Builds things",
  role: "user",
  createdAt: 1000,
  ...overrides,
});

describe("authSlice", () => {
  it("has loading true and no profile initially", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual({
      userProfile: null,
      loading: true,
    });
  });

  it("setProfile stores the profile and stops loading", () => {
    const profile = makeProfile();
    const state = reducer(undefined, setProfile(profile));
    expect(state.userProfile).toEqual(profile);
    expect(state.loading).toBe(false);
  });

  it("setProfile(null) clears the profile and stops loading", () => {
    const state = reducer(
      { userProfile: makeProfile(), loading: false },
      setProfile(null),
    );
    expect(state.userProfile).toBeNull();
    expect(state.loading).toBe(false);
  });

  it("clearProfile logs the user out", () => {
    const state = reducer(
      { userProfile: makeProfile(), loading: false },
      clearProfile(),
    );
    expect(state.userProfile).toBeNull();
    expect(state.loading).toBe(false);
  });

  it("setAuthLoading(true) marks loading without touching the profile", () => {
    const profile = makeProfile();
    const state = reducer(
      { userProfile: profile, loading: false },
      setAuthLoading(true),
    );
    expect(state.loading).toBe(true);
    expect(state.userProfile).toEqual(profile);
  });

  it("setAuthLoading(false) stops loading", () => {
    const state = reducer(
      { userProfile: null, loading: true },
      setAuthLoading(false),
    );
    expect(state.loading).toBe(false);
  });

  it("handles a login -> logout sequence", () => {
    let state = reducer(undefined, setProfile(makeProfile({ role: "admin" })));
    expect(state.userProfile?.role).toBe("admin");
    expect(state.loading).toBe(false);

    state = reducer(state, clearProfile());
    expect(state.userProfile).toBeNull();
  });
});
