import { UploadCloud } from 'lucide-react';
import { useRef } from 'react';

const ACCEPTED_TYPES = 'image/jpeg,image/png,image/webp';

export default function UploadOptionCard({ active, onFileSelected }) {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
    e.target.value = '';
  };

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className={`group relative min-h-[210px] flex-1 overflow-hidden rounded-[28px] border p-6 text-left transition-all duration-300 ${
        active
          ? 'border-[var(--color-red)]/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] shadow-[0_0_0_1px_rgba(225,6,0,0.22),0_20px_45px_rgba(225,6,0,0.12)]'
          : 'border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] hover:border-[var(--color-red)]/30 hover:shadow-[0_0_0_1px_rgba(225,6,0,0.08),0_20px_45px_rgba(0,0,0,0.25)]'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        onChange={handleChange}
        className="hidden"
      />

      {/* subtle glow */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute -left-8 bottom-[-30px] h-32 w-32 rounded-full blur-3xl transition-opacity ${
            active ? 'bg-[var(--color-red)]/18 opacity-100' : 'bg-white/5 opacity-60'
          }`}
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_45%)]" />
      </div>

      <div className="relative z-10 flex h-full flex-col">
        {/* icon */}
        <div
          className={`mb-6 flex h-12 w-12 items-center justify-center rounded-[18px] border transition-all duration-300 ${
            active
              ? 'border-[var(--color-red)]/45 bg-[var(--color-red)]/12 text-[var(--color-red)] shadow-[0_0_18px_rgba(225,6,0,0.12)]'
              : 'border-white/10 bg-white/[0.04] text-[var(--color-text-muted)] group-hover:border-[var(--color-red)]/30 group-hover:text-[var(--color-red)]'
          }`}
        >
          <UploadCloud size={20} />
        </div>

        {/* text */}
        <div className="max-w-[220px]">
          <h3 className="font-[var(--font-display)] text-[1.55rem] font-semibold leading-tight text-white">
            Subir imagen
          </h3>

          <p className="mt-3 text-[13px] leading-7 text-[var(--color-text-muted)]">
            Formatos: JPG, PNG, WEBP. Máx. 10MB para iniciar el análisis visual.
          </p>
        </div>

        {/* bottom indicator */}
        <div className="mt-auto pt-6">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-faint)]">
            <span
              className={`h-2 w-2 rounded-full transition-all ${
                active ? 'bg-[var(--color-red)] shadow-[0_0_10px_rgba(255,0,0,0.8)]' : 'bg-white/20'
              }`}
            />
            Cargar archivo
          </div>
        </div>
      </div>
    </button>
  );
}