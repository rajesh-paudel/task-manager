import { describe, expect, it } from "vitest";
import reducer, {
  tasksReceived,
  tasksLoading,
  tasksError,
  tasksCleared,
} from "../store/taskSlice";
import type { Task } from "../types/task";

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: "t1",
  title: "Test task",
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
  it("has the expected initial state", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual({
      items: {},
      status: "idle",
      error: null,
    });
  });

  it("tasksReceived replaces items and sets status to synced", () => {
    const items = { a: makeTask({ id: "a" }), b: makeTask({ id: "b" }) };
    const state = reducer(undefined, tasksReceived(items));
    expect(state.items).toEqual(items);
    expect(state.status).toBe("synced");
    expect(state.error).toBeNull();
  });

  it("tasksReceived with an empty record clears items but stays synced", () => {
    const state = reducer(
      { items: { a: makeTask() }, status: "synced", error: null },
      tasksReceived({}),
    );
    expect(state.items).toEqual({});
    expect(state.status).toBe("synced");
  });

  it("tasksLoading sets status to loading", () => {
    const state = reducer(undefined, tasksLoading());
    expect(state.status).toBe("loading");
  });

  it("tasksError sets status to error and stores the message", () => {
    const state = reducer(undefined, tasksError("Database unavailable"));
    expect(state.status).toBe("error");
    expect(state.error).toBe("Database unavailable");
  });

  it("tasksError keeps previously received items", () => {
    const state = reducer(
      { items: { a: makeTask() }, status: "synced", error: null },
      tasksError("Connection lost"),
    );
    expect(state.items).toEqual({ a: makeTask() });
    expect(state.status).toBe("error");
  });

  it("tasksCleared resets the slice to its initial state", () => {
    const state = reducer(
      {
        items: { a: makeTask() },
        status: "error",
        error: "Connection lost",
      },
      tasksCleared(),
    );
    expect(state).toEqual({ items: {}, status: "idle", error: null });
  });

  it("handles a full lifecycle sequence", () => {
    let state = reducer(undefined, tasksLoading());
    expect(state.status).toBe("loading");

    state = reducer(state, tasksReceived({ a: makeTask() }));
    expect(state.status).toBe("synced");

    state = reducer(state, tasksError("boom"));
    expect(state.status).toBe("error");

    state = reducer(state, tasksCleared());
    expect(state).toEqual({ items: {}, status: "idle", error: null });
  });
});
