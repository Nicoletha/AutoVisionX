import { useState } from 'react';
import { DollarSign, Loader2, BarChart3 } from 'lucide-react';
import { predictPrice } from '../../services/priceService';
import PriceStatsModal from './PriceStatsModal';

const CONDITIONS = ['Excelente', 'Buena', 'Regular', 'Mala'];
const TRANSMISSIONS = ['Manual', 'Automática'];

function formatCurrency(value) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function PriceEstimateCard({ car }) {
  const [year, setYear] = useState(car?.year || 2020);
  const [mileage, setMileage] = useState(50000);
  const [condition, setCondition] = useState('Buena');
  const [transmission, setTransmission] = useState('Automática');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statsOpen, setStatsOpen] = useState(false);

  if (!car) return null;

  const handleEstimate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await predictPrice({
        realCarModel: car.realCarModel,
        brand: car.brand,
        year: Number(year),
        mileage: Number(mileage),
        condition,
        transmission,
      });
      setResult(data);
    } catch (err) {
      setError(err.friendlyMessage || 'No se pudo estimar el precio.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--color-panel-border)] bg-[var(--color-panel)]/50 p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <DollarSign size={16} className="text-[var(--color-red)]" />
        <p className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
          Valor estimado del auto real ({car.realCarModel})
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label className="text-xs text-[var(--color-text-muted)]">
          Año
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--color-panel-border)] bg-[var(--color-bg-elevated)] px-2.5 py-2 text-sm text-white outline-none focus:border-[var(--color-red)]"
          />
        </label>

        <label className="text-xs text-[var(--color-text-muted)]">
          Kilometraje
          <input
            type="number"
            min={0}
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--color-panel-border)] bg-[var(--color-bg-elevated)] px-2.5 py-2 text-sm text-white outline-none focus:border-[var(--color-red)]"
          />
        </label>

        <label className="text-xs text-[var(--color-text-muted)]">
          Condición
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--color-panel-border)] bg-[var(--color-bg-elevated)] px-2.5 py-2 text-sm text-white outline-none focus:border-[var(--color-red)]"
          >
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="text-xs text-[var(--color-text-muted)]">
          Transmisión
          <select
            value={transmission}
            onChange={(e) => setTransmission(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--color-panel-border)] bg-[var(--color-bg-elevated)] px-2.5 py-2 text-sm text-white outline-none focus:border-[var(--color-red)]"
          >
            {TRANSMISSIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={handleEstimate}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-red)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-red-glow)] disabled:opacity-50"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <DollarSign size={15} />}
          {loading ? 'Calculando…' : 'Calcular valor estimado'}
        </button>

        <button
          onClick={() => setStatsOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-panel-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-muted)] transition hover:border-[var(--color-red)] hover:text-white"
        >
          <BarChart3 size={15} />
          Ver estadísticas
        </button>
      </div>

      <PriceStatsModal
        open={statsOpen}
        onClose={() => setStatsOpen(false)}
        realCarModel={car.realCarModel}
      />

      {error && <p className="mt-3 text-xs text-[var(--color-red)]">{error}</p>}

      {result && !error && (
        <div className="mt-5 border-t border-[var(--color-panel-border)] pt-4">
          <p className="font-[var(--font-display)] text-2xl font-bold text-white">
            {formatCurrency(result.estimatedPrice)}
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            Rango estimado: {formatCurrency(result.priceRangeLow)} – {formatCurrency(result.priceRangeHigh)}
          </p>
          <p className="mt-2 text-[10px] leading-relaxed text-[var(--color-text-faint)]">
            Estimación generada por un modelo de regresión (RandomForest) entrenado con datos
            sintéticos de referencia de mercado. No constituye una tasación oficial.
          </p>
        </div>
      )}
    </div>
  );
}