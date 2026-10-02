// Copy the official browser bundle, including its lazy-loaded modules, to the same origin.
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
await rm('public/esp-web-tools', { recursive: true, force: true });
await cp('node_modules/esp-web-tools/dist/web', 'public/esp-web-tools', { recursive: true });
const dependencies = ['esp-web-tools', 'esptool-js', 'improv-wifi-serial-sdk', 'lit', 'lit-html', 'lit-element', '@lit/reactive-element', '@material/web', 'tslib', 'pako'];
await mkdir('public/esp-web-tools/licenses', { recursive: true });
for (const name of dependencies) {
  const directory = path.join('node_modules', name);
  const pkg = JSON.parse(await readFile(path.join(directory, 'package.json')));
  let license;
  for (const filename of ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'LICENSE.TXT', 'CopyrightNotice.txt']) {
    try { license = await readFile(path.join(directory, filename)); break; } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  if (!license) throw new Error(`Missing license: ${name}`);
  await writeFile(`public/esp-web-tools/licenses/${name.replaceAll('/', '_')}.txt`, `${name} ${pkg.version}\n\n${license}`);
}
