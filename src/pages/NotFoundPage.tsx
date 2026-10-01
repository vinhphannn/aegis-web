import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="page-container">
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
