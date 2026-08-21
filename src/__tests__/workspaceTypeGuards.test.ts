import { describe, expect, it } from "vitest";
import {
  isUserWorkspace,
  isWorkspace,
  isWorkspaceMember,
} from "../utils/typeGuards";

describe("workspace type guards", () => {
  it("accepts valid workspace records", () => {
    expect(
      isWorkspace({
        id: "w1",
        name: "Product Team",
        description: "",
        ownerId: "u1",
        createdAt: 1000,
        updatedAt: 1000,
      }),
    ).toBe(true);
  });

  it("rejects invalid workspace records", () => {
    expect(
      isWorkspace({
        id: "w1",
        name: "",
        description: "",
        ownerId: "u1",
        createdAt: 1000,
        updatedAt: 1000,
      }),
    ).toBe(false);
  });

  it("accepts valid workspace member records", () => {
    expect(
      isWorkspaceMember({
        uid: "u1",
        name: "Rajesh Paudel",
        email: "rajesh@example.com",
        role: "owner",
        joinedAt: 1000,
      }),
    ).toBe(true);
  });

  it("rejects invalid workspace roles", () => {
    expect(
      isUserWorkspace({
        workspaceId: "w1",
        role: "viewer",
        joinedAt: 1000,
      }),
    ).toBe(false);
  });
});
