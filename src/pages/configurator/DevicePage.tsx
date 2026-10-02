import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PageMeta } from '../../components/PageMeta'
import '../ConfiguratorPage.css'

export function DevicePage({ name, path, description, children }: {
  name: string; path: string; description: string; children: ReactNode
}) {
  return <div className="page-container configurator">
    <PageMeta title={`${name} Configurator`} description={description} path={`/configurator/${path}`} />
    <nav className="config-context" aria-label="Breadcrumb">
      <Link className="text-link" to="/configurator">Configurator</Link>
      <span aria-hidden="true">/</span><span aria-current="page">{name}</span>
    </nav>
    <header className="page-header"><h1>{name}</h1><p className="page-description">{description}</p></header>
    {children}
  </div>
}
