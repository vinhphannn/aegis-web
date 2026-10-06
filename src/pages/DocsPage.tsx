import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'

export function DocsPage() {
  return (
    <div className="page-container">
      <PageMeta
        title="Documentation"
        description="Technical documentation, hardware pinouts, and firmware guides for the AEGIS ecosystem."
        path="/docs"
      />
      <header className="page-header">
        <h1>Documentation</h1>
        <p className="page-description">AEGIS Ecosystem documentation hub.</p>
      </header>

      <ul className="placeholder-list">
        <li>
          <Link to="/docs/fc">AEGIS FC Documentation</Link>
        </li>
        <li>
          <Link to="/docs/controller">AEGIS Controller Documentation</Link>
        </li>
      </ul>
    </div>
  )
}
