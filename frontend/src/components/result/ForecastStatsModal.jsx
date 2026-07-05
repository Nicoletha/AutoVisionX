import { useEffect, useMemo, useState } from 'react';
import {
  Loader2,
  TrendingUp,
  CalendarRange,
  BarChart3,
  DollarSign,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react';
import Modal from '../common/Modal';
import { getForecastStats } from '../../services/statsService';

function formatCurrency(value) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value ?? 0);
}

function StatBox({ label, value, icon: Icon, accent = 'var(--color-red)' }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
      <div
        className="pointer-events-none absolute right-[-18px] top-[-18px] h-14 w-14 rounded-full blur-2xl opacity-20"
        style={{ backgroundColor: accent }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-faint)]">
            {label}
          </p>
          <p className="mt-2 text-base font-semibold text-white sm:text-lg">
            {value}
          </p>
        </div>

        {Icon && (
          <div
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04]"
            style={{ color: accent }}
          >
            <Icon size={17} />
          </div>
        )}
      </div>
    </div>
  );
}

function YearBarChart({ yearlyAverages }) {
  const { minAvg, maxAvg, range } = useMemo(() => {
    if (!yearlyAverages?.length) {
      return { minAvg: 0, maxAvg: 0, range: 1 };
    }

    const prices = yearlyAverages.map((p) => p.avgPrice);
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    return {
      minAvg: min,
      maxAvg: max,
      range: max - min || 1,
    };
  }, [yearlyAverages]);

  if (!yearlyAverages?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-6 text-sm text-[var(--color-text-muted)]">
        No hay suficientes datos históricos para mostrar la tendencia.
      </div>
    );
  }

  return (
    <div className="rounded-[24px] border border-white/10 bg-black/20 p-4 sm:p-5">
      {/* Header del chart */}
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
            <BarChart3 size={14} className="text-[var(--color-red)]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
              Tendencia histórica
            </span>
          </div>

          <h3 className="mt-3 font-[var(--font-display)] text-lg font-semibold text-white sm:text-xl">
            Precio promedio por año
          </h3>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
            Serie histórica usada como base para calcular la proyección del
            siguiente modelo.
          </p>
        </div>

        <div className="w-fit rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-[var(--color-text-muted)]">
          Rango: {formatCurrency(minAvg)} — {formatCurrency(maxAvg)}
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),rgba(255,255,255,0.015)_45%,rgba(0,0,0,0.16))] p-3 sm:p-4">
        <div className="relative h-[220px] sm:h-[260px]">
          {/* líneas guía */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between py-2">
            {[0, 1, 2, 3].map((line) => (
              <div
                key={line}
                className="border-t border-dashed border-white/8"
              />
            ))}
          </div>

          {/* barras */}
          <div className="relative flex h-full items-end gap-2 overflow-x-auto pb-2">
            {yearlyAverages.map((point) => {
              const height = Math.max(
                ((point.avgPrice - minAvg) / range) * 100,
                10
              );

              return (
                <div
                  key={point.year}
                  className="group flex h-full min-w-[64px] flex-1 flex-col justify-end sm:min-w-[72px]"
                >
                  <div className="mb-2 text-center opacity-0 transition group-hover:opacity-100">
                    <span className="rounded-full border border-white/10 bg-black/60 px-2.5 py-1 text-[10px] text-white backdrop-blur">
                      {formatCurrency(point.avgPrice)}
                    </span>
                  </div>

                  <div className="relative flex flex-1 items-end">
                    <div
                      className="relative w-full rounded-t-xl border border-white/10 bg-gradient-to-t from-[var(--color-red-dim)] via-[var(--color-red)] to-[#ff706b] shadow-[0_12px_26px_rgba(225,6,0,0.22)] transition-all duration-300 group-hover:brightness-110"
                      style={{ height: `${height}%` }}
                      title={`${point.year}: ${formatCurrency(point.avgPrice)}`}
                    >
                      <div className="absolute inset-x-0 top-0 h-1/3 rounded-t-xl bg-[linear-gradient(180deg,rgba(255,255,255,0.24),transparent)]" />
                    </div>
                  </div>

                  <div className="mt-3 text-center">
                    <p className="text-[11px] font-medium text-white">
                      {point.year}
                    </p>
                    <p className="text-[10px] text-[var(--color-text-faint)]">
                      {formatCurrency(point.avgPrice)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ForecastStatsModal({
  open,
  onClose,
  realCarModel,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !realCarModel) return;

    setLoading(true);
    setError(null);

    getForecastStats(realCarModel)
      .then(setData)
      .catch((err) =>
        setError(
          err?.friendlyMessage ||
            'No se pudieron cargar las estadísticas de tendencia.'
        )
      )
      .finally(() => setLoading(false));
  }, [open, realCarModel]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Estadísticas de tendencia · ${realCarModel}`}
      size="xl"
    >
      <div className="space-y-5">
        {loading && (
          <div className="flex min-h-[260px] flex-col items-center justify-center gap-4 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015))] px-6 py-10 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-[var(--color-red)]">
              <Loader2 size={24} className="animate-spin" />
            </div>
            <div>
              <p className="text-base font-semibold text-white">
                Cargando estadísticas
              </p>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                Preparando la serie histórica y los promedios del modelo.
              </p>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-[24px] border border-[var(--color-red)]/25 bg-[var(--color-red)]/8 p-5">
            <div className="flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[var(--color-red)]/25 bg-[var(--color-red)]/12 text-[var(--color-red)]">
                <AlertTriangle size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  No se pudieron cargar las estadísticas
                </p>
                <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {data && !loading && !error && (
          <>
            {/* Intro */}
            <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)] sm:p-6">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_38%,transparent_70%,rgba(255,255,255,0.025))]" />
              <div className="pointer-events-none absolute right-[-70px] top-[-70px] h-40 w-40 rounded-full bg-[var(--color-red)]/16 blur-3xl" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                  <TrendingUp size={14} className="text-[var(--color-red)]" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                    Resumen estadístico
                  </span>
                </div>

                <h3 className="mt-4 font-[var(--font-display)] text-lg font-semibold text-white sm:text-[1.3rem]">
                  Comportamiento histórico del modelo
                </h3>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--color-text-muted)]">
                  Estas métricas se calculan a partir del histórico del dataset
                  sintético y sirven como base para la proyección del precio
                  futuro del modelo.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
              <StatBox
                label="Muestras"
                value={data.sampleCount}
                icon={BarChart3}
              />
              <StatBox
                label="Años analizados"
                value={data.yearCount}
                icon={CalendarRange}
              />
              <StatBox
                label="Promedio"
                value={formatCurrency(data.meanPrice)}
                icon={DollarSign}
              />
              <StatBox
                label="Mínimo"
                value={formatCurrency(data.minPrice)}
                icon={ArrowDownRight}
              />
              <StatBox
                label="Máximo"
                value={formatCurrency(data.maxPrice)}
                icon={ArrowUpRight}
              />
            </div>

            {/* Gráfico */}
            <YearBarChart yearlyAverages={data.yearlyAverages} />

            {/* Nota */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-[var(--color-text-muted)]">
              <span className="font-medium text-white">Nota:</span> la serie
              histórica mostrada proviene del dataset sintético usado para el
              pronóstico. La estimación del siguiente precio se genera a partir
              de una regresión lineal sobre estos puntos agregados por año.
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}