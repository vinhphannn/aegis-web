import { Link } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'

export function NotFoundPage() {
  return (
    <div className="page-container">
      <PageMeta
        title="404 Not Found"
        description="Requested page was not found on AEGIS Web."
        noindex
      />
      <header className="page-header">
        <h1>404</h1>
        <p className="page-description">Page not found.</p>
      </header>
      <div>
        <Link to="/" className="nav-link external">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
