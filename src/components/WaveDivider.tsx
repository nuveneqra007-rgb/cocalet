interface WaveDividerProps {
  color?: string
  flip?: boolean
  className?: string
}

export default function WaveDivider({
  color = 'rgba(230, 29, 43, 0.1)',
  flip = false,
  className = '',
}: WaveDividerProps) {
  return (
    <div
      className={`relative w-full overflow-hidden pointer-events-none ${className}`}
      style={{
        height: '80px',
        transform: flip ? 'scaleY(-1)' : 'none',
      }}
    >
      <svg
        className="absolute bottom-0 w-[200%]"
        style={{ animation: 'waveFlow 10s linear infinite' }}
        viewBox="0 0 2400 80"
        preserveAspectRatio="none"
      >
        <path
          d="M0,40 C150,70 350,10 600,40 C850,70 1050,10 1200,40 C1350,70 1550,10 1800,40 C2050,70 2250,10 2400,40 L2400,80 L0,80 Z"
          fill={color}
        />
      </svg>
      <svg
        className="absolute bottom-0 w-[200%]"
        style={{ animation: 'waveFlow 14s linear infinite reverse' }}
        viewBox="0 0 2400 80"
        preserveAspectRatio="none"
      >
        <path
          d="M0,50 C200,20 400,70 600,50 C800,20 1000,70 1200,50 C1400,20 1600,70 1800,50 C2000,20 2200,70 2400,50 L2400,80 L0,80 Z"
          fill={color}
          opacity="0.5"
        />
      </svg>
    </div>
  )
}
