import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  startOfDay,
  getDueLabel,
  isOverdue,
  getWeeklyCompletionCounts,
} from "../utils/dateHelpers";
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

describe("startOfDay", () => {
  it("strips hours, minutes, seconds and milliseconds", () => {
    const result = startOfDay(new Date(2026, 7, 5, 10, 30, 45, 123));
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
    expect(result.getMilliseconds()).toBe(0);
  });

  it("keeps the same date", () => {
    const result = startOfDay(new Date(2026, 7, 5, 10, 30));
    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(7);
    expect(result.getDate()).toBe(5);
  });
});

describe("getDueLabel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 7, 5, 12, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const atNoon = (dayOffset: number) => {
    const d = new Date(2026, 7, 5, 12, 0, 0);
    d.setDate(d.getDate() + dayOffset);
    return d.getTime();
  };

  it("returns null for null or undefined due dates", () => {
    expect(getDueLabel(null)).toBeNull();
    expect(getDueLabel(undefined)).toBeNull();
  });

  it('returns "Today" for a due date today', () => {
    expect(getDueLabel(atNoon(0))).toBe("Today");
  });

  it('returns "Tomorrow" for a due date tomorrow', () => {
    expect(getDueLabel(atNoon(1))).toBe("Tomorrow");
  });

  it('returns "Overdue" for a due date in the past', () => {
    expect(getDueLabel(atNoon(-1))).toBe("Overdue");
    expect(getDueLabel(atNoon(-5))).toBe("Overdue");
  });

  it("returns the weekday label for due dates within 6 days", () => {
    const inTwoDays = atNoon(2);
    const expected = new Date(inTwoDays).toLocaleDateString(undefined, {
      weekday: "short",
    });
    expect(getDueLabel(inTwoDays)).toBe(expected);
  });

  it("returns the weekday label exactly 6 days out", () => {
    const inSixDays = atNoon(6);
    const expected = new Date(inSixDays).toLocaleDateString(undefined, {
      weekday: "short",
    });
    expect(getDueLabel(inSixDays)).toBe(expected);
  });

  it("returns a short month/day label for due dates beyond 6 days", () => {
    const inEightDays = atNoon(8);
    const expected = new Date(inEightDays).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
    expect(getDueLabel(inEightDays)).toBe(expected);
  });
});

describe("isOverdue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 7, 5, 12, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const pastDue = new Date(2026, 7, 4, 12, 0, 0).getTime();
  const futureDue = new Date(2026, 7, 6, 12, 0, 0).getTime();

  it("returns true for a todo task with a past due date", () => {
    expect(isOverdue(makeTask({ status: "todo", dueDate: pastDue }))).toBe(true);
  });

  it("returns true for an in_progress task with a past due date", () => {
    expect(
      isOverdue(makeTask({ status: "in_progress", dueDate: pastDue })),
    ).toBe(true);
  });

  it("returns false for a done task with a past due date", () => {
    expect(
      isOverdue(
        makeTask({
          status: "done",
          dueDate: pastDue,
          completedAt: pastDue,
        }),
      ),
    ).toBe(false);
  });

  it("returns false when there is no due date", () => {
    expect(isOverdue(makeTask())).toBe(false);
  });

  it("returns false for a future due date", () => {
    expect(isOverdue(makeTask({ dueDate: futureDue }))).toBe(false);
  });
});

describe("getWeeklyCompletionCounts", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 7, 5, 12, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const daysAgo = (days: number) => {
    const d = new Date(2026, 7, 5, 9, 0, 0);
    d.setDate(d.getDate() - days);
    return d.getTime();
  };

  it("returns 7 buckets with zero completions for an empty list", () => {
    const result = getWeeklyCompletionCounts([]);
    expect(result).toHaveLength(7);
    result.forEach((bucket) => expect(bucket.completed).toBe(0));
  });

  it("counts a task completed today in the last bucket", () => {
    const result = getWeeklyCompletionCounts([
      makeTask({ status: "done", completedAt: daysAgo(0) }),
    ]);
    expect(result[6].completed).toBe(1);
  });

  it("counts a task completed 3 days ago in the right bucket", () => {
    const result = getWeeklyCompletionCounts([
      makeTask({ status: "done", completedAt: daysAgo(3) }),
    ]);
    expect(result[3].completed).toBe(1);
  });

  it("ignores completions older than 7 days", () => {
    const result = getWeeklyCompletionCounts([
      makeTask({ status: "done", completedAt: daysAgo(8) }),
    ]);
    result.forEach((bucket) => expect(bucket.completed).toBe(0));
  });

  it("ignores done tasks without a completedAt timestamp", () => {
    const result = getWeeklyCompletionCounts([
      makeTask({ status: "done", completedAt: null }),
    ]);
    result.forEach((bucket) => expect(bucket.completed).toBe(0));
  });

  it("ignores unfinished tasks", () => {
    const result = getWeeklyCompletionCounts([
      makeTask({ status: "todo", completedAt: daysAgo(0) }),
      makeTask({ status: "in_progress", completedAt: daysAgo(1) }),
    ]);
    result.forEach((bucket) => expect(bucket.completed).toBe(0));
  });

  it("sums multiple completions on the same day", () => {
    const result = getWeeklyCompletionCounts([
      makeTask({ id: "a", status: "done", completedAt: daysAgo(0) }),
      makeTask({ id: "b", status: "done", completedAt: daysAgo(0) }),
      makeTask({ id: "c", status: "done", completedAt: daysAgo(1) }),
    ]);
    expect(result[6].completed).toBe(2);
    expect(result[5].completed).toBe(1);
  });
});
