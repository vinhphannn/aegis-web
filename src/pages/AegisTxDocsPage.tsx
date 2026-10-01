import { PageMeta } from '../components/PageMeta'

export function AegisTxDocsPage() {
  return (
    <div className="page-container">
      <PageMeta
        title="AEGIS TX Documentation"
        description="Radio transmitter hardware documentation and reference guides."
        path="/docs/aegis-tx"
      />
      <header className="page-header">
        <h1>AEGIS TX Documentation</h1>
        <p className="page-description">Radio transmitter hardware documentation and guides.</p>
      </header>
    </div>
  )
}
