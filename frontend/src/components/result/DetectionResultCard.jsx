import {
  CheckCircle2,
  Gauge,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { formatPercentage } from '../../utils/format';

export default function DetectionResultCard({
  car,
  similarityScore,
  accentColor = 'var(--color-red)',
}) {
  const pct = similarityScore <= 1 ? similarityScore * 100 : similarityScore;
  const safePct = Math.max(0, Math.min(pct, 100));

  return (
    <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.28)] sm:p-6">
      {/* background accents */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_38%,transparent_70%,rgba(255,255,255,0.025))]" />
      <div
        className="pointer-events-none absolute right-[-70px] top-[-70px] h-40 w-40 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: accentColor }}
      />
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative">
        {/* top badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <CheckCircle2 size={14} className="text-emerald-300" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Coincidencia encontrada
            </span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
            <Sparkles size={12} style={{ color: accentColor }} />
            Resultado principal
          </div>
        </div>

        {/* title */}
        <div className="mt-4">
          <h1 className="font-[var(--font-display)] text-[1.85rem] font-bold leading-tight tracking-tight text-white sm:text-[2.15rem] xl:text-[2.35rem]">
            {car?.name || 'Modelo no identificado'}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
            Este es el modelo con mayor similitud encontrado a partir del
            análisis visual realizado sobre la imagen escaneada.
          </p>
        </div>


        {/* confidence panel */}
        <div className="mt-5 rounded-[22px] border border-white/10 bg-black/20 p-4 sm:p-5">
          <div className="flex flex-col gap-4">
            {/* top row */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Gauge size={15} style={{ color: accentColor }} />
                  <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-faint)]">
                    Confianza de coincidencia
                  </span>
                </div>

                <div className="mt-2 flex items-end gap-3">
                  <p
                    className="font-[var(--font-display)] text-[2rem] font-bold leading-none sm:text-[2.25rem]"
                    style={{ color: accentColor }}
                  >
                    {formatPercentage(safePct / 100)}
                  </p>

                  <span className="pb-1 text-sm text-[var(--color-text-muted)]">
                    similitud estimada
                  </span>
                </div>
              </div>

              <div
                className="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                style={{
                  borderColor: `${accentColor}35`,
                  background: `linear-gradient(180deg, ${accentColor}18, rgba(255,255,255,0.03))`,
                  color: accentColor,
                }}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
                Match estimado del sistema
              </div>
            </div>

            {/* progress */}
            <div>
              <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-[var(--color-text-faint)]">
                <span>Precisión estimada</span>
                <span>{Math.round(safePct)}%</span>
              </div>

              <div className="h-3 w-full overflow-hidden rounded-full border border-white/10 bg-[#16171d] shadow-[inset_0_2px_6px_rgba(0,0,0,0.35)]">
                <div
                  className="relative h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${safePct}%`,
                    background: `linear-gradient(90deg, ${accentColor}99, ${accentColor})`,
                    boxShadow: `0 0 18px ${accentColor}55`,
                  }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.22),transparent)]" />
                </div>
              </div>

              <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
                El sistema comparó la imagen capturada con el catálogo visual y
                determinó este porcentaje como el resultado con mayor similitud
                disponible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}