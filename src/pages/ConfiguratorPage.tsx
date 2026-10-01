import { PageMeta } from '../components/PageMeta'

export function ConfiguratorPage() {
  return (
    <div className="page-container">
      <PageMeta
        title="Configurator"
        description="AEGIS device configurator overview and hardware setup interface."
        path="/configurator"
      />
      <header className="page-header">
        <h1>Configurator</h1>
        <p className="page-description">AEGIS hardware configuration utility.</p>
      </header>
    </div>
  )
}
