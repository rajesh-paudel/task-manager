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

  it("throws when useToast is used outside the provider", () => {
    expect(() => render(<ToastTrigger />)).toThrow(
      "useToast must be used within a ToastProvider",
    );
  });
});
