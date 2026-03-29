import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

describe("Tabs component", () => {
  it("renders the default active tab content", () => {
    render(
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Account content</TabsContent>
        <TabsContent value="password">Password content</TabsContent>
      </Tabs>,
    );

    expect(screen.getByRole("tab", { name: /account/i })).toHaveAttribute(
      "data-state",
      "active",
    );
    expect(screen.getByText("Account content")).toBeVisible();
    expect(screen.queryByText("Password content")).not.toBeInTheDocument();
  });

  it("switches content when a different tab is selected", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Account content</TabsContent>
        <TabsContent value="password">Password content</TabsContent>
      </Tabs>,
    );

    await user.click(screen.getByRole("tab", { name: /password/i }));

    expect(screen.getByRole("tab", { name: /password/i })).toHaveAttribute(
      "data-state",
      "active",
    );
    expect(screen.getByText("Password content")).toBeVisible();
    expect(screen.queryByText("Account content")).not.toBeInTheDocument();
  });

  it("renders TabsList with default styling", () => {
    render(
      <Tabs defaultValue="account">
        <TabsList data-testid="tabs-list">
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Account content</TabsContent>
      </Tabs>,
    );

    expect(screen.getByTestId("tabs-list")).toBeVisible();
    expect(screen.getByTestId("tabs-list")).toHaveClass("bg-muted");
    expect(screen.getByRole("tab", { name: /account/i })).toHaveAttribute(
      "data-state",
      "active",
    );
  });
});
