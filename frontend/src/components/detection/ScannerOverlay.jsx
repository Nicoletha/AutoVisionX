export default function ScannerOverlay({ imageUrl }) {
  return (
    <div className="relative mx-auto w-full max-w-4xl overflow-hidden rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_50%_18%,rgba(18,18,24,0.96),rgba(8,8,12,0.99)_62%,rgba(5,5,8,1)_100%)] shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
      {/* Outer frame */}
      <div className="pointer-events-none absolute inset-0 rounded-[30px] ring-1 ring-white/5" />
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:34px_34px]" />

      {/* Ambient glows */}
      <div className="absolute left-[-60px] top-[20%] h-60 w-60 rounded-full bg-[var(--color-red)]/18 blur-[110px]" />
      <div className="absolute right-[-80px] bottom-[10%] h-72 w-72 rounded-full bg-[var(--color-red)]/10 blur-[130px]" />
      <div className="absolute left-1/2 top-[48%] h-36 w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-red)]/10 blur-[90px]" />

      {/* Top label */}
      <div className="absolute left-6 top-6 z-20 rounded-xl border border-white/10 bg-black/35 px-3 py-1.5 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)] backdrop-blur-sm">
        Scan frame
      </div>

      {/* Main content */}
      <div className="relative aspect-[16/10] w-full">
        {/* Scan frame corners */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6 sm:px-10">
          <div className="relative h-[74%] w-full max-w-[780px]">
            <div className="absolute left-[2%] top-[4%] h-12 w-12 rounded-tl-3xl border-l-2 border-t-2 border-[var(--color-red)] shadow-[0_0_14px_rgba(255,0,0,0.4)]" />
            <div className="absolute right-[2%] top-[4%] h-12 w-12 rounded-tr-3xl border-r-2 border-t-2 border-[var(--color-red)] shadow-[0_0_14px_rgba(255,0,0,0.4)]" />
            <div className="absolute bottom-[4%] left-[2%] h-12 w-12 rounded-bl-3xl border-b-2 border-l-2 border-[var(--color-red)] shadow-[0_0_14px_rgba(255,0,0,0.4)]" />
            <div className="absolute bottom-[4%] right-[2%] h-12 w-12 rounded-br-3xl border-b-2 border-r-2 border-[var(--color-red)] shadow-[0_0_14px_rgba(255,0,0,0.4)]" />
          </div>
        </div>

        {/* Image area */}
        <div className="relative z-10 flex h-full items-center justify-center px-8 py-10 sm:px-12">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Auto a analizar"
              className="relative z-10 max-h-[78%] w-auto max-w-[84%] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-sm text-[var(--color-text-muted)]">
              Sin imagen
            </div>
          )}
        </div>

        {/* Scan line */}
        <div className="pointer-events-none absolute inset-x-[10%] top-1/2 z-30 h-[4px] -translate-y-1/2 rounded-full bg-gradient-to-r from-[var(--color-red)]/0 via-[var(--color-red)] to-[var(--color-red)]/0 shadow-[0_0_28px_rgba(255,0,0,0.85)] animate-pulse" />
        <div className="pointer-events-none absolute inset-x-[14%] top-1/2 z-30 h-14 -translate-y-1/2 bg-[radial-gradient(circle,rgba(255,0,0,0.18)_0%,rgba(255,0,0,0.08)_42%,transparent_75%)] blur-md" />

        {/* Side scanner ticks */}
        <div className="pointer-events-none absolute left-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2 sm:flex">
          <span className="h-px w-5 bg-white/15" />
          <span className="h-px w-8 bg-white/20" />
          <span className="h-px w-5 bg-white/15" />
        </div>

        <div className="pointer-events-none absolute right-4 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2 sm:flex">
          <span className="h-px w-5 bg-white/15" />
          <span className="h-px w-8 bg-white/20" />
          <span className="h-px w-5 bg-white/15" />
        </div>

        {/* Bottom glow / pedestal */}
        <div className="pointer-events-none absolute bottom-[8%] left-1/2 z-0 h-12 w-[52%] -translate-x-1/2 rounded-full bg-[var(--color-red)]/12 blur-2xl" />

        {/* Vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_52%,rgba(0,0,0,0.58))]" />
      </div>
    </div>
  );
}