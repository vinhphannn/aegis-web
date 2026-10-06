import { test, expect } from '@playwright/test'

async function openAbout(page: import('@playwright/test').Page) {
  await page.goto('about/')
  await expect(page.locator('.about-chapter')).toHaveCount(4)
  await expect(page.locator('.boot-loader')).toHaveCount(0)
  await expect(page.locator('.aegis-about')).toHaveAttribute('data-prepared', 'true', { timeout: 10000 })
}

test('chapters snap to frames and foreground moves at a different depth', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  const remoteAssets: string[] = []
  const models: string[] = []
  const cutouts: string[] = []
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('request', request => {
    if (/threeui|supabase/.test(request.url())) remoteAssets.push(request.url())
    if (request.url().endsWith('.glb')) models.push(request.url())
    if (/cutout\.webp/.test(request.url())) cutouts.push(request.url())
  })
  await openAbout(page)
  await expect(page.locator('html')).toHaveCSS('scroll-snap-type', 'y mandatory')
  await page.mouse.move(1000, 250)
  await expect.poll(() => page.locator('.aegis-about').evaluate(el => parseFloat(getComputedStyle(el).getPropertyValue('--pointer-x')))).toBeGreaterThan(1)
  const back = await page.locator('.about-scene.is-active .about-scene-backdrop').evaluate(el => getComputedStyle(el).transform)
  const front = await page.locator('.about-model-parallax').evaluate(el => getComputedStyle(el).transform)
  expect(back).not.toBe(front)
  await page.mouse.move(600, 500)
  await page.mouse.wheel(0, 700)
  await expect(page.locator('.aegis-about')).toHaveAttribute('data-chapter', '2')
  await expect.poll(() => page.locator('#about-philosophy').evaluate(el => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(2)
  await page.getByRole('button', { name: '3. The ecosystem' }).click()
  await expect(page.locator('.aegis-about')).toHaveAttribute('data-chapter', '3')
  await expect.poll(() => page.locator('#about-foundations').evaluate(el => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(2)
  await expect(page.getByRole('button', { name: '3. The ecosystem' })).toHaveAttribute('aria-current', 'step')
  await expect.poll(() => page.locator('.about-scene.is-active img').evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true)
  await expect(page.locator('.about-model-parallax')).toHaveAttribute('data-models-ready', 'true', { timeout: 30000 })
  await expect(page.locator('.about-near-plane canvas')).toHaveCount(1)
  await expect(page.locator('.about-scene.is-active')).toHaveCSS('opacity', '1')
  await page.screenshot({ path: '/tmp/aegis-about-ecosystem.png' })
  expect(remoteAssets).toEqual([])
  expect(cutouts).toEqual([])
  expect(models.map(url => url.split('/').at(-1)).sort()).toEqual(['aegis-drone.glb', 'aegis-fc.glb'])
  expect(errors).toEqual([])
  await page.getByRole('link', { name: 'Explore products', exact: true }).click()
  await expect(page).toHaveURL(/\/products$/)
  await expect(page.locator('html')).not.toHaveClass(/about-scene-scroll/)
  await expect(page.locator('.about-scene-world')).toHaveCount(0)
})

test('mobile frames keep copy and actions readable and footer reachable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await openAbout(page)
  for (let index = 0; index < 4; index++) {
    await page.getByRole('button', { name: `${index + 1}.`, exact: false }).click()
    await expect(page.locator('.aegis-about')).toHaveAttribute('data-chapter', String(index + 1))
    await expect.poll(() => page.locator('.about-chapter').nth(index).evaluate(el => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(2)
    const overflow = await page.locator('.about-chapter').nth(index).locator('.about-chapter-content').evaluate(el => {
      const rect = el.getBoundingClientRect()
      return rect.left < 0 || rect.right > innerWidth || rect.top < 84 || rect.bottom > innerHeight - 40
    })
    expect(overflow).toBe(false)
    await expect(page.locator('.about-scene.is-active')).toHaveCSS('opacity', '1')
    await page.screenshot({ path: `/tmp/aegis-about-mobile-${index + 1}.png` })
  }
  await page.mouse.wheel(0, 1000)
  await expect(page.locator('.footer')).toBeInViewport()
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
})

test('reduced motion disables snapping and parallax, small screens can read long content', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 320, height: 568 })
  await openAbout(page)
  await expect(page.locator('html')).toHaveCSS('scroll-snap-type', 'none')
  await page.mouse.move(300, 100)
  await expect(page.locator('.aegis-about')).toHaveCSS('--pointer-x', '0px')
  await page.getByRole('button', { name: '3. The ecosystem' }).click()
  const toolLink = page.locator('#about-foundations').getByRole('link', { name: /Open configurator/ })
  await toolLink.scrollIntoViewIfNeeded()
  await expect(toolLink).toBeInViewport()
  await page.screenshot({ path: '/tmp/aegis-about-small.png' })
})
