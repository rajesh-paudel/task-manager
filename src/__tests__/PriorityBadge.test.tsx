import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PriorityBadge from "../components/ui/PriorityBadge";
import type { TaskPriority } from "../types/task";

const cases: Array<[TaskPriority, string, string]> = [
  ["low", "Low", "bg-slate-100"],
  ["medium", "Medium", "bg-blue-50"],
  ["high", "High", "bg-violet-50"],
  ["urgent", "Urgent", "bg-red-50"],
];

describe.each(cases)("PriorityBadge with priority %s", (priority, label, styleClass) => {
  it(`renders the "${label}" label`, () => {
    render(<PriorityBadge priority={priority} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("applies the matching style class", () => {
    render(<PriorityBadge priority={priority} />);
    expect(screen.getByText(label)).toHaveClass(styleClass);
  });
});
