import { test, expect } from '@playwright/test'

for (const route of ['', 'about']) test(`FC gently rotates when idle: ${route || 'Home'}`, async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto(`./${route}`)
  const viewer = page.locator(route ? '.about-model-parallax' : '.home-fc-viewer')
  await expect(viewer).toHaveAttribute(route ? 'data-models-ready' : 'data-model-ready', 'true', { timeout: 30000 })
  if (route) {
    await expect(page.locator('.about-loading')).toHaveCount(0)
    await page.locator('.about-chapter').nth(2).scrollIntoViewIfNeeded()
  }
  const canvas = viewer.locator('canvas')
  await page.waitForTimeout(2000)
  const before = await canvas.screenshot()
  await page.waitForTimeout(1000)
  expect(await canvas.screenshot()).not.toEqual(before)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.waitForTimeout(1000)
  const still = await canvas.screenshot()
  await page.waitForTimeout(500)
  expect(await canvas.screenshot()).toEqual(still)
})
