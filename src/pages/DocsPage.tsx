import { Link } from 'react-router-dom'

export function DocsPage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Documentation</h1>
        <p className="page-description">AEGIS Ecosystem documentation hub.</p>
      </header>

      <ul className="placeholder-list">
        <li>
          <Link to="/docs/aegis-fc">AEGIS FC Documentation</Link>
        </li>
        <li>
          <Link to="/docs/aegis-tx">AEGIS TX Documentation</Link>
        </li>
      </ul>
    </div>
  )
}
