import { test, expect } from '@playwright/test';

test('explicit pause survives focus and pointer leaving, until resumed', async ({
  page,
}) => {
  await page.clock.install();
  await page.goto('/');
  const carousel = page.locator('bl-carousel').first();
  const active = carousel.locator('.is-active');
  const initial = await active.textContent();
  await carousel.getByRole('button', { name: 'Pausar carrusel' }).click();
  await page.locator('.brand').focus();
  await page.mouse.move(1, 1);
  await page.clock.fastForward(13000);
  expect(await active.textContent()).toBe(initial);
  await carousel.getByRole('button', { name: 'Reanudar carrusel' }).click();
  await page.locator('.brand').focus();
  await page.mouse.move(1, 1);
  await page.clock.fastForward(6100);
  expect(await active.textContent()).not.toBe(initial);
});
