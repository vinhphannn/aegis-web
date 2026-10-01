import { PageMeta } from '../components/PageMeta'

export function AegisFcPage() {
  return (
    <div className="page-container">
      <PageMeta
        title="AEGIS FC"
        description="AEGIS FC flight controller hardware specifications, features, and system overview."
        path="/products/aegis-fc"
      />
      <header className="page-header">
        <h1>AEGIS FC</h1>
        <p className="page-description">Flight controller product page.</p>
      </header>
    </div>
  )
}
