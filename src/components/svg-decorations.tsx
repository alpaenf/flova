// Reusable SVG decorative components for consistent visual language across FLOVA

export function HeroBlob({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 600"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="blob1Grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#2563EB" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="400" cy="300" rx="350" ry="280" fill="url(#blob1Grad)">
        <animateTransform
          attributeName="transform"
          type="scale"
          values="1;1.05;1"
          dur="6s"
          repeatCount="indefinite"
          additive="sum"
        />
      </ellipse>
    </svg>
  )
}

export function GridPattern({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="400" height="400" fill="url(#grid)" />
    </svg>
  )
}

export function WaveDecoration({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 120"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M0,60 C180,100 360,20 540,60 C720,100 900,20 1080,60 C1260,100 1440,40 1440,60 L1440,120 L0,120 Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function CircleRings({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
      <circle cx="100" cy="100" r="65" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
      <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.1" />
    </svg>
  )
}

export function FlowArrows({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 200"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#2563EB" fillOpacity="0.4" />
        </marker>
      </defs>
      {/* Flowing path representing service stages */}
      <path
        d="M 50,100 Q 150,40 250,100 Q 350,160 450,100 Q 500,70 540,100"
        fill="none"
        stroke="#2563EB"
        strokeWidth="2"
        strokeOpacity="0.3"
        strokeDasharray="8 4"
        markerEnd="url(#arrowhead)"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="-48"
          dur="2s"
          repeatCount="indefinite"
        />
      </path>
      {/* Stage nodes */}
      {[50, 175, 300, 425, 540].map((x, i) => (
        <circle
          key={i}
          cx={x}
          cy={i % 2 === 0 ? 100 : i === 1 ? 60 : 140}
          r="8"
          fill="#2563EB"
          fillOpacity="0.2"
          stroke="#2563EB"
          strokeWidth="1.5"
          strokeOpacity="0.5"
        />
      ))}
    </svg>
  )
}

export function DotMatrix({ className = '' }: { className?: string }) {
  const dots = []
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 10; col++) {
      dots.push(
        <circle
          key={`${row}-${col}`}
          cx={col * 24 + 12}
          cy={row * 24 + 12}
          r="2"
          fill="currentColor"
          fillOpacity={0.1 + (row + col) * 0.01}
        />
      )
    }
  }
  return (
    <svg viewBox="0 0 240 144" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      {dots}
    </svg>
  )
}

export function BottleneckGraphic({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#DC2626" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      {/* Bars representing stages */}
      {[
        { x: 40, h: 60, w: 40, grad: 'url(#barGrad1)' },
        { x: 100, h: 90, w: 40, grad: 'url(#barGrad1)' },
        { x: 160, h: 140, w: 40, grad: 'url(#barGrad2)' },
        { x: 220, h: 50, w: 40, grad: 'url(#barGrad1)' },
        { x: 280, h: 70, w: 40, grad: 'url(#barGrad1)' },
      ].map((bar, i) => (
        <g key={i}>
          <rect
            x={bar.x}
            y={180 - bar.h}
            width={bar.w}
            height={bar.h}
            rx="6"
            fill={bar.grad}
          >
            <animate
              attributeName="height"
              from="0"
              to={bar.h}
              dur={`${0.4 + i * 0.15}s`}
              fill="freeze"
            />
            <animate
              attributeName="y"
              from="180"
              to={180 - bar.h}
              dur={`${0.4 + i * 0.15}s`}
              fill="freeze"
            />
          </rect>
        </g>
      ))}
      {/* Baseline */}
      <line x1="20" y1="180" x2="380" y2="180" stroke="#E2E8F0" strokeWidth="1.5" />
      {/* Bottleneck label */}
      <text x="180" y="165" textAnchor="middle" fill="#EF4444" fontSize="9" fontWeight="600" opacity="0.8">BOTTLENECK</text>
    </svg>
  )
}

export function AuthBackground({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 800"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="authGrad1" cx="30%" cy="20%" r="50%">
          <stop offset="0%" stopColor="#2563EB" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="authGrad2" cx="70%" cy="80%" r="50%">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="800" fill="url(#authGrad1)" />
      <rect width="800" height="800" fill="url(#authGrad2)" />
      {/* Subtle grid */}
      <g opacity="0.04" stroke="#2563EB" strokeWidth="0.5">
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 40} x2="800" y2={i * 40} />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="800" />
        ))}
      </g>
    </svg>
  )
}
