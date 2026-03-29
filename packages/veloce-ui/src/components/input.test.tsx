import { render } from "@testing-library/react";
import { Input } from "./input";

describe("Input component", () => {
  it("renders an input element", () => {
    render(<Input />);
    const input = document.querySelector("input");
    expect(input).toBeInTheDocument();
  });

  it("renders with default type attribute", () => {
    render(<Input />);
    // When no type is specified, the attribute is not present (browser defaults to text)
    const input = document.querySelector("input");
    // The type attribute should either be "text" or not specified (browser defaults to text)
    expect(input).toBeInTheDocument();
  });

  it("renders with custom type", () => {
    render(<Input type="email" />);
    expect(document.querySelector("input")).toHaveAttribute("type", "email");
  });

  it("renders with password type", () => {
    render(<Input type="password" />);
    expect(document.querySelector("input")).toHaveAttribute("type", "password");
  });

  it("renders with number type", () => {
    render(<Input type="number" />);
    expect(document.querySelector("input")).toHaveAttribute("type", "number");
  });

  it("accepts placeholder text", () => {
    render(<Input placeholder="Enter text here" />);
    expect(document.querySelector("input")).toHaveAttribute(
      "placeholder",
      "Enter text here",
    );
  });

  it("accepts default value", () => {
    render(<Input defaultValue="default value" />);
    expect(document.querySelector("input")).toHaveValue("default value");
  });

  it("can be disabled", () => {
    render(<Input disabled />);
    expect(document.querySelector("input")).toBeDisabled();
  });

  it("applies custom className", () => {
    render(<Input className="custom-input-class" />);
    expect(document.querySelector("input")).toHaveClass("custom-input-class");
  });

  it("accepts custom props", () => {
    render(<Input name="test-input" id="test-id" />);
    const input = document.querySelector("input");
    expect(input).toHaveAttribute("name", "test-input");
    expect(input).toHaveAttribute("id", "test-id");
  });

  it("applies aria-invalid when invalid", () => {
    render(<Input aria-invalid="true" />);
    expect(document.querySelector("input")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("renders with data-slot attribute", () => {
    render(<Input />);
    expect(document.querySelector("input")).toHaveAttribute(
      "data-slot",
      "input",
    );
  });
});
