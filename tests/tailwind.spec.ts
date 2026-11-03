import { test, expect } from '@playwright/test';

test('shared Tailwind utilities and local fonts work before opening the diagnostic', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('body')).toHaveCSS('color', 'rgb(7, 21, 45)');
  await expect(page.locator('.site-header')).toHaveCSS('position', 'sticky');
  await expect(page.locator('link[href*="fonts.googleapis.com"]')).toHaveCount(
    0,
  );
  const before = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue(
      '--color-black',
    ),
  );
  await page
    .getByRole('link', { name: 'Consultoría gratuita', exact: true })
    .click();
  await expect(page.getByRole('dialog')).toBeVisible();
  const separator = page.getByRole('dialog').locator('.border-b');
  const border = await separator.evaluate(
    (e) => getComputedStyle(e).borderBottomColor,
  );
  expect(border).not.toBe('rgb(220, 228, 241)');
  await page.keyboard.press('Escape');
  expect(
    await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue(
        '--color-black',
      ),
    ),
  ).toBe(before);
});
