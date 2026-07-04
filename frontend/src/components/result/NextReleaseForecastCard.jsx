import { useState } from 'react';
import { TrendingUp, TrendingDown, Loader2, BarChart3 } from 'lucide-react';
import { forecastNextRelease } from '../../services/forecastService';
import ForecastStatsModal from './ForecastStatsModal';

function formatCurrency(value) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function NextReleaseForecastCard({ car }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statsOpen, setStatsOpen] = useState(false);

  if (!car) return null;

  const handleForecast = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await forecastNextRelease({ realCarModel: car.realCarModel });
      setResult(data);
    } catch (err) {
      setError(err.friendlyMessage || 'No se pudo generar la proyección.');
    } finally {
      setLoading(false);
    }
  };

  const isAppreciating = result && result.trendSlopePerYear >= 0;

  return (
    <div className="rounded-2xl border border-[var(--color-panel-border)] bg-[var(--color-panel)]/50 p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <TrendingUp size={16} className="text-[var(--color-red)]" />
        <p className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
          Proyección del próximo lanzamiento ({car.realCarModel})
        </p>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-muted)]">
        Estima el precio del auto real basándose en la tendencia histórica de
        precios de este modelo (regresión de tendencia, distinta al cálculo de
        valor actual).
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={handleForecast}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-panel-border)] px-4 py-2.5 text-sm font-semibold text-white transition hover:border-[var(--color-red)] disabled:opacity-50"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <TrendingUp size={15} />}
          {loading ? 'Proyectando…' : 'Proyectar próximo año'}
        </button>

        <button
          onClick={() => setStatsOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-panel-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-muted)] transition hover:border-[var(--color-red)] hover:text-white"
        >
          <BarChart3 size={15} />
          Ver estadísticas
        </button>
      </div>

      <ForecastStatsModal
        open={statsOpen}
        onClose={() => setStatsOpen(false)}
        realCarModel={car.realCarModel}
      />

      {error && <p className="mt-3 text-xs text-[var(--color-red)]">{error}</p>}

      {result && !error && (
        <div className="mt-5 border-t border-[var(--color-panel-border)] pt-4">
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-[var(--color-bg-elevated)] px-2 py-0.5 text-xs font-medium text-white">
              {result.targetYear}
            </span>
            {isAppreciating ? (
              <TrendingUp size={14} className="text-[var(--color-success)]" />
            ) : (
              <TrendingDown size={14} className="text-[var(--color-red)]" />
            )}
          </div>
          <p className="mt-2 font-[var(--font-display)] text-2xl font-bold text-white">
            {formatCurrency(result.predictedPrice)}
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            Tendencia: {result.trendSlopePerYear >= 0 ? '+' : ''}
            {formatCurrency(result.trendSlopePerYear)} por año · Basado en {result.basedOnYearFrom}–{result.basedOnYearTo}
          </p>
          <p className="mt-2 text-[10px] leading-relaxed text-[var(--color-text-faint)]">
            Proyección lineal sobre datos históricos sintéticos (R² = {result.rSquared}).
            No constituye una predicción financiera garantizada.
          </p>
        </div>
      )}
    </div>
  );
}