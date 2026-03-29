import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "./card";

describe("Card component", () => {
  it("renders a card element", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Card className="custom-card-class">Content</Card>);
    expect(screen.getByText("Content")).toHaveClass("custom-card-class");
  });

  it("renders with data-slot attribute", () => {
    render(<Card>Content</Card>);
    expect(screen.getByText("Content")).toHaveAttribute("data-slot", "card");
  });
});

describe("CardHeader component", () => {
  it("renders card header", () => {
    render(<CardHeader>Header content</CardHeader>);
    expect(screen.getByText("Header content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<CardHeader className="custom-header-class">Header</CardHeader>);
    expect(screen.getByText("Header")).toHaveClass("custom-header-class");
  });

  it("renders with data-slot attribute", () => {
    render(<CardHeader>Header</CardHeader>);
    expect(screen.getByText("Header")).toHaveAttribute(
      "data-slot",
      "card-header",
    );
  });
});

describe("CardTitle component", () => {
  it("renders card title", () => {
    render(<CardTitle>Title</CardTitle>);
    expect(screen.getByText("Title")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<CardTitle className="custom-title-class">Title</CardTitle>);
    expect(screen.getByText("Title")).toHaveClass("custom-title-class");
  });

  it("renders with data-slot attribute", () => {
    render(<CardTitle>Title</CardTitle>);
    expect(screen.getByText("Title")).toHaveAttribute(
      "data-slot",
      "card-title",
    );
  });
});

describe("CardDescription component", () => {
  it("renders card description", () => {
    render(<CardDescription>Description</CardDescription>);
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <CardDescription className="custom-desc-class">
        Description
      </CardDescription>,
    );
    expect(screen.getByText("Description")).toHaveClass("custom-desc-class");
  });

  it("renders with data-slot attribute", () => {
    render(<CardDescription>Description</CardDescription>);
    expect(screen.getByText("Description")).toHaveAttribute(
      "data-slot",
      "card-description",
    );
  });
});

describe("CardContent component", () => {
  it("renders card content", () => {
    render(<CardContent>Content</CardContent>);
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<CardContent className="custom-content-class">Content</CardContent>);
    expect(screen.getByText("Content")).toHaveClass("custom-content-class");
  });

  it("renders with data-slot attribute", () => {
    render(<CardContent>Content</CardContent>);
    expect(screen.getByText("Content")).toHaveAttribute(
      "data-slot",
      "card-content",
    );
  });
});

describe("CardFooter component", () => {
  it("renders card footer", () => {
    render(<CardFooter>Footer</CardFooter>);
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<CardFooter className="custom-footer-class">Footer</CardFooter>);
    expect(screen.getByText("Footer")).toHaveClass("custom-footer-class");
  });

  it("renders with data-slot attribute", () => {
    render(<CardFooter>Footer</CardFooter>);
    expect(screen.getByText("Footer")).toHaveAttribute(
      "data-slot",
      "card-footer",
    );
  });
});

describe("CardAction component", () => {
  it("renders card action", () => {
    render(<CardAction>Action</CardAction>);
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<CardAction className="custom-action-class">Action</CardAction>);
    expect(screen.getByText("Action")).toHaveClass("custom-action-class");
  });

  it("renders with data-slot attribute", () => {
    render(<CardAction>Action</CardAction>);
    expect(screen.getByText("Action")).toHaveAttribute(
      "data-slot",
      "card-action",
    );
  });
});
