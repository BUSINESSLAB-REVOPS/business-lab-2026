import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';

const label = process.argv[2] || 'baseline';
const root = `.artifacts/${label}`;
await fs.mkdir(root, { recursive: true });
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
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
for (const route of routes) {
  const name = route.replaceAll('/', '-').replace(/^-|-$/g, '') || 'home';
  for (const width of [390, 768, 1280]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: 'reduce',
    });
    page.setDefaultTimeout(90000);
    await page.goto(
      `${process.env.BASE_URL || 'http://localhost:4325'}${route}`,
      { waitUntil: 'load', timeout: 90000 },
    );
    await page.evaluate(async () => {
      await document.fonts.ready;
      document.querySelectorAll('img').forEach((img) => {
        img.loading = 'eager';
      });
      await Promise.all(
        [...document.images].map((img) => img.decode().catch(() => {})),
      );
    });
    await page.addStyleTag({
      content:
        '*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}',
    });
    await page.screenshot({
      path: `${root}/${name}-${width}.png`,
      fullPage: true,
    });
    const data = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      height: document.documentElement.scrollHeight,
      resources: performance
        .getEntriesByType('resource')
        .map((e) => ({
          url: e.name,
          bytes: e.transferSize,
          decoded: e.decodedBodySize,
        })),
      sections: [
        ...document.querySelectorAll('main .et_pb_section,main .page-section'),
      ].map((el) => {
        const r = el.getBoundingClientRect();
        return {
          title: el.querySelector('h1,h2,h3')?.textContent,
          width: r.width,
          height: r.height,
          top: r.top + scrollY,
        };
      }),
    }));
    if (width === 1280 && label === 'baseline') {
      const html = await page.locator('main').innerHTML();
      await fs.writeFile(`${root}/${name}.html`, html);
      const rules = await page.evaluate(() => {
        const result = [];
        function visit(list, media = []) {
          for (const rule of list) {
            if (rule instanceof CSSMediaRule)
              visit(rule.cssRules, [...media, rule.conditionText]);
            else if (rule instanceof CSSStyleRule) {
              const selectors = rule.selectorText.split(',').filter((s) => {
                try {
                  return document.querySelector(
                    s
                      .replace(/::[\w-]+(?:\([^)]*\))?/g, '')
                      .replace(/:(hover|focus-visible|focus|active)/g, ''),
                  );
                } catch {
                  return false;
                }
              });
              if (selectors.length)
                result.push({
                  selector: selectors.join(','),
                  style: rule.style.cssText,
                  media,
                });
            }
          }
        }
        for (const sheet of document.styleSheets) {
          try {
            visit(sheet.cssRules);
          } catch {}
        }
        return result;
      });
      await fs.writeFile(`${root}/${name}-rules.json`, JSON.stringify(rules));
    }
    results.push({ route, width, ...data });
    console.log(
      label,
      route,
      width,
      data.height,
      data.overflow ? 'OVERFLOW' : 'OK',
    );
    await page.close();
  }
}
await fs.writeFile(
  `${root}/measurements.json`,
  JSON.stringify(results, null, 2),
);
await browser.close();
