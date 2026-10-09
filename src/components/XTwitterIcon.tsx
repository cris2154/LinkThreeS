import type { SVGProps } from 'react'

// Silueta del logo oficial de X (Twitter)
const silhouette =
  'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'

export default function XTwitterIcon({
  size = 24,
  strokeWidth: _strokeWidth,
  ...props
}: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      {...props}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d={silhouette} fill="currentColor" />
    </svg>
  )
}
