import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ModelBadge } from "./index";

describe("ModelBadge", () => {
  it("shows compact model label when model is provided", () => {
    render(<ModelBadge model="Llama 3.1 8B" />);
    expect(screen.getByText("Llama 3.1")).toBeDefined();
    expect(screen.getByTitle("Llama 3.1 8B")).toBeDefined();
  });

  it("shows provider label when provider is provided and model is absent", () => {
    render(<ModelBadge provider="groq" />);
    expect(screen.getByText("Groq")).toBeDefined();
  });

  it("renders nothing when both model and provider are absent", () => {
    const { container } = render(<ModelBadge />);
    expect(container.firstChild).toBeNull();
  });

  it("prefers model over provider when both are provided", () => {
    render(<ModelBadge model="Claude 3.5 Sonnet" provider="anthropic" />);
    expect(screen.getByText("Claude 3.5")).toBeDefined();
  });
});
