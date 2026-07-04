import { Palette, Pipette } from 'lucide-react';

export default function ColorPaletteCard({
  primaryHex,
  primaryName,
  secondaryHexes = [],
  className = '',
}) {
  const accent = primaryHex || 'var(--color-red)';

  return (
    <div
      className={`relative overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.28)] sm:p-6 ${className}`}
    >
      {/* background accents */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_38%,transparent_70%,rgba(255,255,255,0.025))]" />
      <div
        className="pointer-events-none absolute right-[-70px] top-[-70px] h-44 w-44 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: accent }}
      />
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative flex h-full flex-col">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
              <Palette size={14} style={{ color: accent }} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                Análisis cromático
              </span>
            </div>

            <h3 className="mt-4 font-[var(--font-display)] text-xl font-semibold text-white sm:text-[1.35rem]">
              Color dominante detectado
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--color-text-muted)]">
              Se muestra el color principal del vehículo y los tonos
              secundarios detectados durante el análisis visual.
            </p>
          </div>

          <div
            className="inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
            style={{
              borderColor: `${accent}35`,
              background: `linear-gradient(180deg, ${accent}18, rgba(255,255,255,0.03))`,
              color: accent,
            }}
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: accent }}
            />
            Color base identificado
          </div>
        </div>

        {/* HORIZONTAL LAYOUT */}
        <div className="grid flex-1 grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          {/* COLOR PRINCIPAL */}
          <div className="rounded-[22px] border border-white/10 bg-black/20 p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <Pipette size={14} style={{ color: accent }} />
              <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-faint)]">
                Color principal
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div
                className="h-20 w-20 shrink-0 rounded-2xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:h-24 sm:w-24"
                style={{ backgroundColor: primaryHex || '#444' }}
              />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 font-[var(--font-mono)] text-sm font-semibold text-white">
                    {primaryHex || '—'}
                  </span>

                  {primaryName && (
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-[var(--color-text-muted)]">
                      {primaryName}
                    </span>
                  )}
                </div>

                <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
                  Tono predominante detectado en la superficie visible del auto.
                </p>
              </div>
            </div>
          </div>

          {/* COLORES SECUNDARIOS */}
          <div className="rounded-[22px] border border-white/10 bg-black/20 p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: accent }}
              />
              <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-faint)]">
                Colores secundarios
              </p>
            </div>

            {secondaryHexes.length > 0 ? (
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {secondaryHexes.map((hex) => (
                  <div
                    key={hex}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3"
                  >
                    <span
                      className="h-10 w-10 shrink-0 rounded-xl border border-white/10"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-text-faint)]">
                        HEX
                      </p>
                      <p className="truncate font-[var(--font-mono)] text-sm font-medium text-white">
                        {hex}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-5 text-sm text-[var(--color-text-muted)]">
                No se detectaron colores secundarios.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}