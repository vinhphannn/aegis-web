import { PageMeta } from '../components/PageMeta'

export function AegisFcDocsPage() {
  return (
    <div className="page-container">
      <PageMeta
        title="AEGIS FC Documentation"
        description="Flight controller hardware documentation and pinout reference guides."
        path="/docs/aegis-fc"
      />
      <header className="page-header">
        <h1>AEGIS FC Documentation</h1>
        <p className="page-description">Flight controller hardware documentation and guides.</p>
      </header>
    </div>
  )
}
