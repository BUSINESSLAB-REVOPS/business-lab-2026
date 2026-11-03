import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // The same fonts are self-hosted; a remote font timeout should not block
  // exercising a local form in the development server.
  await page.route('https://fonts.googleapis.com/**', (route) =>
    route.fulfill({ contentType: 'text/css', body: '' }),
  );
});

for (const width of [390, 1280]) {
  test(`local consultation validates and reaches the copied calendar at ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    // Verify the embed configuration without creating a real reservation.
    await page.route('https://revops1.zohobookings.com/**', (route) =>
      route.fulfill({
        contentType: 'text/html',
        body: '<p>Agenda de prueba</p>',
      }),
    );
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const trigger = page.getByRole('link', {
      name: 'Consultoría gratuita',
      exact: true,
    });
    await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    await page.screenshot({ path: testInfo.outputPath('home.png') });
    await trigger.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath('diagnostic.png') });
    const bounds = await dialog.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    await dialog
      .getByRole('button', { name: 'Cerrar formulario', exact: true })
      .focus();
    await page.keyboard.press('Shift+Tab');
    expect(
      await dialog.evaluate((element) =>
        element.contains(document.activeElement),
      ),
    ).toBe(true);
    expect(new URL(page.url()).pathname).toBe('/');
    await expect(dialog.locator('iframe')).toHaveCount(0);
    await dialog
      .getByRole('button', { name: 'Continuar', exact: true })
      .click();
    await expect(dialog.getByRole('alert')).toHaveText(
      'Selecciona una respuesta.',
    );
    for (const question of await dialog.locator('[data-question]').all()) {
      await question.getByRole('radio').first().click();
    }
    await dialog
      .getByRole('button', { name: 'Continuar', exact: true })
      .click();
    await expect(
      dialog.getByRole('heading', { name: 'Información de contacto' }),
    ).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath('contact.png') });
    await dialog
      .getByLabel('Nombre completo', { exact: true })
      .fill('Ana Prueba');
    await dialog
      .getByLabel('Nombre de la empresa', { exact: true })
      .fill('Empresa Prueba');
    await dialog.getByLabel('Sitio web de la empresa').fill('empresa.com');
    await dialog.getByLabel('Correo empresarial').fill('ana@empresa.com');
    await dialog
      .getByLabel('Número de teléfono', { exact: true })
      .fill('987654321');
    await dialog
      .getByRole('button', { name: 'Continuar', exact: true })
      .click();
    await expect(
      dialog.getByRole('heading', { name: 'Elige fecha y hora' }),
    ).toBeVisible();
    await expect(dialog.locator('iframe')).toHaveAttribute(
      'src',
      /revops1\.zohobookings\.com\/portal-embed#\/5013442000000038009\?/,
    );
    const bookingUrl = await dialog.locator('iframe').getAttribute('src');
    expect(bookingUrl).toContain('ana%40empresa.com');
    expect(bookingUrl).toContain('%2B51987654321');
    await dialog.getByRole('button', { name: 'Editar datos' }).click();
    await expect(
      dialog.getByLabel('Nombre completo', { exact: true }),
    ).toHaveValue('Ana Prueba');
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });
}

test('consultation opens from other pages and direct links', async ({
  page,
}) => {
  await page.goto('/consultoriaagil/', { waitUntil: 'domcontentloaded' });
  const trigger = page.locator('a[href="/#contacto"]').first();
  await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  expect(new URL(page.url()).pathname).toBe('/consultoriaagil/');
  await page.goto('/?consultoria=gratuita#contacto', {
    waitUntil: 'domcontentloaded',
  });
  await expect(page.getByRole('dialog')).toBeVisible();
});

test('a failed form download stays on the site and can recover after reload', async ({
  page,
}) => {
  const emailLaunches: string[] = [];
  page.on('console', (message) => {
    if (message.text().includes('Launched external handler'))
      emailLaunches.push(message.text());
  });
  const formModule = /\/(?:diagnostic\/mount|_astro\/mount\.)/;
  await page.route(formModule, (route) => route.abort());
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const trigger = page.getByRole('link', {
    name: 'Consultoría gratuita',
    exact: true,
  });
  await expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
  await trigger.click();
  await expect(page.locator('#consultation-error')).toBeVisible();
  expect(emailLaunches).toEqual([]);
  expect(new URL(page.url()).pathname).toBe('/');
  await page.unroute(formModule);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await trigger.click();
  await expect(page.getByRole('dialog')).toBeVisible();
});
