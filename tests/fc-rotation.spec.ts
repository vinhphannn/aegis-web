import { test, expect } from '@playwright/test'

test('only chapter 3 FC rotates on drag and keeps its angle after release', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('about/')
  await expect(page.locator('.about-model-parallax')).toHaveAttribute('data-models-ready', 'true', { timeout: 30000 })
  await page.getByRole('button', { name: '3. The ecosystem' }).click()
  await expect(page.locator('.aegis-about')).toHaveAttribute('data-chapter', '3')
  await expect.poll(() => page.locator('#about-foundations').evaluate(el => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(2)
  const isolated = await page.addStyleTag({ content: '.about-scene-world, .about-chapter-content, .about-chapter-rail, .aegis-nav, .about-fc-drag-hint { visibility: hidden !important; }' })
  await page.waitForTimeout(1000)
  const canvas = page.locator('.about-near-plane canvas')
  const snapshot = async () => (await canvas.screenshot()).toString('base64')
  const difference = async (a: string, b: string) => page.evaluate(async ([a, b]) => {
    const images = await Promise.all([a, b].map(async value => {
      const image = new Image(); image.src = `data:image/png;base64,${value}`; await image.decode(); return image
    }))
    const output = document.createElement('canvas'); output.width = images[0].width; output.height = images[0].height
    const context = output.getContext('2d')!
    const pixels = images.map(image => { context.clearRect(0, 0, output.width, output.height); context.drawImage(image, 0, 0); return context.getImageData(0, 0, output.width, output.height).data })
    let changed = 0
    for (let i = 0; i < pixels[0].length; i += 4) if (Math.abs(pixels[0][i] - pixels[1][i]) + Math.abs(pixels[0][i + 1] - pixels[1][i + 1]) + Math.abs(pixels[0][i + 2] - pixels[1][i + 2]) > 24) changed++
    return changed / (output.width * output.height)
  }, [a, b])
  const before = await snapshot()
  await page.mouse.move(1080, 550)
  await page.waitForTimeout(500)
  expect(await difference(before, await snapshot())).toBeLessThan(.001)
  await page.mouse.down()
  await page.mouse.move(1160, 490, { steps: 10 })
  await page.mouse.up()
  await page.waitForTimeout(1000)
  const rotated = await snapshot()
  expect(await difference(before, rotated)).toBeGreaterThan(.005)
  await page.mouse.move(500, 300)
  await page.waitForTimeout(500)
  expect(await difference(rotated, await snapshot())).toBeLessThan(.001)
  await isolated.evaluate(element => element.remove())
  await page.getByRole('link', { name: 'Explore products', exact: true }).click()
  await expect(page).toHaveURL(/\/products$/)
})
