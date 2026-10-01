import { PageMeta } from '../components/PageMeta'
import { TestCanvas3D } from '../components/TestCanvas3D'

export function HomePage() {
  return (
    <div className="page-container">
      <PageMeta
        title="Hub"
        description="Official web hub and configurator for the AEGIS UAV hardware and software ecosystem."
        path="/"
      />
      <header className="page-header">
        <h1>AEGIS Ecosystem</h1>
        <p className="page-description">
          Hub for AEGIS UAV hardware and software ecosystem.
        </p>
      </header>

      {/* R3F 3D Foundation Demo */}
      <TestCanvas3D />
    </div>
  )
}
