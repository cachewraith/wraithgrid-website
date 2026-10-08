import { SHOT_HEIGHT, SHOT_WIDTH, type ShotName } from '../content'

const BASE = import.meta.env.BASE_URL

function shotUrl(name: ShotName, variant: '960' | 'full' | 'png'): string {
  return variant === 'png'
    ? `${BASE}screenshots/${name}.png`
    : `${BASE}screenshots/${name}-${variant}.webp`
}

interface Props {
  name: ShotName
  alt: string
  sizes: string
  className?: string
}

/** WebP at two widths, PNG fallback, and fixed intrinsic size so nothing shifts on load. */
export function Screenshot({ name, alt, sizes, className }: Props) {
  return (
    <picture className={className}>
      <source
        type="image/webp"
        srcSet={`${shotUrl(name, '960')} 960w, ${shotUrl(name, 'full')} ${SHOT_WIDTH}w`}
        sizes={sizes}
      />
      <img
        src={shotUrl(name, 'png')}
        alt={alt}
        width={SHOT_WIDTH}
        height={SHOT_HEIGHT}
        loading="lazy"
        decoding="async"
      />
    </picture>
  )
}
