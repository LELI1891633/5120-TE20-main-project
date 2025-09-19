import { test, expect } from "@playwright/test";

test.describe("Hydration Reminder", () => {
  test("shows banner on reminder", async ({ page }) => {
    await page.goto("/healthy-you");
    await page.getByText("Hydration").click();

    // Select 2 hours (9–5) preset and start
    await page.getByRole("button", { name: /Every 2 hours/i }).click();
    await page.getByRole("button", { name: /Start reminders/i }).click();

    // Manually trigger a reminder event to simulate timing
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent("hydration:notify", { 
        detail: { message: "TEST MSG" } 
      }));
    });

    // Assert banner/modal appears
    await expect(page.getByText("TEST MSG")).toBeVisible();

    // Close
    await page.getByRole("button", { name: /Close|Got it/ }).click();
    await expect(page.getByText("TEST MSG")).toBeHidden();
  });

  test("shows modal with snooze option", async ({ page }) => {
    await page.goto("/healthy-you");
    await page.getByText("Hydration").click();

    // Start reminders
    await page.getByRole("button", { name: /Start reminders/i }).click();

    // Trigger reminder
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent("hydration:notify", { 
        detail: { message: "Modal test message" } 
      }));
    });

    // Should show modal with snooze button
    await expect(page.getByText("Modal test message")).toBeVisible();
    await expect(page.getByRole("button", { name: /Snooze 10 min/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /Got it/i })).toBeVisible();

    // Test snooze functionality
    await page.getByRole("button", { name: /Snooze 10 min/i }).click();
    await expect(page.getByText("Modal test message")).toBeHidden();
  });

  test("weekdays only option works", async ({ page }) => {
    await page.goto("/hydration-reminder");

    // Check weekdays only checkbox
    const weekdaysCheckbox = page.getByRole("checkbox", { name: /Weekdays only/i });
    await expect(weekdaysCheckbox).toBeChecked();

    // Uncheck it
    await weekdaysCheckbox.uncheck();
    await expect(weekdaysCheckbox).not.toBeChecked();

    // Check it again
    await weekdaysCheckbox.check();
    await expect(weekdaysCheckbox).toBeChecked();
  });

  test("preset buttons work correctly", async ({ page }) => {
    await page.goto("/hydration-reminder");

    // Test different presets
    await page.getByRole("button", { name: /Every 2 hours/i }).click();
    await expect(page.getByDisplayValue("120")).toBeVisible();

    await page.getByRole("button", { name: /Hourly/i }).click();
    await expect(page.getByDisplayValue("60")).toBeVisible();

    await page.getByRole("button", { name: /Every 30 min/i }).click();
    await expect(page.getByDisplayValue("30")).toBeVisible();
  });

  test("settings are saved and loaded", async ({ page }) => {
    await page.goto("/hydration-reminder");

    // Change settings
    await page.getByDisplayValue("120").fill("90");
    await page.getByDisplayValue("9").fill("8");
    await page.getByDisplayValue("17").fill("18");
    await page.getByRole("checkbox", { name: /Weekdays only/i }).uncheck();

    // Start reminders to save settings
    await page.getByRole("button", { name: /Start reminders/i }).click();

    // Reload page
    await page.reload();

    // Check if settings are preserved
    await expect(page.getByDisplayValue("90")).toBeVisible();
    await expect(page.getByDisplayValue("8")).toBeVisible();
    await expect(page.getByDisplayValue("18")).toBeVisible();
    await expect(page.getByRole("checkbox", { name: /Weekdays only/i })).not.toBeChecked();
  });

  test("keyboard navigation works in modal", async ({ page }) => {
    await page.goto("/healthy-you");
    await page.getByText("Hydration").click();
    await page.getByRole("button", { name: /Start reminders/i }).click();

    // Trigger reminder
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent("hydration:notify", { 
        detail: { message: "Keyboard test" } 
      }));
    });

    // Test Tab navigation
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // Test Escape key
    await page.keyboard.press("Escape");
    await expect(page.getByText("Keyboard test")).toBeHidden();
  });

  test("browser notifications can be enabled", async ({ page }) => {
    await page.goto("/hydration-reminder");

    // Enable notifications
    const notificationCheckbox = page.getByRole("checkbox", { name: /browser notifications/i });
    await notificationCheckbox.check();
    await expect(notificationCheckbox).toBeChecked();

    // Start reminders
    await page.getByRole("button", { name: /Start reminders/i }).click();

    // Trigger reminder (this should request notification permission)
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent("hydration:notify", { 
        detail: { message: "Notification test" } 
      }));
    });

    // Modal should still appear
    await expect(page.getByText("Notification test")).toBeVisible();
  });
});

