import { test, expect } from '@playwright/test';

const routes = [
  '/',
  '/metodologia/',
  '/nosotros/faqs/',
  '/consultoriaagil/',
  '/servicios/entrenamiento/',
  '/sectores/representantes/',
  '/casos/',
  '/blog/',
];
for (const route of routes) {
  for (const width of [390, 768, 1280]) {
    test(`page is available: ${route} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('header nav')).toHaveCount(1);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    });
  }
}
