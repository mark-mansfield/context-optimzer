import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { App } from "./App";

test("App mounts without crashing", () => {
  render(<App />);
  expect(screen.getByRole("heading", { level: 1 })).toBeDefined();
});
