import { PageMeta } from '../components/PageMeta'

export function AboutPage() {
  return (
    <div className="page-container">
      <PageMeta
        title="About"
        description="Information about the AEGIS UAV hardware/software ecosystem project."
        path="/about"
      />
      <header className="page-header">
        <h1>About AEGIS</h1>
        <p className="page-description">AEGIS UAV Ecosystem project and team information.</p>
      </header>
    </div>
  )
}
