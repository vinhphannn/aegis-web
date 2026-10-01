import { useEffect } from 'react'
import { SITE_CONFIG } from '../siteConfig'

interface PageMetaProps {
  title: string
  description: string
  path?: string
  noindex?: boolean
}

export function PageMeta({ title, description, path, noindex = false }: PageMetaProps) {
  useEffect(() => {
    // 1. Document Title
    const fullTitle = `${title} | ${SITE_CONFIG.titleSuffix}`
    document.title = fullTitle

    // Helper to create or update meta tag
    const updateMetaTag = (attribute: string, key: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${key}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, key)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    // Helper to remove meta tag
    const removeMetaTag = (attribute: string, key: string) => {
      const element = document.querySelector(`meta[${attribute}="${key}"]`)
      if (element) {
        element.remove()
      }
    }

    // 2. Meta Description & Open Graph Tags
    updateMetaTag('name', 'description', description)
    updateMetaTag('property', 'og:title', fullTitle)
    updateMetaTag('property', 'og:description', description)
    updateMetaTag('property', 'og:site_name', SITE_CONFIG.name)
    updateMetaTag('property', 'og:type', 'website')

    // Robots tag
    if (noindex) {
      updateMetaTag('name', 'robots', 'noindex, nofollow')
    } else {
      removeMetaTag('name', 'robots')
    }

    // 3. Canonical URL & og:url
    let linkCanonical = document.querySelector('link[rel="canonical"]')
    if (!noindex && path) {
      const canonicalUrl = `${SITE_CONFIG.baseUrl}${path === '/' ? '' : path}`
      updateMetaTag('property', 'og:url', canonicalUrl)

      if (!linkCanonical) {
        linkCanonical = document.createElement('link')
        linkCanonical.setAttribute('rel', 'canonical')
        document.head.appendChild(linkCanonical)
      }
      linkCanonical.setAttribute('href', canonicalUrl)
    } else {
      removeMetaTag('property', 'og:url')
      if (linkCanonical) {
        linkCanonical.remove()
      }
    }
  }, [title, description, path, noindex])

  return null
}

