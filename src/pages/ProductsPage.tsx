import { Link } from 'react-router-dom'

export function ProductsPage() {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Products</h1>
        <p className="page-description">AEGIS hardware product lineup.</p>
      </header>

      <ul className="placeholder-list">
        <li>
          <Link to="/products/aegis-fc">AEGIS FC (Flight Controller)</Link>
        </li>
        <li>
          <Link to="/products/aegis-tx">AEGIS TX (Radio Transmitter)</Link>
        </li>
      </ul>
    </div>
  )
}
