import { test, expect, type Page } from '@playwright/test';

// El juego usa `let`/`const`/`class` de nivel superior en un script clásico.
// `eval` indirecto corre en el scope global y puede leerlos/escribirlos.
const read = (page: Page, expr: string) => page.evaluate(e => (0, eval)(e) as any, expr);

const snapshot = (page: Page) => read(page, `({
  state, score, lives, level, fugazTimer,
  bullets: bullets.length,
  asteroids: asteroids.map(a => ({
    kind: a.kind, size: a.size, radius: a.radius,
    x: a.x, y: a.y, speed: Math.hypot(a.vx, a.vy),
  })),
})`);

const countFugaces = async (page: Page) =>
  (await snapshot(page)).asteroids.filter((a: any) => a.kind === 'fugaz').length;

test('arranca sin errores y renderiza el canvas', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

  await page.goto('index.html');

  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();
  expect(await canvas.evaluate((c: HTMLCanvasElement) => [c.width, c.height])).toEqual([800, 600]);

  const s = await snapshot(page);
  expect(s.state).toBe('playing');
  expect(s.lives).toBe(3);
  expect(s.level).toBe(1);
  expect(s.score).toBe(0);
  expect(s.asteroids.filter((a: any) => a.kind === 'normal').length).toBe(4);

  const painted = await page.evaluate(() => {
    const c = document.getElementById('canvas') as HTMLCanvasElement;
    const d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
    let n = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i] || d[i + 1] || d[i + 2]) n++;
    return n;
  });
  expect(painted).toBeGreaterThan(500);
  expect(errors).toEqual([]);

  await page.screenshot({ path: 'test-results/arranque.png' });
});

test('disparar genera una bala', async ({ page }) => {
  await page.goto('index.html');
  await read(page, 'bullets.length = 0');

  await page.keyboard.press('Space');

  await expect.poll(async () => (await snapshot(page)).bullets).toBeGreaterThan(0);
});

test('estrella fugaz: aparece rápido, es veloz, tiene el timer congelado y expira', async ({ page }) => {
  await page.goto('index.html');
  await page.evaluate(() => (0, eval)('fugazTimer = 0'));

  await expect.poll(() => countFugaces(page), { timeout: 5000 }).toBe(1);

  const s = await snapshot(page);
  const f = s.asteroids.find((a: any) => a.kind === 'fugaz');
  const normal = s.asteroids.find((a: any) => a.kind === 'normal');

  expect(f.size).toBe(2);                                  // hittable
  expect(f.speed).toBeGreaterThan(100);                    // más rápida que la normal
  expect(f.speed).toBeLessThan(200);
  expect(f.speed).toBeGreaterThan(normal.speed);
  expect(f.x).toBeGreaterThanOrEqual(0);
  expect(f.x).toBeLessThanOrEqual(800);
  expect(f.y).toBeGreaterThanOrEqual(0);
  expect(f.y).toBeLessThanOrEqual(600);

  // no está encima de la nave
  expect(await read(page, 'Math.hypot(asteroids.find(a=>a.kind==="fugaz").x - ship.x, asteroids.find(a=>a.kind==="fugaz").y - ship.y)')).toBeGreaterThan(100);

  // el timer no corre mientras hay una viva
  const t1 = (await snapshot(page)).fugazTimer;
  await page.waitForTimeout(500);
  expect(await countFugaces(page)).toBe(1);
  expect((await snapshot(page)).fugazTimer).toBe(t1);

  // expira (ttl 6s) y desaparece
  await expect.poll(() => countFugaces(page), { timeout: 9000 }).toBe(0);
  expect((await snapshot(page)).state).toBe('playing');
});

test('la estrella fugaz no bloquea el cambio de nivel', async ({ page }) => {
  await page.goto('index.html');
  await read(page, `asteroids = [new Asteroid(400, 100, 2, 'fugaz', 0)]`);

  await expect.poll(async () => (await snapshot(page)).level, { timeout: 5000 }).toBe(2);

  const s = await snapshot(page);
  expect(s.asteroids.some((a: any) => a.kind === 'fugaz')).toBe(false);
  expect(s.asteroids.length).toBe(5); // 3 + nivel
});

test('chocar con la estrella fugaz mata a la nave', async ({ page }) => {
  await page.goto('index.html');
  await read(page, `ship.invincible = 0; asteroids = [new Asteroid(ship.x, ship.y, 2, 'fugaz', 0)]`);

  await expect.poll(async () => (await snapshot(page)).lives, { timeout: 5000 }).toBe(2);
});
