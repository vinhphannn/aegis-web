import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Channel, Release } from '../../lib/firmware'

// Only release selection is shared. Each device supplies its own actions and source.
export function FirmwareSelection<T extends Release>({ source, emptyMessage, children }: {
  source: { load: (signal: AbortSignal) => Promise<T[]>; releasesURL: string }
  emptyMessage: string
  children: (release: T) => ReactNode
}) {
  const [releases, setReleases] = useState<T[] | null>(null)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [channel, setChannel] = useState<Channel>('stable')
  const [version, setVersion] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    source.load(controller.signal).then(result => {
      if (!controller.signal.aborted) setReleases(result)
    }).catch(error => {
      if (!controller.signal.aborted) {
        console.error('Firmware catalog failed:', error)
        setError(error instanceof Error ? error.message : 'Could not load firmware releases.')
      }
    })
    return () => controller.abort()
  }, [source, attempt])

  const available = releases?.filter(release => release.channel === channel) ?? []
  const selected = available.find(release => release.version === version) ?? available[0]

  return <section className="config-panel" aria-label="Firmware selection">
    <div className="config-fields">
      <label>Channel
        <select value={channel} onChange={event => { setChannel(event.target.value as Channel); setVersion('') }}>
          <option value="stable">Stable</option><option value="beta">Beta</option>
        </select>
      </label>
      <label>Version
        <select value={selected?.version ?? ''} disabled={!available.length} onChange={event => setVersion(event.target.value)}>
          {!available.length && <option value="">{!releases && !error ? 'Loading…' : 'No releases'}</option>}
          {available.map(release => <option key={release.version} value={release.version}>v{release.version.replace(/^v/, '')}</option>)}
        </select>
      </label>
    </div>
    {error && <div className="config-empty" role="alert">
      <p>{error}</p><button type="button" className="btn-secondary" onClick={() => { setError(''); setAttempt(attempt + 1) }}>Retry</button>
    </div>}
    {!releases && !error && <p className="config-status" role="status">Loading firmware releases…</p>}
    {releases && !selected && <div className="config-empty">
      <h2>No {channel} releases available</h2><p>{emptyMessage}</p>
      {channel === 'stable' && releases.some(release => release.channel === 'beta') &&
        <button type="button" className="btn-secondary" onClick={() => { setChannel('beta'); setVersion('') }}>Show beta releases</button>}
      <a className="text-link" href={source.releasesURL}>All releases ↗</a>
    </div>}
    {selected && <div className="config-release">
      <div className="config-release-header">
        <h2>v{selected.version.replace(/^v/, '')}</h2>
        <span>{new Date(selected.published_at).toLocaleDateString('en-GB')}</span>
        <a className="text-link" href={selected.release_url} target="_blank" rel="noreferrer">Release notes ↗</a>
      </div>
      {children(selected)}
    </div>}
  </section>
}
