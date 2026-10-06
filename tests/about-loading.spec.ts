import { test, expect } from '@playwright/test'

test('About holds the scene until models draw, including in-app navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 800 })
  await page.goto('products/')
  let release!: () => void
  const blocked = new Promise<void>(resolve => { release = resolve })
  await page.route('**/models/*.glb', async route => { await blocked; await route.continue() })
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'About', exact: true }).click()
  await expect(page.getByRole('status')).toHaveText(/Preparing the scene/)
  await expect(page.locator('.aegis-about')).toHaveAttribute('data-prepared', 'false')
  await expect(page.locator('.about-chapter').first()).toHaveAttribute('inert', '')
  await expect(page.locator('.about-scene-world')).toHaveCSS('opacity', '0')
  release()
  await expect(page.locator('.about-model-parallax')).toHaveAttribute('data-models-ready', 'true', { timeout: 30000 })
  await expect(page.locator('.aegis-about')).toHaveAttribute('data-prepared', 'true')
  await expect(page.getByRole('status')).toHaveCount(0)
  await expect(page.locator('.about-model-parallax')).toHaveCSS('opacity', '1')
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Products', exact: true }).click()
  await expect(page.locator('html')).not.toHaveClass(/about-scene-loading/)
})

test('slow model downloads cannot trap the user in loading', async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 800 })
  let release!: () => void
  const blocked = new Promise<void>(resolve => { release = resolve })
  await page.route('**/models/*.glb', async route => { await blocked; await route.abort() })
  await page.goto('about/')
  await expect(page.getByRole('status')).toHaveText(/Preparing the scene/)
  await expect(page.locator('.aegis-about')).toHaveAttribute('data-prepared', 'true', { timeout: 9000 })
  await expect(page.locator('.aegis-about')).toHaveAttribute('data-timed-out', 'true')
  await expect(page.getByRole('heading', { name: 'Built with purpose. Connected by design.' })).toBeVisible()
  await expect(page.locator('html')).not.toHaveClass(/about-scene-loading/)
  release()
})

test('short screens without 3D do not wait for model downloads', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  const requests: string[] = []
  page.on('request', request => { if (request.url().endsWith('.glb')) requests.push(request.url()) })
  await page.goto('about/')
  await expect(page.locator('.aegis-about')).toHaveAttribute('data-prepared', 'true')
  await expect(page.locator('.aegis-about')).toHaveAttribute('data-timed-out', 'false')
  expect(requests).toEqual([])
})
