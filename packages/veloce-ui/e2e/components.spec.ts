import { test, expect } from "@playwright/test";

/**
 * E2E tests for veloce-ui components
 * These tests run against Storybook in view mode
 */

test.describe("Button Component", () => {
  test("renders button correctly", async ({ page }) => {
    await page.goto("/?path=/story/components-button--default");
    await page.waitForSelector("button");
    const button = page.locator("button").first();
    await expect(button).toBeVisible();
  });

  test("button can be clicked", async ({ page }) => {
    await page.goto("/?path=/story/components-button--default");
    await page.waitForSelector("button");
    const button = page.locator("button").first();
    await button.click();
  });
});

test.describe("Input Component", () => {
  test("renders input field", async ({ page }) => {
    await page.goto("/?path=/story/components-input--default");
    await page.waitForSelector("input");
    const input = page.locator("input").first();
    await expect(input).toBeVisible();
  });

  test("accepts text input", async ({ page }) => {
    await page.goto("/?path=/story/components-input--default");
    await page.waitForSelector("input");
    const input = page.locator("input").first();
    await input.fill("Hello World");
    await expect(input).toHaveValue("Hello World");
  });
});

test.describe("Dialog Component", () => {
  test("renders dialog trigger", async ({ page }) => {
    await page.goto("/?path=/story/components-dialog--default");
    await page.waitForSelector("button");
    const trigger = page.locator("button").first();
    await expect(trigger).toBeVisible();
  });
});

test.describe("Accessibility Tests", () => {
  test("buttons are keyboard accessible", async ({ page }) => {
    await page.goto("/?path=/story/components-button--default");
    await page.waitForSelector("button");
    const button = page.locator("button").first();
    await button.focus();
    await expect(button).toBeFocused();
  });

  test("inputs are keyboard accessible", async ({ page }) => {
    await page.goto("/?path=/story/components-input--default");
    await page.waitForSelector("input");
    const input = page.locator("input").first();
    await input.focus();
    await expect(input).toBeFocused();
  });
});
