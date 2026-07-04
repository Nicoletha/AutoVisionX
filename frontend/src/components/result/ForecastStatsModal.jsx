import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Modal from '../common/Modal';
import { getForecastStats } from '../../services/statsService';

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

export default function ForecastStatsModal({ open, onClose, realCarModel }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open || !realCarModel) return;
    setLoading(true);
    setError(null);
    getForecastStats(realCarModel)
      .then(setData)
      .catch((err) => setError(err.friendlyMessage || 'No se pudieron cargar las estadísticas.'))
      .finally(() => setLoading(false));
  }, [open, realCarModel]);

  const maxAvg = data ? Math.max(...data.yearlyAverages.map((p) => p.avgPrice)) : 0;
  const minAvg = data ? Math.min(...data.yearlyAverages.map((p) => p.avgPrice)) : 0;
  const range = maxAvg - minAvg || 1;

  return (
    <Modal open={open} onClose={onClose} title={`Estadísticas de tendencia · ${realCarModel}`}>
      {loading && (
        <div className="flex items-center justify-center gap-2 py-10 text-sm text-[var(--color-text-muted)]">
          <Loader2 size={16} className="animate-spin" /> Cargando…
        </div>
      )}

      {error && <p className="text-sm text-[var(--color-red)]">{error}</p>}

      {data && !loading && !error && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            <StatBox label="Muestras" value={data.sampleCount} />
            <StatBox label="Años" value={data.yearCount} />
            <StatBox label="Promedio" value={formatCurrency(data.meanPrice)} />
            <StatBox label="Mínimo" value={formatCurrency(data.minPrice)} />
            <StatBox label="Máximo" value={formatCurrency(data.maxPrice)} />
          </div>

          <div>
            <p className="mb-2 text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
              Precio promedio por año (histórico usado para la tendencia)
            </p>
            <div className="flex h-28 gap-1.5">
            {data.yearlyAverages.map((point) => (
                <div key={point.year} className="flex h-full flex-1 flex-col justify-end">
                <div
                    className="w-full rounded-t-sm bg-gradient-to-t from-[var(--color-red-dim)] to-[var(--color-red)]"
                    style={{
                    height: `${Math.max(((point.avgPrice - minAvg) / range) * 100, 4)}%`,
                    }}
                    title={`${point.year}: ${formatCurrency(point.avgPrice)}`}
                />
                </div>
            ))}
            </div>
            <div className="mt-1 flex gap-1.5">
            {data.yearlyAverages.map((point) => (
                <span
                key={point.year}
                className="flex-1 text-center text-[9px] text-[var(--color-text-faint)]"
                >
                {String(point.year).slice(2)}
                </span>
            ))}
            </div>
          </div>

          <p className="text-[10px] leading-relaxed text-[var(--color-text-faint)]">
            Serie histórica agregada del dataset sintético (ver <code>price_dataset.py</code>).
            La proyección aplica una regresión lineal sobre estos puntos.
          </p>
        </div>
      )}
    </Modal>
  );
}