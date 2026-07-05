import {
  Activity,
  Cpu,
  Crosshair,
  Palette,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import heroCar from '../../assets/Cars/ChatGPT Image 5 jul 2026, 01_19_03 a.m..png';

const FEATURES = [
  {
    title: 'Reconocimiento',
    text: 'Identificación del modelo',
    icon: Crosshair,
  },
  {
    title: 'Detección',
    text: 'Color dominante y HEX',
    icon: Palette,
  },
  {
    title: 'Análisis',
    text: 'Procesamiento visual en tiempo real',
    icon: Cpu,
  },
];

const FLOW = [
  'Captura de imagen',
  'Extracción de características',
  'Comparación con catálogo',
  'Detección de color',
];

export default function HeroDetectionSection() {
  return (
    <section className="relative overflow-hidden rounded-[34px] border border-[var(--color-red)]/20 bg-[linear-gradient(180deg,#0c0c12_0%,#09090f_100%)] px-4 py-5 shadow-[0_30px_90px_rgba(0,0,0,0.42)] sm:px-6 sm:py-6 xl:px-8 xl:py-8">
      {/* fondo general del hero */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.03),transparent_30%,transparent_70%,rgba(255,255,255,0.015))]" />
        <div className="absolute left-[-120px] top-[-120px] h-72 w-72 rounded-full bg-[var(--color-red)]/10 blur-3xl" />
        <div className="absolute right-[-120px] bottom-[-120px] h-80 w-80 rounded-full bg-[var(--color-red)]/8 blur-3xl" />
        <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-red)]/25 to-transparent" />
      </div>

      {/* top badges */}
      <div className="relative z-10 mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-red)]/35 bg-[var(--color-red)]/10 px-4 py-2">
            <Sparkles size={13} className="text-[var(--color-red)]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-red)] sm:text-[11px]">
              Sistema de reconocimiento visual
            </span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.85)]" />
            <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--color-text-muted)] sm:text-[11px]">
              IA activa
            </span>
          </div>
        </div>

        <div className="hidden 2xl:inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2">
          <Activity size={13} className="text-[var(--color-red)]" />
          <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
            Escaneo · modelo · color · coincidencia
          </span>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-6 xl:grid-cols-[290px_minmax(0,1fr)] 2xl:grid-cols-[300px_minmax(620px,1fr)_260px]">
        {/* LEFT */}
        <div className="flex flex-col">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-red)] sm:text-[12px]">
              Visión artificial automotriz
            </p>

            <h1 className="mt-4 font-[var(--font-display)] text-[2.7rem] font-bold uppercase leading-[0.9] tracking-tight text-white sm:text-[3.1rem] xl:text-[3.6rem] 2xl:text-[4rem]">
              Escanea tu
              <span className="block text-[var(--color-red)]">automóvil</span>
            </h1>

            <p className="mt-5 max-w-[300px] text-[14px] leading-7 text-[var(--color-text-muted)] sm:text-[15px]">
              Identifica el modelo, consulta información visual y detecta el
              color dominante de tu automóvil mediante inteligencia artificial.
            </p>
          </div>

          <div className="mt-7 space-y-4">
            {FEATURES.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),rgba(255,255,255,0.015))] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] border border-[var(--color-red)]/25 bg-[var(--color-red)]/10 text-[var(--color-red)] shadow-[0_0_22px_rgba(225,6,0,0.12)]">
                      <Icon size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-faint)]">
                        {item.title}
                      </p>
                      <p className="mt-1 text-[0.98rem] font-semibold leading-6 text-white">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-[24px] border border-emerald-500/20 bg-[linear-gradient(180deg,rgba(10,40,24,0.55),rgba(6,22,14,0.82))] p-5 shadow-[0_20px_45px_rgba(0,0,0,0.28)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                  Sistema operativo
                </p>
                <div className="mt-3 text-[2.8rem] font-bold leading-none text-emerald-400">
                  100%
                </div>
              </div>

              <div className="mt-1 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-2 text-emerald-300">
                <ShieldCheck size={18} />
              </div>
            </div>

            <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300 shadow-[0_0_16px_rgba(52,211,153,0.6)]" />
            </div>
          </div>
        </div>

        {/* CENTER */}
        <div className="relative min-w-0">
          <div className="relative h-[420px] overflow-hidden rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_50%_20%,rgba(18,18,24,0.96),rgba(9,9,14,0.98)_62%,rgba(5,5,8,1)_100%)] shadow-[0_28px_80px_rgba(0,0,0,0.38)] sm:h-[480px] lg:h-[560px] 2xl:h-[620px]">
            {/* SOLO fondo limpio y leve glow */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <div className="absolute left-1/2 top-[50%] h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-red)]/10 blur-[120px]" />
            </div>

            {/* badge central */}
            <div className="absolute left-1/2 top-4 z-20 -translate-x-1/2 rounded-[20px] border border-[var(--color-red)]/35 bg-[rgba(14,14,20,0.88)] px-5 py-3 text-center shadow-[0_0_30px_rgba(225,6,0,0.12)] sm:px-8 sm:py-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-red)] sm:text-[12px]">
                Escaneo activo
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)] sm:text-[11px]">
                Detección · color · modelo
              </div>
            </div>

            {/* esquinas scanner */}
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6 sm:px-10">
              <div className="relative h-[72%] w-full max-w-[860px]">
                <div className="absolute left-[4%] top-[12%] h-14 w-14 rounded-tl-[26px] border-l-2 border-t-2 border-[var(--color-red)] shadow-[0_0_22px_rgba(255,0,0,0.45)] sm:h-20 sm:w-20 sm:rounded-tl-[32px]" />
                <div className="absolute right-[4%] top-[12%] h-14 w-14 rounded-tr-[26px] border-r-2 border-t-2 border-[var(--color-red)] shadow-[0_0_22px_rgba(255,0,0,0.45)] sm:h-20 sm:w-20 sm:rounded-tr-[32px]" />
                <div className="absolute bottom-[8%] left-[4%] h-14 w-14 rounded-bl-[26px] border-b-2 border-l-2 border-[var(--color-red)] shadow-[0_0_22px_rgba(255,0,0,0.45)] sm:h-20 sm:w-20 sm:rounded-bl-[32px]" />
                <div className="absolute bottom-[8%] right-[4%] h-14 w-14 rounded-br-[26px] border-b-2 border-r-2 border-[var(--color-red)] shadow-[0_0_22px_rgba(255,0,0,0.45)] sm:h-20 sm:w-20 sm:rounded-br-[32px]" />
              </div>
            </div>

            {/* AUTO MÁS GRANDE Y SIN ADORNOS ABAJO */}
            <div className="relative z-10 flex h-full items-center justify-center px-2 pt-12 sm:px-4 xl:px-6">
              <img
                src={heroCar}
                alt="Auto deportivo"
                className="relative z-10 w-[120%] max-w-[1150px] object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.7)] sm:w-[112%] lg:w-[108%] 2xl:w-[112%]"
              />
            </div>

            <div className="absolute bottom-5 left-5 hidden font-[var(--font-mono)] text-[9px] uppercase tracking-[0.18em] text-white/30 sm:block">
              HW-SCAN / VISUAL MATCH / COLOR EXTRACTION
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="grid grid-cols-1 gap-4 xl:col-span-2 xl:grid-cols-2 2xl:col-span-1 2xl:flex 2xl:flex-col">
          <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-faint)]">
              Modelo estimado
            </p>
            <p className="mt-2 text-[1.8rem] font-bold text-white">Deportivo</p>
          </div>

          <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-faint)]">
              Color detectado
            </p>
            <p className="mt-2 text-[1.8rem] font-bold text-[var(--color-red)]">
              #E10600
            </p>
          </div>

          <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-faint)]">
              Coincidencia visual
            </p>
            <p className="mt-2 text-[1.8rem] font-bold text-white">94.6%</p>
          </div>

          <div className="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-faint)]">
              Estado de análisis
            </p>
            <p className="mt-2 text-[1.55rem] font-bold text-white">Óptimo</p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),rgba(255,255,255,0.015))] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.2)] xl:col-span-2 2xl:col-span-1">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-[var(--color-red)]" />
              <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-faint)]">
                Flujo del sistema
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {FLOW.map((item, index) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--color-red)]/25 bg-[var(--color-red)]/10 text-[12px] font-semibold text-[var(--color-red)]">
                    {index + 1}
                  </div>
                  <p className="text-[15px] text-[var(--color-text-muted)]">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-white">
                <ShieldCheck size={16} className="text-emerald-400" />
                Calibración óptima del sistema
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}