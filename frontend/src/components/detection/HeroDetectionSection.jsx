import heroCar from '../../assets/Cars/Carro Inicio.png';

export default function HeroDetectionSection() {
  return (
    <div className="relative isolate w-full">
      <div className="relative isolate flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_50%_18%,rgba(18,18,24,0.96),rgba(8,8,12,0.99)_62%,rgba(5,5,8,1)_100%)] shadow-[0_30px_90px_rgba(0,0,0,0.45)] lg:aspect-[5/4]">
        {/* Outer frame */}
        <div className="pointer-events-none absolute inset-0 rounded-[30px] ring-1 ring-white/5" />
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:34px_34px]" />

        {/* Ambient glows */}
        <div className="absolute -left-16 top-12 h-56 w-56 rounded-full bg-[var(--color-red)]/18 blur-[95px]" />
        <div className="absolute right-[-40px] bottom-10 h-64 w-64 rounded-full bg-[var(--color-red)]/12 blur-[120px]" />
        <div className="absolute left-1/2 top-[24%] h-24 w-64 -translate-x-1/2 rounded-full bg-white/6 blur-3xl" />
        <div className="absolute left-1/2 top-[46%] h-44 w-[60%] -translate-x-1/2 rounded-full bg-[var(--color-red)]/8 blur-[100px]" />

        {/* subtle tech lines */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-7 right-7 top-[18%] h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
          <div className="absolute left-7 right-7 bottom-[22%] h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
          <div className="absolute left-[10%] top-[16%] bottom-[20%] w-px bg-gradient-to-b from-transparent via-white/6 to-transparent" />
          <div className="absolute right-[10%] top-[16%] bottom-[20%] w-px bg-gradient-to-b from-transparent via-white/6 to-transparent" />
        </div>

        {/* top labels */}
        <span className="absolute left-6 top-6 z-20 rounded-xl border border-white/10 bg-black/35 px-3 py-1.5 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)] backdrop-blur-sm">
          Vision · Ready
        </span>

        <span className="absolute right-6 top-6 z-20 flex items-center gap-2 rounded-xl border border-white/10 bg-black/35 px-3 py-1.5 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)] backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-[var(--color-success)] shadow-[0_0_12px_rgba(34,197,94,0.9)]" />
          IA activa
        </span>

        {/* scan frame */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-8 sm:px-10">
          <div className="relative h-[56%] w-full max-w-[560px] translate-y-2">
            <div className="absolute left-[2%] top-[8%] h-11 w-11 rounded-tl-3xl border-l-2 border-t-2 border-[var(--color-red)] shadow-[0_0_14px_rgba(255,0,0,0.4)]" />
            <div className="absolute right-[2%] top-[8%] h-11 w-11 rounded-tr-3xl border-r-2 border-t-2 border-[var(--color-red)] shadow-[0_0_14px_rgba(255,0,0,0.4)]" />
            <div className="absolute bottom-[8%] left-[2%] h-11 w-11 rounded-bl-3xl border-b-2 border-l-2 border-[var(--color-red)] shadow-[0_0_14px_rgba(255,0,0,0.4)]" />
            <div className="absolute bottom-[8%] right-[2%] h-11 w-11 rounded-br-3xl border-b-2 border-r-2 border-[var(--color-red)] shadow-[0_0_14px_rgba(255,0,0,0.4)]" />
          </div>
        </div>

        {/* center stage */}
        <div className="relative z-10 flex w-full items-center justify-center px-6 pt-10 sm:px-8">
          <div className="relative w-full max-w-[620px] translate-y-4 sm:translate-y-6">
            <div className="absolute left-1/2 top-[57%] h-44 w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-red)]/12 blur-3xl" />

            <img
              src={heroCar}
              alt="Auto deportivo Hot Wheels"
              className="relative z-10 w-full object-contain drop-shadow-[0_28px_55px_rgba(0,0,0,0.6)]"
            />

            <div className="pointer-events-none absolute inset-x-[8%] top-[57%] z-20 h-[3px] -translate-y-1/2 rounded-full bg-gradient-to-r from-[var(--color-red)]/0 via-[var(--color-red)] to-[var(--color-red)]/0 shadow-[0_0_24px_rgba(255,0,0,0.75)] animate-pulse" />
            <div className="pointer-events-none absolute inset-x-[12%] top-[57%] z-20 h-10 -translate-y-1/2 bg-[radial-gradient(circle,rgba(255,0,0,0.18)_0%,rgba(255,0,0,0.08)_40%,transparent_75%)] blur-md" />

            <div className="absolute left-[9%] top-[57%] z-20 h-4 w-4 -translate-y-1/2 rounded-full bg-[var(--color-red)] shadow-[0_0_18px_rgba(255,0,0,0.8)]" />
            <div className="absolute right-[10%] top-[57%] z-20 h-4 w-4 -translate-y-1/2 rounded-full bg-[#ff8f86] shadow-[0_0_18px_rgba(255,120,120,0.8)]" />

            <div className="absolute bottom-[6%] left-1/2 z-0 h-16 w-[76%] -translate-x-1/2 rounded-full bg-black/70 blur-xl" />
            <div className="absolute bottom-[1.5%] left-1/2 z-0 h-24 w-[82%] -translate-x-1/2 rounded-full border border-white/10 bg-[radial-gradient(circle_at_center,#1c1c24_0%,#0a0a10_74%)] shadow-[0_25px_70px_rgba(0,0,0,0.5)]" />
            <div className="absolute bottom-[6.5%] left-1/2 z-0 h-[3px] w-[60%] -translate-x-1/2 rounded-full bg-[var(--color-red)] shadow-[0_0_26px_rgba(255,0,0,0.7)]" />
            <div className="absolute bottom-[10%] left-1/2 z-0 h-[1px] w-[48%] -translate-x-1/2 bg-white/10" />
          </div>
        </div>

        {/* tiny code */}
        <div className="absolute bottom-5 left-7 hidden font-[var(--font-mono)] text-[9px] uppercase tracking-[0.18em] text-white/35 sm:block">
          HW-SCAN / VISUAL MATCH / COLOR EXTRACTION
        </div>
      </div>
    </div>
  );
}