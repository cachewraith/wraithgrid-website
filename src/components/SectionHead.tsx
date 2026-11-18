import type { ReactNode } from 'react'

interface Props {
  id: string
  eyebrow: string
  title: ReactNode
  children?: ReactNode
  /** Centered over the section, for the sections without a split layout. */
  center?: boolean
}

/** Every landing section opens the same way: a small label, the heading, one paragraph. */
export function SectionHead({ id, eyebrow, title, children, center = false }: Props) {
  return (
    <header className={center ? 'section-head is-center' : 'section-head'} data-reveal="">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {children ? <p className="section-lede">{children}</p> : null}
    </header>
  )
}
