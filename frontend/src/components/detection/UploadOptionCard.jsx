import {
  ChevronRight,
  HardDriveUpload,
  ImagePlus,
  UploadCloud,
} from 'lucide-react';
import { useRef } from 'react';

const ACCEPTED_TYPES = 'image/jpeg,image/png,image/webp';

const SPECS = [
  { label: 'FORMATOS', value: 'JPG · PNG · WEBP' },
  { label: 'PESO', value: 'HASTA 10MB' },
  { label: 'MODO', value: 'LOCAL INPUT' },
];

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
      className={`group relative w-full overflow-hidden rounded-[30px] border text-left transition-all duration-300 ${
        active
          ? 'border-[var(--color-red)]/50 bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.02))] shadow-[0_0_0_1px_rgba(225,6,0,0.15),0_24px_60px_rgba(225,6,0,0.08)]'
          : 'border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] hover:border-[var(--color-red)]/28 hover:shadow-[0_24px_60px_rgba(0,0,0,0.28)]'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        onChange={handleChange}
        className="hidden"
      />

      {/* ===================== FX / HUD ===================== */}
      <div className="pointer-events-none absolute inset-0">
        {/* glow */}
        <div className="absolute -left-14 bottom-[-32px] h-36 w-36 rounded-full bg-[var(--color-red)]/12 blur-3xl" />
        <div className="absolute right-[-30px] top-[-20px] h-28 w-28 rounded-full bg-white/[0.03] blur-3xl" />

        {/* top line */}
        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[var(--color-red)]/35 to-transparent" />

        {/* scanner corners */}
        <div className="absolute left-4 top-4 h-6 w-6 rounded-tl-xl border-l border-t border-[var(--color-red)]/35" />
        <div className="absolute right-4 top-4 h-6 w-6 rounded-tr-xl border-r border-t border-[var(--color-red)]/35" />
        <div className="absolute bottom-4 left-4 h-6 w-6 rounded-bl-xl border-b border-l border-[var(--color-red)]/35" />
        <div className="absolute bottom-4 right-4 h-6 w-6 rounded-br-xl border-b border-r border-[var(--color-red)]/35" />

        {/* frame interno */}
        <div className="absolute inset-[10px] rounded-[24px] border border-white/[0.05]" />

        {/* barra lateral roja */}
        <div className="absolute bottom-6 left-0 top-6 w-[3px] rounded-r-full bg-gradient-to-b from-transparent via-[var(--color-red)] to-transparent shadow-[0_0_18px_rgba(255,0,0,0.55)]" />
      </div>

      {/* ===================== CONTENT ===================== */}
      <div className="relative z-10 grid min-h-[260px] grid-cols-1 gap-6 p-5 sm:p-6 xl:grid-cols-[185px_minmax(0,1fr)_130px] xl:items-center">
        {/* LEFT VISUAL */}
        <div className="flex items-center justify-center xl:justify-start">
          <div className="relative flex h-[132px] w-[132px] items-center justify-center rounded-[32px] border border-[var(--color-red)]/25 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015))] shadow-[0_0_36px_rgba(225,6,0,0.12)]">
            {/* rings */}
            <div className="absolute inset-[12px] rounded-[24px] border border-[var(--color-red)]/14" />
            <div className="absolute inset-[26px] rounded-[18px] border border-white/8" />

            <UploadCloud
              size={46}
              className="text-[var(--color-red)] drop-shadow-[0_0_14px_rgba(255,0,0,0.45)]"
            />

            {/* tiny badge */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-[var(--color-red)]/25 bg-[rgba(12,12,18,0.95)] px-3 py-1">
              <span className="font-[var(--font-display)] text-[9px] uppercase tracking-[0.18em] text-[var(--color-red)]">
                Upload
              </span>
            </div>
          </div>
        </div>

        {/* CENTER */}
        <div className="min-w-0">
          {/* top tech label */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5">
              <HardDriveUpload
                size={13}
                className={
                  active
                    ? 'text-[var(--color-red)]'
                    : 'text-[var(--color-text-muted)]'
                }
              />
              <span className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                Input Module
              </span>
            </div>

            <div className="rounded-full border border-[var(--color-red)]/18 bg-[var(--color-red)]/8 px-3 py-1.5">
              <span className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.18em] text-[var(--color-red)]">
                Local Source
              </span>
            </div>
          </div>

          {/* title */}
          <h3 className="mt-5 font-[var(--font-display)] text-[1.95rem] font-bold uppercase tracking-[0.08em] text-white sm:text-[2.1rem]">
            Subir imagen
          </h3>

          <p className="mt-2 max-w-[40rem] text-[15px] leading-7 text-[var(--color-text-muted)]">
            Importa una fotografía desde tu dispositivo para iniciar el
            reconocimiento visual del automóvil y el análisis del sistema.
          </p>

          {/* specs */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {SPECS.map((item) => (
              <div
                key={item.label}
                className="rounded-[18px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),rgba(255,255,255,0.015))] px-3.5 py-3"
              >
                <p className="font-[var(--font-display)] text-[9px] uppercase tracking-[0.22em] text-[var(--color-text-faint)]">
                  {item.label}
                </p>
                <p className="mt-1.5 text-sm font-medium uppercase tracking-[0.04em] text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* bottom chips */}
          <div className="mt-5 flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-red)]/25 bg-[var(--color-red)]/10 px-3 py-1.5">
              <ImagePlus size={13} className="text-[var(--color-red)]" />
              <span className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.18em] text-[var(--color-red)]">
                Recomendado
              </span>
            </div>

            <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
              <span className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                Alta compatibilidad
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT CTA */}
        <div className="flex items-center justify-center xl:justify-end">
          <div className="relative flex h-[110px] w-[110px] items-center justify-center rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.02)]">
            {/* outer ring */}
            <div className="absolute inset-[12px] rounded-[22px] border border-[var(--color-red)]/16" />

            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[var(--color-red)]/35 bg-[var(--color-red)]/10 shadow-[0_0_28px_rgba(225,6,0,0.18)] transition duration-300 group-hover:scale-105 group-hover:shadow-[0_0_34px_rgba(225,6,0,0.28)]">
              <ChevronRight
                size={30}
                className="translate-x-[1px] text-[var(--color-red)]"
                strokeWidth={2.3}
              />
            </div>

            {/* text under arrow */}
            <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2">
              <span className="font-[var(--font-display)] text-[9px] uppercase tracking-[0.2em] text-[var(--color-text-faint)]">
                Launch
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}