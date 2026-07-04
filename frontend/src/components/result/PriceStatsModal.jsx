import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Modal from '../common/Modal';
import { getPriceStats } from '../../services/statsService';

function formatCurrency(value) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function StatBox({ label, value }) {
  return (
    <div className="rounded-lg border border-[var(--color-panel-border)] bg-[var(--color-panel)]/50 p-2.5 text-center">
      <p className="text-[10px] uppercase tracking-wider text-[var(--color-text-faint)]">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

export default function PriceStatsModal({ open, onClose, realCarModel }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !realCarModel) return;
    setLoading(true);
    setError(null);
    getPriceStats(realCarModel)
      .then(setData)
      .catch((err) => setError(err.friendlyMessage || 'No se pudieron cargar las estadísticas.'))
      .finally(() => setLoading(false));
  }, [open, realCarModel]);

  const stats = data?.datasetStats;
  const maxBucketCount = stats ? Math.max(...stats.distribution.map((b) => b.count)) : 0;
  const maxImportance = data?.featureImportance?.[0]?.importance || 1;

  return (
    <Modal open={open} onClose={onClose} title={`Estadísticas del dataset · ${realCarModel}`}>
      {loading && (
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-[var(--color-text-muted)]">
          <Loader2 size={16} className="animate-spin" /> Cargando…
        </div>
      )}

      {error && <p className="text-sm text-[var(--color-red)]">{error}</p>}

      {stats && !loading && !error && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            <StatBox label="Muestras" value={stats.sampleCount} />
            <StatBox label="Promedio" value={formatCurrency(stats.meanPrice)} />
            <StatBox label="Mediana" value={formatCurrency(stats.medianPrice)} />
            <StatBox label="Mínimo" value={formatCurrency(stats.minPrice)} />
            <StatBox label="Máximo" value={formatCurrency(stats.maxPrice)} />
          </div>

          <div>
            <p className="mb-2 text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
              Distribución de precios (muestras sintéticas)
            </p>

            <div className="flex h-28 gap-1">
            {stats.distribution.map((bucket, i) => (
                <div key={i} className="flex h-full flex-1 flex-col justify-end">
                <div
                    className="w-full rounded-t-sm bg-gradient-to-t from-[var(--color-red-dim)] to-[var(--color-red)]"
                    style={{ height: `${Math.max((bucket.count / maxBucketCount) * 100, 2)}%` }}
                    title={`${formatCurrency(bucket.rangeLow)} – ${formatCurrency(bucket.rangeHigh)}: ${bucket.count} muestras`}
                />
                </div>
            ))}
            </div>

            <div className="mt-1 flex justify-between text-[10px] text-[var(--color-text-faint)]">
              <span>{formatCurrency(stats.distribution[0]?.rangeLow)}</span>
              <span>{formatCurrency(stats.distribution.at(-1)?.rangeHigh)}</span>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
              Importancia de características (RandomForest)
            </p>
            <div className="space-y-1.5">
              {data.featureImportance.slice(0, 8).map((f) => (
                <div key={f.feature} className="flex items-center gap-2">
                  <span className="w-32 shrink-0 truncate text-[11px] text-[var(--color-text-muted)]" title={f.feature}>
                    {f.feature}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#1c1c22]">
                    <div
                      className="h-full rounded-full bg-[var(--color-red)]"
                      style={{ width: `${(f.importance / maxImportance) * 100}%` }}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right text-[11px] text-[var(--color-text-faint)]">
                    {(f.importance * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] leading-relaxed text-[var(--color-text-faint)]">
            Dataset sintético generado a partir de rangos de mercado aproximados
            por modelo (ver <code>price_dataset.py</code>). No proviene de ventas reales.
          </p>
        </div>
      )}
    </Modal>
  );
}