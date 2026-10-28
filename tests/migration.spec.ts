import { test, expect } from '@playwright/test';
import { pages } from '../src/data/pages';

for (const meta of Object.values(pages)) {
  test(`semantic and resource contract: ${meta.path}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(meta.path);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://business-lab.net${meta.path}`,
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      meta.description,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      `https://business-lab.net${meta.path}`,
    );
    const audit = await page.evaluate(async () => {
      await document.fonts.ready;
      const ids = [...document.querySelectorAll('[id]')].map((e) => e.id);
      const links = [
        ...document.querySelectorAll<HTMLAnchorElement>('a[href]'),
      ].filter(
        (a) =>
          !a.textContent?.trim() &&
          !a.getAttribute('aria-label') &&
          !a.getAttribute('aria-labelledby') &&
          !a.querySelector('img[alt]:not([alt=""])'),
      );
      const broken = [...document.images]
        .filter((img) => img.complete && !img.naturalWidth)
        .map((img) => img.src);
      const legacy = [...document.querySelectorAll('[class]')].filter((e) =>
        /\b(?:et_|et-|dipl_|wp-)/.test(e.className),
      );
      const styles = performance
        .getEntriesByType('resource')
        .filter((e) => e.name.endsWith('.css')) as PerformanceResourceTiming[];
      const inline = [...document.querySelectorAll('style')].reduce(
        (size, e) => size + e.textContent!.length,
        0,
      );
      return {
        duplicateIds: ids.filter((id, i) => ids.indexOf(id) !== i),
        unnamedLinks: links.length,
        missingAlt: document.querySelectorAll('img:not([alt])').length,
        missingSrcset: document.querySelectorAll('img:not([srcset])').length,
        broken,
        legacy: legacy.length,
        cssBytes: styles.reduce((sum, s) => sum + s.decodedBodySize, inline),
      };
    });
    expect(audit.duplicateIds).toEqual([]);
    expect(audit.unnamedLinks).toBe(0);
    expect(audit.missingAlt).toBe(0);
    expect(audit.missingSrcset).toBe(0);
    expect(audit.broken).toEqual([]);
    expect(audit.legacy).toBe(0);
    expect(audit.cssBytes).toBeLessThanOrEqual(60000);
    for (const metric of await page.locator('.metric').all()) {
      await expect(metric).toHaveCSS('opacity', '1');
    }
    expect(errors).toEqual([]);
  });
}

test('existing article fragment links remain unique and available', async ({
  page,
}) => {
  await page.goto('/casos/#institucion-educativa');
  await expect(page.locator('#institucion-educativa')).toHaveCount(1);
  await expect(page.locator('#institucion-educativa')).toContainText(
    'Institucion Educativa',
  );
  await page.goto('/blog/#porque-tu-empresa-b2b-no-esta-creciendo');
  await expect(
    page.locator('#porque-tu-empresa-b2b-no-esta-creciendo'),
  ).toHaveCount(1);
});

test('mobile menu opens and Escape returns focus', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto('/');
  const toggle = page.locator('.menu-toggle');
  await toggle.click();
  await expect(
    page.getByRole('navigation', { name: 'Navegación principal' }),
  ).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
});

test('FAQ supports keyboard and multiple open answers', async ({ page }) => {
  await page.goto('/nosotros/faqs/');
  const summaries = page.locator('summary');
  await summaries.nth(1).focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('details').nth(1)).toHaveAttribute('open', '');
  await expect(page.locator('details').first()).toHaveAttribute('open', '');
});

test('benefit details can be revealed with keyboard focus', async ({
  page,
}) => {
  await page.goto('/metodologia/');
  const benefit = page.getByRole('group', {
    name: 'Ventas predecibles, no esporádicas',
  });
  await benefit.focus();
  await expect(benefit).toBeFocused();
  await expect(benefit.locator('.benefit-back')).toHaveCSS(
    'transform',
    'matrix(1, 0, 0, 1, 0, 0)',
  );
});

test('newsletter prepares an email without claiming it was sent', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByLabel('Correo Electrónico').fill('prueba@example.com');
  await page.getByRole('button', { name: 'Suscríbete' }).click();
  await expect(page.locator('#newsletter-mail')).toHaveAttribute(
    'href',
    /mailto:.*prueba%40example.com/,
  );
  await expect(page.locator('#newsletter-status')).toContainText(
    'aún no se ha enviado',
  );
});

test('carousel stays stopped while focus remains inside after mouseleave', async ({
  page,
}) => {
  await page.clock.install();
  await page.goto('/');
  const carousel = page.locator('bl-carousel').first();
  await expect(carousel).toHaveAttribute('data-ready', '');
  await page.clock.fastForward(6100);
  const before = await carousel.locator('.is-active').textContent();
  await carousel.locator('[data-next]').focus();
  await page.mouse.move(100, 100);
  await page.mouse.move(1, 1);
  await page.clock.fastForward(13000);
  expect(await carousel.locator('.is-active').textContent()).toBe(before);
  await page.locator('.brand').focus();
  await page.clock.fastForward(6100);
  expect(await carousel.locator('.is-active').textContent()).not.toBe(before);
});

test('reduced motion disables automatic rotation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.install();
  await page.goto('/');
  const carousel = page.locator('bl-carousel').first();
  const before = await carousel.locator('.is-active').textContent();
  await page.clock.fastForward(13000);
  expect(await carousel.locator('.is-active').textContent()).toBe(before);
});

test('mobile navigation, slides and FAQ remain available without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 900 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4325/');
  await expect(
    page.getByRole('navigation', { name: 'Navegación principal' }),
  ).toBeVisible();
  await expect(page.locator('[data-carousel-slide]').first()).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Solicitar suscripción por correo' }),
  ).toBeVisible();
  await page.goto('http://127.0.0.1:4325/nosotros/faqs/');
  await page.locator('summary').nth(1).click();
  await expect(page.locator('details').nth(1)).toHaveAttribute('open', '');
  await context.close();
});

test('CTA works inside Layout without a page stylesheet', async ({ page }) => {
  await page.goto('http://127.0.0.1:4326/');
  const cta = page.locator('.cta');
  await expect(
    cta.getByRole('heading', { name: 'CTA independiente', level: 2 }),
  ).toBeVisible();
  await expect(
    cta.getByRole('link', { name: 'Consultoria Gratuita' }),
  ).toHaveAttribute('href', 'mailto:eduardomz@business-lab.net');
  expect(
    await cta.evaluate((e) => e.getBoundingClientRect().height),
  ).toBeGreaterThan(250);
  expect(
    await page
      .locator('link[rel="stylesheet"]')
      .evaluateAll((links) =>
        links.some((e) => /page-/.test((e as HTMLLinkElement).href)),
      ),
  ).toBe(false);
});
