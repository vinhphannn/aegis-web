import { DevicePage } from './DevicePage'

export function PlannedModulePage({ name, path }: { name: string; path: 'tx-module' | 'rx-module' }) {
  return <DevicePage name={name} path={path} description="Planned">
    <section className="config-panel config-guide">
      <h2>Not available yet</h2>
      <p>Configuration and firmware installation for this module are not available yet.</p>
    </section>
  </DevicePage>
}
