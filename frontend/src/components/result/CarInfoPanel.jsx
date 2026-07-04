import {
  Tag,
  Car,
  Layers,
  Calendar,
  Gem,
  Palette,
  FileText,
} from 'lucide-react';

function InfoItem({ icon: Icon, label, value, accentColor }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 transition-all duration-300 hover:border-white/15 hover:bg-white/[0.045]">
      {/* glow sutil */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: accentColor || 'var(--color-red)' }}
      />

      <div className="relative flex items-start gap-3">
        <span
          className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
          style={{
            borderColor: `${accentColor || 'var(--color-red)'}35`,
            background: `linear-gradient(180deg, ${
              accentColor || 'var(--color-red)'
            }18, rgba(255,255,255,0.03))`,
            color: accentColor || 'var(--color-red)',
          }}
        >
          <Icon size={15} />
        </span>

        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-faint)]">
            {label}
          </p>
          <p className="mt-1 text-sm font-medium leading-6 text-white">
            {value || '—'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CarInfoPanel({
  car,
  accentColor = 'var(--color-red)',
}) {
  if (!car) return null;

  return (
    <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.28)] sm:p-6">
      {/* background accents */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_38%,transparent_70%,rgba(255,255,255,0.025))]" />
      <div
        className="pointer-events-none absolute left-[-80px] top-[-80px] h-48 w-48 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: accentColor }}
      />
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative">
        {/* header */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
              <FileText size={14} style={{ color: accentColor }} />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                Información del modelo
              </span>
            </div>

            <h3 className="mt-4 font-[var(--font-display)] text-xl font-semibold text-white sm:text-[1.35rem]">
              Detalles del vehículo detectado
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
              Consulta la descripción general del automóvil, su serie, rareza,
              año y otros atributos asociados al modelo identificado.
            </p>
          </div>

          {/* accent chip */}
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
            Color base detectado
          </div>
        </div>

        {/* descripción */}
        <div className="rounded-[22px] border border-white/10 bg-black/20 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-faint)]">
              Descripción
            </p>
          </div>

          <p className="mt-3 text-sm leading-6 text-[var(--color-text)] sm:text-[15px]">
            {car.description || 'Sin descripción disponible.'}
          </p>
        </div>

        {/* info grid */}
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <InfoItem
            icon={Tag}
            label="Marca"
            value={car.brand}
            accentColor={accentColor}
          />
          <InfoItem
            icon={Car}
            label="Modelo real"
            value={car.realCarModel}
            accentColor={accentColor}
          />
          <InfoItem
            icon={Layers}
            label="Serie"
            value={car.series}
            accentColor={accentColor}
          />
          <InfoItem
            icon={Calendar}
            label="Año"
            value={car.year}
            accentColor={accentColor}
          />
          <InfoItem
            icon={Gem}
            label="Rareza"
            value={car.rarity}
            accentColor={accentColor}
          />
          <InfoItem
            icon={Palette}
            label="Color oficial"
            value={car.colorName}
            accentColor={accentColor}
          />
        </div>
      </div>
    </div>
  );
}