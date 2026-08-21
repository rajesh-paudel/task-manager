import { describe, expect, it } from "vitest";
import reducer, {
  tasksCleared,
  tasksLoading,
  tasksReceived,
} from "../store/taskSlice";
import type { Task } from "../types/task";

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: "t1",
  title: "Plan launch",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: null,
  createdAt: 1000,
  updatedAt: 1000,
  completedAt: null,
  ...overrides,
});

describe("taskSlice", () => {
  it("tracks which task source is currently loading", () => {
    const state = reducer(undefined, tasksLoading("workspace:w1"));

    expect(state.items).toEqual({});
    expect(state.sourceKey).toBe("workspace:w1");
    expect(state.status).toBe("loading");
  });

  it("stores tasks for the active source", () => {
    const task = makeTask({
      assigneeId: "u2",
      assigneeName: "Maya Shrestha",
    });
    const state = reducer(
      undefined,
      tasksReceived({ items: { t1: task }, sourceKey: "personal:u1" }),
    );

    expect(state.items.t1).toEqual(task);
    expect(state.items.t1?.assigneeName).toBe("Maya Shrestha");
    expect(state.sourceKey).toBe("personal:u1");
    expect(state.status).toBe("synced");
  });

  it("clears tasks and source on logout", () => {
    const current = reducer(
      undefined,
      tasksReceived({ items: { t1: makeTask() }, sourceKey: "personal:u1" }),
    );
    const state = reducer(current, tasksCleared());

    expect(state.items).toEqual({});
    expect(state.sourceKey).toBeNull();
    expect(state.status).toBe("idle");
  });
});
