import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Dashboard } from "./Dashboard";

function renderDashboardAtRoute(initialEntry = "/") {
  const router = createMemoryRouter(
    [
      { path: "/", element: <Dashboard /> },
      { path: "/dashboard", element: <Dashboard /> },
    ],
    { initialEntries: [initialEntry] }
  );
  return render(<RouterProvider router={router} />);
}

test("App mounts without crashing", () => {
  renderDashboardAtRoute();
  const headings = screen.getAllByRole("heading", { level: 1 });
  expect(headings.length).toBeGreaterThan(0);
  expect(headings[0].textContent).toMatch(/dco dashboard/i);
});

test("header shows DCO Dashboard and theme toggle only (no gear/settings)", () => {
  const { container } = renderDashboardAtRoute();
  const main = within(container).getAllByRole("main")[0];
  expect(within(main).getByRole("heading", { name: /dco dashboard/i })).toBeDefined();
  const runButton = within(main).getByRole("button", { name: /^run$/i });
  const buttons = within(main).getAllByRole("button");
  const themeToggle = buttons.find((b) => b !== runButton);
  expect(themeToggle).toBeDefined();
  expect(within(main).queryByRole("button", { name: /settings|gear/i })).toBeNull();
});

test("query input has placeholder Enter a query... and Run button", () => {
  const { container } = renderDashboardAtRoute();
  const main = within(container).getAllByRole("main")[0];
  const input = within(main).getByRole("textbox", { name: /query input/i });
  expect(input.getAttribute("placeholder")).toBe("Enter a query...");
  expect(within(main).getByRole("button", { name: /^run$/i })).toBeDefined();
});

test("trace history shows label and list items with short ID and query", async () => {
  const { container } = renderDashboardAtRoute();
  const main = within(container).getAllByRole("main")[0];
  expect(within(main).getByText("Trace history")).toBeDefined();
  const input = within(main).getByRole("textbox", { name: /query input/i });
  fireEvent.change(input, { target: { value: "What is the refund policy?" } });
  fireEvent.click(within(main).getByRole("button", { name: /^run$/i }));
  const queryText = await within(main).findByText("What is the refund policy?");
  expect(queryText).toBeDefined();
  const listButton = queryText.closest("button");
  expect(listButton).toBeDefined();
  expect(listButton?.classList.contains("bg-accent/15")).toBe(true);
  const idSpan = listButton?.querySelector(".text-accent.font-mono");
  expect(idSpan?.textContent?.length).toBeGreaterThan(0);
});

test("trace list shows model badge for each trace when model is available", async () => {
  const { container } = renderDashboardAtRoute();
  const main = within(container).getAllByRole("main")[0];
  const input = within(main).getByRole("textbox", { name: /query input/i });
  fireEvent.change(input, { target: { value: "What is the refund policy?" } });
  fireEvent.click(within(main).getByRole("button", { name: /^run$/i }));
  await within(main).findByText("What is the refund policy?");
  expect(within(main).getByText("Llama 3.1")).toBeDefined();
});
