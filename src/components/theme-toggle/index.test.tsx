import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { ThemeToggle } from "./index";

test("ThemeToggle renders a single toggle control visible to the user", () => {
  render(<ThemeToggle />);
  const toggle = screen.getByRole("button", {
    name: /switch to (light|dark) theme/i,
  });
  expect(toggle).toBeDefined();
});

test("ThemeToggle is the only button in the component", () => {
  const { container } = render(<ThemeToggle />);
  const buttons = container.querySelectorAll("button");
  expect(buttons.length).toBe(1);
});
