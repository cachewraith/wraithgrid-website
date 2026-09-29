import type { AnchorHTMLAttributes } from 'react'

/** Every off-site link goes through here so rel stays consistent. */
export function ExternalLink(props: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return <a {...props} rel="noopener noreferrer" />
}
