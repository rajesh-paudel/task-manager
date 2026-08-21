import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToastProvider } from "../components/ui/Toast";
import { useToast } from "../context/useToast";

function ToastTrigger() {
  const { showToast } = useToast();
  return (
    <button onClick={() => showToast("Task saved")}>Trigger toast</button>
  );
}

function ErrorToastTrigger() {
  const { showToast } = useToast();
  return (
    <button onClick={() => showToast("Task failed", "error")}>
      Trigger error
    </button>
  );
}

describe("ToastProvider", () => {
  it("renders a toast when showToast is called", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <ToastTrigger />
      </ToastProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Trigger toast" }));
    expect(await screen.findByText("Task saved")).toBeInTheDocument();
  });

  it("uses theme-aware toast surface classes", async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <ErrorToastTrigger />
      </ToastProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Trigger error" }));
    expect(await screen.findByRole("status")).toHaveClass(
      "bg-white",
      "dark:bg-[#0f172a]",
      "dark:text-white",
    );
  });

  it("throws when useToast is used outside the provider", () => {
    expect(() => render(<ToastTrigger />)).toThrow(
      "useToast must be used within a ToastProvider",
    );
  });
});
