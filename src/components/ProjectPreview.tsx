import { useEffect, useRef, useState, type MouseEvent } from 'react'
import anime from 'animejs'

type Variant = 'compressz' | 'sessionclock' | 'cinematch' | 'compressf'

interface ProjectPreviewProps {
  variant: Variant
  href: string
  label: string
}

/**
 * Renders a small faithful recreation of the product's real UI (matched to
 * ADJ's own screenshots) and plays a click -> ripple -> navigate animation
 * on click. Modifier-clicks (cmd/ctrl/middle-click) skip the animation and
 * let the browser open the link normally, since the element is a real <a>.
 */
export default function ProjectPreview({ variant, href, label }: ProjectPreviewProps) {
  const containerRef = useRef<HTMLAnchorElement>(null)

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    const isModified = e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1
    if (isModified) return
    e.preventDefault()

    const el = containerRef.current
    if (!el) {
      window.location.href = href
      return
    }

    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const cursor = document.createElement('div')
    cursor.className = 'pv-cursor'
    cursor.style.left = `${x}px`
    cursor.style.top = `${y}px`
    el.appendChild(cursor)

    const ripple = document.createElement('span')
    ripple.className = 'pv-ripple'
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`
    el.appendChild(ripple)

    const tl = anime.timeline({
      easing: 'easeOutQuint',
      complete: () => {
        window.location.href = href
      },
    })

    tl.add({
      targets: cursor,
      scale: [1, 0.72],
      duration: 140,
      direction: 'alternate',
    })
      .add(
        {
          targets: ripple,
          scale: [0, 14],
          opacity: [0.5, 0],
          duration: 620,
          easing: 'easeOutExpo',
        },
        '-=120',
      )
      .add(
        {
          targets: el,
          scale: [1, 0.97],
          opacity: [1, 0.55],
          duration: 380,
          easing: 'easeInQuad',
        },
        '-=480',
      )
  }

  return (
    <a
      ref={containerRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="pv-root relative block h-full w-full cursor-pointer overflow-hidden"
    >
      <span className="sr-only">{`Open ${label} in a new tab`}</span>
      <div aria-hidden="true" className="h-full w-full">
        {variant === 'compressz' && <CompressZPreview />}
        {variant === 'sessionclock' && <SessionClockPreview />}
        {variant === 'cinematch' && <CinematchPreview />}
        {variant === 'compressf' && <CompressFPreview />}
      </div>
    </a>
  )
}

function CompressZPreview() {
  return (
    <div className="flex h-full w-full flex-col items-start justify-center bg-[#0a0a0e] px-6 py-5">
      <span className="mb-3 rounded-full border border-violet/30 bg-violet/10 px-2.5 py-1 font-mono text-[9px] tracking-wide text-violet">
        Client-side · Zero uploads
      </span>
      <p className="font-display text-[22px] font-bold leading-[1.08] text-ink">
        Compress anything.
        <br />
        <span className="grad-text animate-shimmer">Stay private.</span>
      </p>
      <div className="mt-4 flex gap-3 font-mono text-[9px] text-ink-dim">
        <span>✓ No uploads</span>
        <span>✓ No tracking</span>
        <span>✓ Open source</span>
      </div>
    </div>
  )
}

function SessionClockPreview() {
  const [tick, setTick] = useState(9)

  useEffect(() => {
    const id = window.setInterval(() => {
      setTick((t) => (t + 1) % 10)
    }, 1400)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#1c1730] via-[#120f1e] to-[#0a0910] px-6 py-5">
      <div className="absolute inset-0 opacity-40 [background:radial-gradient(1px_1px_at_20%_30%,#fff,transparent),radial-gradient(1px_1px_at_70%_60%,#fff,transparent),radial-gradient(1px_1px_at_40%_80%,#fff,transparent)]" />
      <p className="relative z-10 mb-1 font-mono text-[9px] uppercase tracking-widest text-ink-dim">
        🌙 Good night
      </p>
      <p className="relative z-10 font-display text-[30px] font-extrabold tabular-nums leading-none text-ink">
        01<span className="text-violet">:</span>0{tick}
        <span className="ml-1 text-[11px] font-medium text-ink-dim">AM</span>
      </p>
      <div className="relative z-10 mt-4 h-1.5 w-40 overflow-hidden rounded-full bg-white/10">
        <span className="block h-full w-[5%] rounded-full grad-fill" />
      </div>
      <span className="relative z-10 mt-4 rounded-full bg-violet px-4 py-1.5 font-mono text-[10px] font-semibold text-canvas">
        Begin Session
      </span>
    </div>
  )
}

function CinematchPreview() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#0a0a10] px-6 py-5 text-center">
      <p className="mb-2 font-mono text-[8px] tracking-wide text-blue">
        no server · nothing tracked · no mystery box
      </p>
      <p className="grad-text animate-shimmer font-display text-[20px] font-extrabold leading-[1.1]">
        Find what to watch,
        <br />
        in 60 seconds
      </p>
      <div className="mt-4 flex items-center gap-2 rounded-full bg-pink/15 px-3 py-1.5">
        <span className="grad-fill flex h-4 w-4 items-center justify-center rounded-full font-mono text-[8px] font-bold text-canvas">
          L
        </span>
        <span className="font-mono text-[8px] text-ink-dim">26 titles rated</span>
      </div>
    </div>
  )
}

function CompressFPreview() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#120a06] px-6 py-5">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <path
          d="M32 6 44 14 44 24 32 32 20 24 20 14Z"
          className="fill-[#ff3e00]/20 stroke-[#ff3e00]"
          strokeWidth="1.5"
        />
        <path
          d="M32 30 44 38 44 50 32 58 20 50 20 38Z"
          className="fill-[#ff3e00]/10 stroke-[#ff3e00]/60"
          strokeWidth="1.5"
        />
      </svg>
      <p className="font-mono text-[10px] tracking-wide text-[#ff8a5c]">svelte-built · sibling app</p>
    </div>
  )
}
