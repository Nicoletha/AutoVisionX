import heroCar from '../../assets/Cars/Carro Inicio.png';

export default function HeroDetectionSection() {
  return (
    <div className="relative isolate w-full">
      <div className="relative isolate flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_50%_16%,rgba(24,24,32,0.96),rgba(9,9,14,0.99)_62%,rgba(5,5,8,1)_100%)] shadow-[0_30px_90px_rgba(0,0,0,0.45)] lg:aspect-[5/4]">
        {/* marco / glow */}
        <div className="pointer-events-none absolute inset-0 rounded-[30px] ring-1 ring-white/5" />
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_35%,transparent_72%,rgba(255,255,255,0.03))]" />

        {/* grid sutil */}
        <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:34px_34px]" />

        {/* glows */}
        <div className="absolute -left-16 top-12 h-56 w-56 rounded-full bg-[var(--color-red)]/16 blur-[95px]" />
        <div className="absolute right-[-40px] bottom-10 h-64 w-64 rounded-full bg-[var(--color-red)]/12 blur-[120px]" />
        <div className="absolute left-1/2 top-[23%] h-24 w-64 -translate-x-1/2 rounded-full bg-white/6 blur-3xl" />

        {/* líneas técnicas */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-7 right-7 top-[18%] h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
          <div className="absolute left-7 right-7 bottom-[22%] h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
          <div className="absolute left-[10%] top-[16%] bottom-[20%] w-px bg-gradient-to-b from-transparent via-white/6 to-transparent" />
          <div className="absolute right-[10%] top-[16%] bottom-[20%] w-px bg-gradient-to-b from-transparent via-white/6 to-transparent" />
        </div>

        {/* etiquetas superiores */}
        <span className="absolute left-6 top-6 z-20 rounded-xl border border-white/10 bg-black/35 px-3 py-1.5 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)] backdrop-blur-sm">
          Vision · Ready
        </span>

        <span className="absolute right-6 top-6 z-20 flex items-center gap-2 rounded-xl border border-white/10 bg-black/35 px-3 py-1.5 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)] backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-[var(--color-success)] shadow-[0_0_12px_rgba(34,197,94,0.9)]" />
          IA activa
        </span>

        {/* labels laterales */}
        <div className="absolute left-7 top-[30%] hidden rounded-lg border border-white/10 bg-black/25 px-2.5 py-1 font-[var(--font-mono)] text-[9px] uppercase tracking-[0.18em] text-white/45 md:block">
          Scan frame
        </div>

        <div className="absolute right-7 top-[40%] hidden rounded-lg border border-white/10 bg-black/25 px-2.5 py-1 font-[var(--font-mono)] text-[9px] uppercase tracking-[0.18em] text-white/45 md:block">
          Model match
        </div>

        {/* marco de escaneo */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-8 sm:px-10">
          <div className="relative h-[62%] w-full max-w-[610px]">
            <div className="absolute left-0 top-0 h-11 w-11 rounded-tl-2xl border-l-2 border-t-2 border-[var(--color-red)] shadow-[0_0_14px_rgba(255,0,0,0.32)]" />
            <div className="absolute right-0 top-0 h-11 w-11 rounded-tr-2xl border-r-2 border-t-2 border-[var(--color-red)] shadow-[0_0_14px_rgba(255,0,0,0.32)]" />
            <div className="absolute bottom-0 left-0 h-11 w-11 rounded-bl-2xl border-b-2 border-l-2 border-[var(--color-red)] shadow-[0_0_14px_rgba(255,0,0,0.32)]" />
            <div className="absolute bottom-0 right-0 h-11 w-11 rounded-br-2xl border-b-2 border-r-2 border-[var(--color-red)] shadow-[0_0_14px_rgba(255,0,0,0.32)]" />
          </div>
        </div>

        {/* stage principal */}
        <div className="relative z-10 flex w-full items-center justify-center px-4 sm:px-6">
          <div className="relative w-full max-w-[700px]">
            {/* glow detrás del auto */}
            <div className="absolute left-1/2 top-[54%] h-48 w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-red)]/12 blur-3xl" />

            {/* auto */}
            <img
              src={heroCar}
              alt="Auto deportivo Hot Wheels"
              className="relative z-10 mx-auto w-[94%] max-w-[660px] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.62)]"
            />

            {/* línea de escaneo */}
            <div className="pointer-events-none absolute inset-x-[8%] top-[56%] z-20 h-[3px] -translate-y-1/2 rounded-full bg-gradient-to-r from-[var(--color-red)]/0 via-[var(--color-red)] to-[var(--color-red)]/0 shadow-[0_0_24px_rgba(255,0,0,0.75)] animate-pulse" />
            <div className="pointer-events-none absolute inset-x-[12%] top-[56%] z-20 h-10 -translate-y-1/2 bg-[radial-gradient(circle,rgba(255,0,0,0.18)_0%,rgba(255,0,0,0.08)_40%,transparent_75%)] blur-md" />

            {/* marcadores */}
            <div className="absolute left-[9%] top-[56%] z-20 h-4 w-4 -translate-y-1/2 rounded-full bg-[var(--color-red)] shadow-[0_0_18px_rgba(255,0,0,0.8)]" />
            <div className="absolute right-[10%] top-[56%] z-20 h-4 w-4 -translate-y-1/2 rounded-full bg-[#ff8f86] shadow-[0_0_18px_rgba(255,120,120,0.8)]" />

            {/* pedestal */}
            <div className="absolute bottom-[8%] left-1/2 z-0 h-16 w-[72%] -translate-x-1/2 rounded-full bg-black/60 blur-xl" />
            <div className="absolute bottom-[5%] left-1/2 z-0 h-20 w-[78%] -translate-x-1/2 rounded-full border border-white/10 bg-[radial-gradient(circle_at_center,#1a1a22_0%,#0b0b11_72%)] shadow-[0_20px_60px_rgba(0,0,0,0.45)]" />
            <div className="absolute bottom-[9%] left-1/2 z-0 h-[3px] w-[58%] -translate-x-1/2 rounded-full bg-[var(--color-red)] shadow-[0_0_20px_rgba(255,0,0,0.65)]" />
            <div className="absolute bottom-[11.5%] left-1/2 z-0 h-[1px] w-[48%] -translate-x-1/2 bg-white/10" />
          </div>
        </div>

        {/* hud inferior */}
        <div className="absolute bottom-5 left-5 right-5 z-20">
          <div className="grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-black/30 p-3 backdrop-blur-md sm:grid-cols-3 sm:p-4">
            <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
              <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-white/45">
                Modelo
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                Nissan Skyline
              </p>
            </div>

            <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
              <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-white/45">
                Color detectado
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[var(--color-red)]" />
                <p className="text-sm font-semibold text-white">Rojo / Negro</p>
              </div>
            </div>

            <div className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
              <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-white/45">
                Match estimado
              </p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-white">94.6%</p>
                <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[94%] rounded-full bg-[var(--color-red)]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* código inferior */}
        <div className="absolute bottom-28 left-7 hidden font-[var(--font-mono)] text-[9px] uppercase tracking-[0.18em] text-white/35 sm:block">
          HW-SCAN / VISUAL MATCH / COLOR EXTRACTION
        </div>
      </div>
    </div>
  );
}