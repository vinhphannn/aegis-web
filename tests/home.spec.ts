import { test, expect } from '@playwright/test'

test('Home provides three sections and routes to current hardware', async ({ page }) => {
  await page.goto('./')
  await expect(page.getByRole('heading', { name: 'Flight control, operator control, and autonomy — built as one system.' })).toBeVisible()
  await expect(page.locator('.home-container > section')).toHaveCount(3)
  await expect(page.getByText('WORKING PROTOTYPE', { exact: true })).toHaveCount(2)
  await expect(page.getByRole('link', { name: 'Open Configurator', exact: true })).toHaveAttribute('href', '/aegis-web/configurator')
  await page.getByRole('link', { name: 'Explore AEGIS Controller', exact: false }).click()
  await expect(page).toHaveURL(/\/products\/controller$/)
  await expect(page.getByRole('heading', { name: 'AEGIS Controller', exact: true })).toBeVisible()
  await page.getByRole('link', { name: 'Getting started' }).click()
  await expect(page.getByRole('heading', { name: 'AEGIS Controller Documentation', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Connections and hardware reference' })).toBeVisible()
})

for (const [oldPath, path, title] of [
  ['products/aegis-fc/', 'products/fc', 'AEGIS FC'],
  ['products/aegis-tx/', 'products/controller', 'AEGIS Controller'],
  ['docs/aegis-fc/', 'docs/fc', 'AEGIS FC Documentation'],
  ['docs/aegis-tx/', 'docs/controller', 'AEGIS Controller Documentation'],
]) test(`old URLs and new direct links: ${path}`, async ({ page }) => {
  expect((await page.goto(oldPath))?.status()).toBe(200)
  await expect(page).toHaveURL(new RegExp(`/${path}$`))
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible()
  expect((await page.reload())?.status()).toBe(200)
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible()
})

test('Home and product copy fit mobile without overflowing', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('./')
  await expect(page.getByRole('heading', { name: 'Two parts. One foundation.' })).toBeVisible()
  await expect(page.locator('.boot-loader')).toHaveCount(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
  await page.screenshot({ path: '/tmp/aegis-home-mobile.png', fullPage: true })
  await page.goto('products/controller/')
  await expect(page.getByRole('heading', { name: 'AEGIS Controller', exact: true })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('./')
  await expect(page.locator('.boot-loader')).toHaveCount(0)
  await page.screenshot({ path: '/tmp/aegis-home-desktop.png', fullPage: true })
})

test('Home uses FC only and rotates through dragging rather than pointer focus', async ({ page }) => {
  const models: string[] = []
  page.on('request', request => { if (request.url().endsWith('.glb')) models.push(request.url()) })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('./')
  await expect(page.locator('.home-fc-viewer')).toHaveAttribute('data-model-ready', 'true', { timeout: 30000 })
  await expect(page.locator('.boot-loader')).toHaveCount(0)
  await page.waitForTimeout(500)
  const canvas = page.locator('.home-fc-viewer canvas')
  const before = await canvas.screenshot()
  const box = (await canvas.boundingBox())!
  const x = box.x + box.width / 2, y = box.y + box.height / 2
  await page.mouse.move(x, y)
  await page.waitForTimeout(300)
  expect(await canvas.screenshot()).toEqual(before)
  await page.mouse.down()
  await page.mouse.move(x + 120, y - 70, { steps: 10 })
  await page.mouse.up()
  await page.waitForTimeout(1000)
  expect(await canvas.screenshot()).not.toEqual(before)
  expect(models.map(url => url.split('/').at(-1))).toEqual(['aegis-fc.glb'])
  expect(await page.evaluate(() => window.getSelection()?.toString())).toBe('')
  await page.screenshot({ path: '/tmp/aegis-home-fc.png', fullPage: true })
})
