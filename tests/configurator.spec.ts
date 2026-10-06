import { createHash } from 'node:crypto'
import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'

const root = 'https://vinhphannn.github.io/Aegis-TX/'
const app = Buffer.from('test firmware bytes')
const checksum = (data: Buffer | string) => ({ size: Buffer.byteLength(data), sha256: createHash('sha256').update(data).digest('hex') })
const manifest = JSON.stringify({ name: 'AEGIS TX', version: '0.2.0-beta.1', new_install_prompt_erase: true, builds: [{ chipFamily: 'ESP32', parts: [{ path: 'app.bin', offset: 65536 }] }] })
const release = {
  version: '0.2.0-beta.1', channel: 'beta', board: 'aegis-tx-esp32', hardware_revision: 'tx01',
  commit: 'a'.repeat(40), hardware_tested: false, published_at: '2026-10-01T00:00:00Z',
  release_url: 'https://github.com/vinhphannn/Aegis-TX/releases/tag/v0.2.0-beta.1',
  download: 'firmware/tx/1/Aegis-TX_Firmware.zip', metadata: 'firmware/tx/1/firmware.json', manifest: 'firmware/tx/1/manifest.json',
}
const metadata = { ...release, schema_version: 1, manifest: 'manifest.json', files: { 'manifest.json': checksum(manifest), 'app.bin': checksum(app) } }
const catalog = { schema_version: 1, tx: [release], fc: [] }

async function fixture(page: Page, broken = false) {
  await page.addInitScript(() => Object.defineProperty(navigator, 'serial', { value: { requestPort: async () => null }, configurable: true }))
  await page.route(`${root}catalog.json`, route => route.fulfill({ json: catalog }))
  await page.route(`${root}firmware/tx/1/firmware.json`, route => route.fulfill({ json: metadata }))
  await page.route(`${root}firmware/tx/1/manifest.json`, route => route.fulfill({ body: manifest }))
  await page.route(`${root}firmware/tx/1/app.bin`, route => route.fulfill({ body: broken ? Buffer.from('corrupt') : app }))
  await page.goto('configurator/controller/')
  await page.getByRole('combobox', { name: 'Channel', exact: true }).selectOption('beta')
}
async function confirm(page: Page) {
  await page.getByRole('checkbox', { name: /My device/ }).check()
  await page.getByRole('checkbox', { name: /I accept/ }).check()
}

const routes = [
  ['configurator/', 'Choose your device.'],
  ['configurator/fc/', 'AEGIS FC'],
  ['configurator/controller/', 'AEGIS Controller'],
  ['configurator/tx-module/', 'AEGIS TX Module'],
  ['configurator/rx-module/', 'AEGIS RX Module'],
]
for (const [path, name] of routes) {
  test(`direct link and refresh: ${path}`, async ({ page }) => {
    const models: string[] = []
    page.on('request', request => { if (request.url().endsWith('.glb')) models.push(request.url()) })
    await page.route(`${root}catalog.json`, route => route.fulfill({ json: catalog }))
    expect((await page.goto(path))?.status()).toBe(200)
    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible()
    expect((await page.reload())?.status()).toBe(200)
    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible()
    await expect(page.getByRole('combobox', { name: 'Device', exact: true })).toHaveCount(0)
    expect(models).toEqual([])
  })
}

test('hub links and browser history keep device context and state separate', async ({ page }) => {
  await page.route(`${root}catalog.json`, route => route.fulfill({ json: catalog }))
  await page.goto('configurator/')
  const devices = page.getByRole('navigation', { name: 'Configurator devices' })
  await expect(devices.getByRole('link')).toHaveCount(4)
  await devices.getByRole('link', { name: /AEGIS Controller/ }).click()
  await page.getByRole('combobox', { name: 'Channel', exact: true }).selectOption('beta')
  await expect(page.getByRole('link', { name: 'Download ZIP' })).toBeVisible()
  await page.goBack()
  await expect(devices).toBeVisible()
  await devices.getByRole('link', { name: /AEGIS FC/ }).click()
  await expect(page.getByRole('combobox', { name: 'Channel', exact: true })).toHaveValue('stable')
  await expect(page.getByRole('heading', { name: 'FC installation' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'USB installation' })).toHaveCount(0)
  await page.goBack()
  await expect(devices).toBeVisible()
  await page.goForward()
  await expect(page.getByRole('heading', { name: 'AEGIS FC', exact: true })).toBeVisible()
  await page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Configurator' }).click()
  await expect(devices).toBeVisible()
})

for (const [path, name] of routes.slice(3)) {
  test(`${name} is an honest placeholder without firmware requests`, async ({ page }) => {
    const requests: string[] = []
    page.on('request', request => { if (request.url().startsWith(root)) requests.push(request.url()) })
    await page.goto('configurator/')
    await page.getByRole('navigation', { name: 'Configurator devices' }).getByRole('link', { name: new RegExp(name) }).click()
    await expect(page).toHaveURL(new RegExp(path.replace(/\/$/, '') + '$'))
    await expect(page.getByRole('heading', { name: 'Not available yet' })).toBeVisible()
    await expect(page.getByRole('combobox')).toHaveCount(0)
    await expect(page.getByRole('button', { name: /Prepare|Connect|Download/ })).toHaveCount(0)
    expect(requests).toEqual([])
  })
}

test('confirms hardware, verifies real bytes and loads the official installer', async ({ page }) => {
  await fixture(page)
  const prepare = page.getByRole('button', { name: 'Prepare firmware' })
  await expect(prepare).toBeDisabled()
  await page.getByRole('checkbox', { name: /My device/ }).check()
  await expect(prepare).toBeDisabled()
  await page.getByRole('checkbox', { name: /I accept/ }).check()
  await prepare.click()
  await expect(page.getByRole('status')).toContainText('Firmware verified')
  const connect = page.getByRole('button', { name: 'Connect & install', exact: true })
  await expect(connect).toBeEnabled()
  const result = await page.locator('esp-web-install-button').evaluate(async element => {
    const manifest = await (await fetch(element.getAttribute('manifest')!)).json()
    return { erase: manifest.new_install_prompt_erase, contents: await (await fetch(manifest.builds[0].parts[0].path)).text() }
  })
  expect(result).toEqual({ erase: true, contents: app.toString() })
  await page.getByRole('checkbox', { name: /My device/ }).uncheck()
  await expect(connect).toBeDisabled()
  await page.getByRole('checkbox', { name: /My device/ }).check()
  await connect.click() // mocked port chooser; no hardware access
  await page.evaluate(() => customElements.whenDefined('ewt-install-dialog'))
  await page.getByRole('combobox', { name: 'Channel', exact: true }).selectOption('stable')
  await expect(page.locator('esp-web-install-button')).toHaveCount(0)
})

test('corrupt binary cannot enable USB installation', async ({ page }) => {
  await fixture(page, true)
  await confirm(page)
  await page.getByRole('button', { name: 'Prepare firmware' }).click()
  await expect(page.getByRole('status')).toContainText('checksum mismatch')
  await expect(page.locator('esp-web-install-button')).toHaveCount(0)
})

test('mismatched board metadata is rejected before installation', async ({ page }) => {
  await fixture(page)
  await page.route(`${root}firmware/tx/1/firmware.json`, route => route.fulfill({ json: { ...metadata, board: 'other-board' } }))
  await confirm(page)
  await page.getByRole('button', { name: 'Prepare firmware' }).click()
  await expect(page.getByRole('status')).toContainText('does not match')
  await expect(page.locator('esp-web-install-button')).toHaveCount(0)
})

test('changing device cancels the pending download', async ({ page }) => {
  await fixture(page)
  let unblock!: () => void
  const waiting = new Promise<void>(resolve => { unblock = resolve })
  await page.route(`${root}firmware/tx/1/app.bin`, async route => { await waiting; await route.fulfill({ body: app }).catch(() => {}) })
  await confirm(page)
  const download = page.waitForRequest(`${root}firmware/tx/1/app.bin`)
  await page.getByRole('button', { name: 'Prepare firmware' }).click()
  await download
  const cancelled = page.waitForEvent('requestfailed', request => request.url().endsWith('/app.bin'))
  await page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Configurator' }).click()
  await page.getByRole('navigation', { name: 'Configurator devices' }).getByRole('link', { name: /AEGIS FC/ }).click()
  await cancelled
  unblock()
  await expect(page.getByRole('heading', { name: 'FC installation' })).toBeVisible()
  await expect(page.locator('esp-web-install-button')).toHaveCount(0)
  await page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link', { name: 'Configurator' }).click()
  await page.getByRole('navigation', { name: 'Configurator devices' }).getByRole('link', { name: /AEGIS Controller/ }).click()
  await page.getByRole('combobox', { name: 'Channel', exact: true }).selectOption('beta')
  await expect(page.getByRole('checkbox', { name: /My device/ })).not.toBeChecked()
})

test('catalog failures have a working retry', async ({ page }) => {
  let attempt = 0
  await page.route(`${root}catalog.json`, route => ++attempt === 1 ? route.fulfill({ status: 503 }) : route.fulfill({ json: catalog }))
  await page.goto('configurator/controller/')
  await expect(page.getByRole('alert')).toContainText('HTTP 503')
  await page.getByRole('button', { name: 'Retry' }).click()
  await expect(page.getByRole('button', { name: 'Show beta releases' })).toBeVisible()
})

test('unsupported browsers can download but cannot connect', async ({ page }) => {
  await fixture(page)
  await page.addInitScript(() => { delete Navigator.prototype.serial })
  // The fixture installs an own property; remove it on the next document too.
  await page.addInitScript(() => { Reflect.deleteProperty(navigator, 'serial') })
  await page.reload()
  await page.getByRole('combobox', { name: 'Channel', exact: true }).selectOption('beta')
  await confirm(page)
  await expect(page.getByRole('button', { name: 'Prepare firmware' })).toBeDisabled()
  await expect(page.getByText('USB installation needs Web Serial', { exact: false })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Download ZIP' })).toHaveAttribute('href', `${root}${release.download}`)
})

test('FC stable and beta selection download the selected firmware', async ({ page }) => {
  const fc = { version: 'v1.0.0', channel: 'stable', published_at: release.published_at, release_url: 'https://github.com/vinhphannn/PX4-Autopilot/releases/tag/v1.0.0', download: 'firmware/fc/1/aegis_fc-v1_default.px4', board_id: 1179, sha256: 'b'.repeat(64) }
  const older = { ...fc, version: 'v0.9.0', download: 'firmware/fc/0/aegis_fc-v1_default.px4' }
  const beta = { ...fc, channel: 'beta', version: 'v1.1.0-beta.1', download: 'firmware/fc/beta/aegis_fc-v1_default.px4' }
  await page.route(`${root}catalog.json`, route => route.fulfill({ json: { schema_version: 1, tx: [release], fc: [fc, older, beta] } }))
  await page.route(`${root}firmware/fc/**`, route => route.fulfill({ body: 'test px4 package', headers: { 'content-disposition': 'attachment; filename="aegis_fc.px4"' } }))
  await page.goto('configurator/fc/')
  const downloadLink = page.getByRole('link', { name: 'Download .px4' })
  await expect(downloadLink).toHaveAttribute('href', `${root}${fc.download}`)
  await page.getByRole('combobox', { name: 'Version', exact: true }).selectOption(older.version)
  await expect(downloadLink).toHaveAttribute('href', `${root}${older.download}`)
  await page.getByRole('combobox', { name: 'Channel', exact: true }).selectOption('beta')
  await expect(downloadLink).toHaveAttribute('href', `${root}${beta.download}`)
  const downloading = page.waitForEvent('download')
  await downloadLink.click()
  const download = await downloading
  expect(download.url()).toBe(`${root}${beta.download}`)
  expect(await download.failure()).toBeNull()
  await expect(page.getByText('Direct browser flashing for FC', { exact: false })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Prepare firmware' })).toHaveCount(0)
})

test('Controller version changes reset confirmations and ZIP downloads work', async ({ page }) => {
  await fixture(page)
  const older = { ...release, version: '0.1.0-beta.1', commit: 'c'.repeat(40), download: 'firmware/tx/0/Aegis-TX_Firmware.zip' }
  await page.route(`${root}catalog.json`, route => route.fulfill({ json: { ...catalog, tx: [release, older] } }))
  await page.route(`${root}${older.download}`, route => route.fulfill({ body: 'test zip package', headers: { 'content-disposition': 'attachment; filename="Aegis-TX_Firmware.zip"' } }))
  await page.reload()
  await page.getByRole('button', { name: 'Show beta releases' }).click()
  await confirm(page)
  await page.getByRole('combobox', { name: 'Version', exact: true }).selectOption(older.version)
  await expect(page.getByRole('checkbox', { name: /My device/ })).not.toBeChecked()
  await expect(page.getByRole('button', { name: 'Prepare firmware' })).toBeDisabled()
  const downloading = page.waitForEvent('download')
  await page.getByRole('link', { name: 'Download ZIP' }).click()
  const download = await downloading
  expect(download.url()).toBe(`${root}${older.download}`)
  expect(await download.failure()).toBeNull()
  await expect(page.getByText('QGroundControl', { exact: false })).toHaveCount(0)
})

test('mobile navigation and controls fit the existing layout', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await fixture(page)
  await expect(page.getByRole('button', { name: 'Toggle navigation menu' })).toBeInViewport()
  const outside = await page.locator('.configurator select, .configurator button, .configurator input').evaluateAll(elements => elements.some(element => {
    const box = element.getBoundingClientRect()
    return box.left < 0 || box.right > innerWidth
  }))
  expect(outside).toBe(false)
  await page.screenshot({ path: test.info().outputPath('mobile.png'), fullPage: true })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.screenshot({ path: test.info().outputPath('desktop.png'), fullPage: true })
})
