import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  selectAllTasks,
  selectTasksByDueDate,
  selectTasksByStatus,
  selectOverdueTasks,
  selectTaskStats,
  selectTaskById,
} from "../store/tasksSelectors";
import type { RootState } from "../store/store";
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

const makeState = (items: Record<string, Task>): RootState => ({
  auth: { userProfile: null, loading: false },
  tasks: { items, status: "synced", error: null },
});

describe("selectAllTasks", () => {
  it("returns an empty array when there are no tasks", () => {
    expect(selectAllTasks(makeState({}))).toEqual([]);
  });

  it("sorts tasks by createdAt descending (newest first)", () => {
    const state = makeState({
      a: makeTask({ id: "a", createdAt: 100 }),
      b: makeTask({ id: "b", createdAt: 300 }),
      c: makeTask({ id: "c", createdAt: 200 }),
    });
    expect(selectAllTasks(state).map((t) => t.id)).toEqual(["b", "c", "a"]);
  });
});

describe("selectTasksByDueDate", () => {
  it("sorts by due date ascending and pushes null due dates to the end", () => {
    const state = makeState({
      a: makeTask({ id: "a", dueDate: 200 }),
      b: makeTask({ id: "b", dueDate: 100 }),
      c: makeTask({ id: "c", dueDate: null }),
      d: makeTask({ id: "d", dueDate: 300 }),
    });
    expect(selectTasksByDueDate(state).map((t) => t.id)).toEqual([
      "b",
      "a",
      "d",
      "c",
    ]);
  });

  it("breaks due-date ties by newer createdAt first", () => {
    const state = makeState({
      a: makeTask({ id: "a", dueDate: 200, createdAt: 100 }),
      b: makeTask({ id: "b", dueDate: 200, createdAt: 900 }),
    });
    expect(selectTasksByDueDate(state).map((t) => t.id)).toEqual(["b", "a"]);
  });
});

describe("selectTasksByStatus", () => {
  it("filters tasks to the given status", () => {
    const state = makeState({
      a: makeTask({ id: "a", status: "todo" }),
      b: makeTask({ id: "b", status: "done" }),
      c: makeTask({ id: "c", status: "todo" }),
    });
    expect(selectTasksByStatus("todo")(state).map((t) => t.id)).toEqual([
      "a",
      "c",
    ]);
  });

  it("returns an empty array when no task has the status", () => {
    const state = makeState({
      a: makeTask({ id: "a", status: "done" }),
    });
    expect(selectTasksByStatus("in_progress")(state)).toEqual([]);
  });
});

describe("selectOverdueTasks", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 7, 5, 12, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const past = new Date(2026, 7, 4, 12, 0, 0).getTime();
  const future = new Date(2026, 7, 6, 12, 0, 0).getTime();

  it("includes unfinished tasks with a past due date", () => {
    const state = makeState({
      a: makeTask({ id: "a", status: "todo", dueDate: past }),
      b: makeTask({ id: "b", status: "in_progress", dueDate: past }),
    });
    expect(selectOverdueTasks(state).map((t) => t.id)).toEqual(["a", "b"]);
  });

  it("excludes done tasks, future due dates and missing due dates", () => {
    const state = makeState({
      a: makeTask({ id: "a", status: "done", dueDate: past, completedAt: past }),
      b: makeTask({ id: "b", status: "todo", dueDate: future }),
      c: makeTask({ id: "c", status: "todo", dueDate: null }),
    });
    expect(selectOverdueTasks(state)).toEqual([]);
  });
});

describe("selectTaskStats", () => {
  it("counts tasks by status and overdue", () => {
    const past = new Date(2026, 7, 4, 12, 0, 0).getTime();
    const state = makeState({
      a: makeTask({ id: "a", status: "todo", dueDate: past }),
      b: makeTask({ id: "b", status: "todo", dueDate: null }),
      c: makeTask({ id: "c", status: "in_progress" }),
      d: makeTask({ id: "d", status: "done", completedAt: 500 }),
      e: makeTask({ id: "e", status: "done", completedAt: 600 }),
    });
    expect(selectTaskStats(state)).toEqual({
      total: 5,
      todo: 2,
      inProgress: 1,
      done: 2,
      overdue: 1,
    });
  });
});

describe("selectTaskById", () => {
  it("returns the task with the given id", () => {
    const task = makeTask({ id: "x", title: "Ship it" });
    const state = makeState({ x: task });
    expect(selectTaskById("x")(state)).toEqual(task);
  });

  it("returns undefined for an unknown id", () => {
    expect(selectTaskById("missing")(makeState({}))).toBeUndefined();
  });
});
