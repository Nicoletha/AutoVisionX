import { ChevronRight, UploadCloud } from 'lucide-react';
import { useRef } from 'react';

const ACCEPTED_TYPES = 'image/jpeg,image/png,image/webp';

export default function UploadOptionCard({ active = false, onFileSelected }) {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFileSelected?.(file);
    e.target.value = '';
  };

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className={`group relative w-full overflow-hidden rounded-[28px] border text-left transition-all duration-300 ${
        active
          ? 'border-[var(--color-red)]/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] shadow-[0_0_0_1px_rgba(225,6,0,0.18),0_22px_55px_rgba(225,6,0,0.12)]'
          : 'border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] hover:border-[var(--color-red)]/28 hover:shadow-[0_0_0_1px_rgba(225,6,0,0.08),0_22px_50px_rgba(0,0,0,0.28)]'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        onChange={handleChange}
        className="hidden"
      />

      {/* background FX */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute -left-8 bottom-[-28px] h-32 w-32 rounded-full blur-3xl transition-opacity duration-300 ${
            active
              ? 'bg-[var(--color-red)]/18 opacity-100'
              : 'bg-[var(--color-red)]/8 opacity-70'
          }`}
        />
        <div className="absolute right-[-24px] top-[-24px] h-28 w-28 rounded-full bg-white/[0.03] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.045),transparent_42%,transparent_70%,rgba(255,255,255,0.02))]" />
        <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div className="relative z-10 grid min-h-[220px] grid-cols-1 gap-6 p-5 sm:p-6 xl:grid-cols-[170px_minmax(0,1fr)_120px] xl:items-center">
        {/* LEFT ICON */}
        <div className="flex items-center xl:justify-start">
          <div className="relative flex h-[128px] w-[128px] items-center justify-center rounded-[30px] border border-[var(--color-red)]/30 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),rgba(255,255,255,0.02)_55%,rgba(0,0,0,0.18)_100%)] shadow-[0_0_30px_rgba(225,6,0,0.12)]">
            <div className="absolute inset-[10px] rounded-[24px] border border-[var(--color-red)]/15" />
            <UploadCloud
              size={42}
              className="text-[var(--color-red)] drop-shadow-[0_0_12px_rgba(255,0,0,0.45)]"
            />
          </div>
        </div>

        {/* CENTER CONTENT */}
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5">
            <UploadCloud
              size={13}
              className={
                active
                  ? 'text-[var(--color-red)]'
                  : 'text-[var(--color-text-muted)]'
              }
            />
            <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
              Archivo local
            </span>
          </div>

          <h3 className="mt-5 font-[var(--font-display)] text-[1.75rem] font-semibold tracking-wide text-white">
            SUBIR IMAGEN
          </h3>

          <p className="mt-2 text-[15px] text-[var(--color-text-muted)]">
            Desde tu dispositivo
          </p>

          <div className="mt-5 space-y-1.5 text-sm text-[var(--color-text-muted)]">
            <p>Formatos: JPG, PNG, WEBP</p>
            <p>Tamaño máximo: 10MB</p>
          </div>

          <div className="mt-5 inline-flex rounded-lg border border-[var(--color-red)]/30 bg-[var(--color-red)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-red)]">
            Recomendado
          </div>
        </div>

        {/* RIGHT CTA */}
        <div className="flex items-center xl:justify-end">
          <div className="flex h-[92px] w-[92px] items-center justify-center rounded-[26px] border border-white/10 bg-[rgba(255,255,255,0.02)]">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--color-red)]/35 bg-[var(--color-red)]/10 shadow-[0_0_24px_rgba(225,6,0,0.18)] transition group-hover:scale-105">
              <ChevronRight
                size={28}
                className="text-[var(--color-red)]"
                strokeWidth={2.2}
              />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}