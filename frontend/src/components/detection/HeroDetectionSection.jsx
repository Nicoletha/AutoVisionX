import {
  Crosshair,
  Gauge,
  Monitor,
  Palette,
  Sparkles,
  Radar,
  Cpu,
  Activity,
} from 'lucide-react';
import heroCar from '../../assets/Cars/ChatGPT Image 5 jul 2026, 01_19_03 a.m..png';

const FEATURES = [
  {
    title: 'RECONOCIMIENTO',
    subtitle: 'DE MODELO',
    icon: Crosshair,
  },
  {
    title: 'DETECCIÓN',
    subtitle: 'DE COLOR HEX',
    icon: Palette,
  },
  {
    title: 'ANÁLISIS',
    subtitle: 'EN TIEMPO REAL',
    icon: Sparkles,
  },
];

const SIDE_STATS = [
  {
    label: 'MODELO',
    value: 'DEPORTIVO',
    meta: 'Serie HW',
    icon: Crosshair,
    accent: 'text-white',
  },
  {
    label: 'COLOR',
    value: '#E10600',
    meta: 'Rojo intenso',
    icon: Palette,
    accent: 'text-[var(--color-red)]',
  },
  {
    label: 'RESOLUCIÓN',
    value: 'ULTRA HD 4K',
    meta: 'Scanner ready',
    icon: Monitor,
    accent: 'text-white',
  },
];

export default function HeroDetectionSection() {
  return (
    <section className="relative overflow-hidden rounded-[40px] border border-[var(--color-red)]/24 bg-[linear-gradient(180deg,#080a10_0%,#04060a_100%)] p-3 shadow-[0_34px_110px_rgba(0,0,0,0.45)] sm:p-4 xl:p-5">
      {/* frame interno */}
      <div className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,12,18,0.98),rgba(7,8,12,1))] px-4 py-4 sm:px-6 sm:py-6 xl:px-7 xl:py-7">
        {/* ======================= FONDO HERO ======================= */}
        <div className="pointer-events-none absolute inset-0">
          {/* grid */}
          <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px]" />

          {/* gradiente */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.015),transparent_20%,transparent_80%,rgba(255,255,255,0.015))]" />

          {/* glows */}
          <div className="absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full bg-[var(--color-red)]/10 blur-3xl" />
          <div className="absolute right-[-140px] bottom-[-140px] h-96 w-96 rounded-full bg-[var(--color-red)]/8 blur-3xl" />
          <div className="absolute left-1/2 top-[18%] h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-[var(--color-red)]/8 blur-[140px]" />

          {/* línea superior */}
          <div className="absolute inset-x-20 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-red)]/28 to-transparent" />
        </div>

        {/* ======================= TOP BAR ======================= */}
        <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-3">
            <div className="h-[2px] w-10 bg-[var(--color-red)] shadow-[0_0_12px_rgba(255,0,0,0.5)]" />
            <span className="font-[var(--font-display)] text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--color-red)] sm:text-[11px]">
              Sistema de reconocimiento visual
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.9)]" />
              <span className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                IA activa
              </span>
            </div>

            <div className="rounded-[18px] border border-[var(--color-red)]/28 bg-[rgba(12,12,18,0.9)] px-5 py-3 text-center shadow-[0_0_30px_rgba(225,6,0,0.08)]">
              <div className="font-[var(--font-display)] text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-red)]">
                Escaneo activo
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                Detección · color · modelo
              </div>
            </div>
          </div>
        </div>

        {/* ======================= GRID HERO ======================= */}
        <div className="relative z-10 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)_260px] 2xl:grid-cols-[340px_minmax(0,1fr)_280px]">
          {/* ================= LEFT ================= */}
          <div className="flex flex-col">
            <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-red)]/18 bg-[var(--color-red)]/8 px-3 py-1.5">
                <Radar size={13} className="text-[var(--color-red)]" />
                <span className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.18em] text-[var(--color-red)]">
                  Visión artificial automotriz
                </span>
              </div>

              <h1 className="mt-5 font-[var(--font-display)] text-[2.45rem] font-bold uppercase leading-[0.9] tracking-[0.04em] text-white sm:text-[3rem] xl:text-[3.7rem]">
                Escanea tu
                <span className="mt-1 block text-[var(--color-red)]">
                  automóvil
                </span>
              </h1>

              <p className="mt-5 max-w-[340px] text-[15px] leading-8 text-[var(--color-text-muted)]">
                Identifica el modelo, consulta información y detecta el color
                dominante de tu auto en segundos con visión artificial.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                  <Cpu size={13} className="text-[var(--color-red)]" />
                  <span className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.18em] text-white">
                    AutoVisionX
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                  <Activity size={13} className="text-emerald-400" />
                  <span className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.18em] text-white">
                    Precisión alta
                  </span>
                </div>
              </div>
            </div>

            {/* features */}
            <div className="mt-5 space-y-3">
              {FEATURES.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] px-4 py-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-[16px] border border-[var(--color-red)]/25 bg-[var(--color-red)]/10 text-[var(--color-red)] shadow-[0_0_20px_rgba(225,6,0,0.12)]">
                        <Icon size={18} />
                      </div>

                      <div>
                        <p className="font-[var(--font-display)] text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
                          {item.title}
                        </p>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* progress */}
            <div className="mt-5 rounded-[24px] border border-emerald-500/20 bg-[linear-gradient(180deg,rgba(8,40,22,0.55),rgba(6,20,12,0.9))] p-5">
              <div className="font-[var(--font-display)] text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                Sistema operativo
              </div>

              <div className="mt-3 flex items-end gap-3">
                <span className="font-[var(--font-display)] text-[2.4rem] font-bold leading-none text-emerald-400">
                  100%
                </span>
                <div className="mb-1 h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300 shadow-[0_0_16px_rgba(52,211,153,0.35)]" />
                </div>
              </div>
            </div>
          </div>

          {/* ================= CENTER ================= */}
          <div className="relative min-w-0">
            <div className="relative h-[430px] sm:h-[520px] xl:h-[650px] 2xl:h-[690px]">
              {/* glow rojo central */}
              <div className="pointer-events-none absolute left-1/2 top-[54%] h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-red)]/14 blur-[140px]" />

              {/* HUD / plataforma */}
              <div className="pointer-events-none absolute inset-0">
                {/* línea roja principal */}
                <div className="absolute left-1/2 top-[49%] h-[2px] w-[94%] -translate-x-1/2 bg-[var(--color-red)] shadow-[0_0_24px_rgba(255,0,0,0.85)]" />

                {/* aros de plataforma */}
                <div className="absolute bottom-[13%] left-1/2 h-[220px] w-[88%] -translate-x-1/2 rounded-full border border-[var(--color-red)]/18" />
                <div className="absolute bottom-[15.5%] left-1/2 h-[178px] w-[72%] -translate-x-1/2 rounded-full border border-[var(--color-red)]/22" />
                <div className="absolute bottom-[18%] left-1/2 h-[126px] w-[54%] -translate-x-1/2 rounded-full border border-[var(--color-red)]/20" />

                {/* glow piso */}
                <div className="absolute bottom-[16%] left-1/2 h-[120px] w-[72%] -translate-x-1/2 rounded-full bg-[var(--color-red)]/12 blur-[55px]" />

                {/* líneas horizontales pequeñas */}
                <div className="absolute left-[8%] top-[31%] h-px w-[18%] bg-gradient-to-r from-transparent to-[var(--color-red)]/50" />
                <div className="absolute right-[8%] top-[31%] h-px w-[18%] bg-gradient-to-l from-transparent to-[var(--color-red)]/50" />
                <div className="absolute left-[8%] bottom-[27%] h-px w-[16%] bg-gradient-to-r from-transparent to-[var(--color-red)]/40" />
                <div className="absolute right-[8%] bottom-[27%] h-px w-[16%] bg-gradient-to-l from-transparent to-[var(--color-red)]/40" />
              </div>

              {/* esquinas scanner */}
              <div className="pointer-events-none absolute inset-0 z-20">
                <div className="absolute left-[8%] top-[20%] h-14 w-14 rounded-tl-[24px] border-l-[3px] border-t-[3px] border-[var(--color-red)] shadow-[0_0_24px_rgba(255,0,0,0.45)] sm:h-20 sm:w-20" />
                <div className="absolute right-[8%] top-[20%] h-14 w-14 rounded-tr-[24px] border-r-[3px] border-t-[3px] border-[var(--color-red)] shadow-[0_0_24px_rgba(255,0,0,0.45)] sm:h-20 sm:w-20" />
                <div className="absolute bottom-[18%] left-[8%] h-14 w-14 rounded-bl-[24px] border-b-[3px] border-l-[3px] border-[var(--color-red)] shadow-[0_0_24px_rgba(255,0,0,0.45)] sm:h-20 sm:w-20" />
                <div className="absolute bottom-[18%] right-[8%] h-14 w-14 rounded-br-[24px] border-b-[3px] border-r-[3px] border-[var(--color-red)] shadow-[0_0_24px_rgba(255,0,0,0.45)] sm:h-20 sm:w-20" />
              </div>

              {/* micro labels flotantes */}
              <div className="pointer-events-none absolute left-[8%] top-[34%] z-20 hidden rounded-full border border-white/10 bg-[rgba(10,12,18,0.88)] px-3 py-1.5 xl:block">
                <span className="font-[var(--font-display)] text-[9px] uppercase tracking-[0.18em] text-white">
                  AI Tracking
                </span>
              </div>

              <div className="pointer-events-none absolute right-[8%] top-[34%] z-20 hidden rounded-full border border-white/10 bg-[rgba(10,12,18,0.88)] px-3 py-1.5 xl:block">
                <span className="font-[var(--font-display)] text-[9px] uppercase tracking-[0.18em] text-white">
                  Color Mapping
                </span>
              </div>

              {/* carro */}
              <div className="relative z-10 flex h-full items-center justify-center px-2 pt-8 sm:px-4 xl:px-0">
                <img
                  src={heroCar}
                  alt="Auto deportivo"
                  className="w-[132%] max-w-[1280px] object-contain drop-shadow-[0_50px_95px_rgba(0,0,0,0.86)] sm:w-[118%] xl:w-[124%] 2xl:w-[128%]"
                />
              </div>
            </div>
          </div>

          {/* ================= RIGHT ================= */}
          <div className="flex flex-col gap-4">
            {SIDE_STATS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-[24px] border border-white/10 bg-[rgba(10,12,18,0.9)] p-5"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 ${
                        item.label === 'COLOR'
                          ? 'text-[var(--color-red)]'
                          : 'text-[var(--color-text-muted)]'
                      }`}
                    >
                      <Icon size={18} />
                    </div>

                    <div>
                      <p className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-faint)]">
                        {item.label}
                      </p>
                      <p
                        className={`mt-2 font-[var(--font-display)] text-[1.2rem] font-semibold uppercase tracking-[0.04em] ${item.accent}`}
                      >
                        {item.value}
                      </p>
                      <p className="mt-1 text-sm uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                        {item.meta}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* calibración */}
            <div className="mt-auto rounded-[24px] border border-[var(--color-red)]/18 bg-[linear-gradient(180deg,rgba(12,12,18,0.9),rgba(9,10,14,0.96))] p-5">
              <div className="flex items-center gap-3">
                <Gauge size={18} className="text-[var(--color-red)]" />
                <div>
                  <p className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-faint)]">
                    Calibración
                  </p>
                  <p className="mt-1 font-[var(--font-display)] text-[1rem] font-semibold uppercase tracking-[0.04em] text-white">
                    Óptima
                  </p>
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-[var(--color-red)] to-[#ff786f] shadow-[0_0_16px_rgba(255,0,0,0.25)]" />
              </div>

              <div className="mt-2 flex items-center justify-between font-[var(--font-display)] text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                <span>Precisión</span>
                <span>94.6%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}