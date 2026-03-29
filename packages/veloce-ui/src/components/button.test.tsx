import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button, buttonVariants } from "./button";

describe("Button component", () => {
  it("renders a button element", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it("applies default variant", () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-primary");
  });

  it("applies different variants", () => {
    const { rerender } = render(
      <Button variant="destructive">Destructive</Button>,
    );
    expect(screen.getByRole("button")).toHaveClass(/bg-destructive/);

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button")).toHaveClass("border");

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button")).toHaveClass(/bg-secondary/);

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole("button")).toHaveClass("hover:bg-white/10");

    rerender(<Button variant="link">Link</Button>);
    expect(screen.getByRole("button")).toHaveClass("underline-offset-4");
  });

  it("applies different sizes", () => {
    const { rerender } = render(<Button size="default">Default Size</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-9");

    rerender(<Button size="xs">XS</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-6");

    rerender(<Button size="sm">SM</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-8");

    rerender(<Button size="lg">LG</Button>);
    expect(screen.getByRole("button")).toHaveClass("h-10");

    rerender(<Button size="icon">Icon</Button>);
    expect(screen.getByRole("button")).toHaveClass("size-9");
  });

  it("handles click events", async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await userEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("can be disabled", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("can be rendered as a child component via asChild", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>,
    );
    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveClass("inline-flex");
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Custom</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });
});

describe("buttonVariants", () => {
  it("returns default classes", () => {
    const classes = buttonVariants({});
    expect(classes).toContain("inline-flex");
    expect(classes).toContain("items-center");
  });

  it("returns variant classes", () => {
    expect(buttonVariants({ variant: "default" })).toContain("bg-primary");
    expect(buttonVariants({ variant: "destructive" })).toContain(
      "bg-destructive",
    );
    expect(buttonVariants({ variant: "outline" })).toContain("border");
    expect(buttonVariants({ variant: "secondary" })).toContain("bg-secondary");
    expect(buttonVariants({ variant: "ghost" })).toContain("hover:bg-white/10");
    expect(buttonVariants({ variant: "link" })).toContain("underline-offset-4");
  });

  it("returns size classes", () => {
    expect(buttonVariants({ size: "default" })).toContain("h-9");
    expect(buttonVariants({ size: "xs" })).toContain("h-6");
    expect(buttonVariants({ size: "sm" })).toContain("h-8");
    expect(buttonVariants({ size: "lg" })).toContain("h-10");
    expect(buttonVariants({ size: "icon" })).toContain("size-9");
    expect(buttonVariants({ size: "icon-xs" })).toContain("size-6");
    expect(buttonVariants({ size: "icon-sm" })).toContain("size-8");
    expect(buttonVariants({ size: "icon-lg" })).toContain("size-10");
  });
});
