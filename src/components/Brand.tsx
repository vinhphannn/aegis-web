import './Brand.css'

export function Brand({ variant = 'lockup', className = '', alt = 'AEGIS UAV Systems' }: {
  variant?: 'lockup' | 'symbol'; className?: string; alt?: string
}) {
  return <img className={`aegis-brand aegis-brand-${variant} ${className}`} src={`${import.meta.env.BASE_URL}images/brand/aegis-${variant}.webp`} alt={alt} decoding="async" />
}
