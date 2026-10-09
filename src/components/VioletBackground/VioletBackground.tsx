import type { CSSProperties } from 'react'
import './VioletBackground.css'

export interface VioletBackgroundProps {
  /** Pausa las luces sin ocultar el fondo. */
  paused?: boolean
  /** 1 = normal, 2 = doble de velocidad, 0.5 = mitad. */
  speed?: number
  texture?: boolean
  dots?: boolean
  /** absolute permite usarlo dentro de una sección con position: relative. */
  position?: 'fixed' | 'absolute'
  className?: string
}

/** Fondo decorativo autónomo. No modifica body, html ni el estado global. */
export default function VioletBackground({
  paused = false,
  speed = 1,
  texture = true,
  dots = true,
  position = 'fixed',
  className = '',
}: VioletBackgroundProps) {
  const rate = Number.isFinite(speed) && speed > 0 ? speed : 1
  const style = {
    position,
    '--vb-duration-one': `${19 / rate}s`,
    '--vb-duration-two': `${27 / rate}s`,
    '--vb-duration-three': `${23 / rate}s`,
    '--vb-delay-two': `${-11 / rate}s`,
    '--vb-delay-three': `${-17 / rate}s`,
  } as CSSProperties

  return (
    <div
      className={`violet-background ${className}`.trim()}
      style={style}
      data-paused={paused}
      data-texture={texture}
      data-dots={dots}
      aria-hidden="true"
    >
      <span /><span /><span />
    </div>
  )
}
