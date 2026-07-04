import { useEffect, useMemo, useState } from 'react';
import {
  Image as ImageIcon,
  ScanSearch,
  GalleryHorizontal,
} from 'lucide-react';
import CarSilhouette from '../common/CarSilhouette';

export default function CarImageGallery({
  analyzedImageUrl,
  referenceImages = [],
}) {
  const thumbs = useMemo(
    () =>
      [
        {
          id: 'analyzed',
          url: analyzedImageUrl,
          label: 'Foto analizada',
          type: 'analyzed',
        },
        ...referenceImages.map((img, i) => ({
          id: img.id ?? `ref-${i}`,
          url: img.imageUrl ?? img.url ?? img,
          label: img.angleType ?? `Referencia ${i + 1}`,
          type: 'reference',
        })),
      ].filter((t) => t.url),
    [analyzedImageUrl, referenceImages]
  );

  const [active, setActive] = useState(thumbs[0]?.id ?? 'analyzed');

  useEffect(() => {
    if (thumbs.length > 0 && !thumbs.some((t) => t.id === active)) {
      setActive(thumbs[0].id);
    }
  }, [thumbs, active]);

  const activeItem =
    thumbs.find((t) => t.id === active) ??
    thumbs[0] ?? {
      id: 'empty',
      url: analyzedImageUrl,
      label: 'Vista principal',
      type: 'analyzed',
    };

  return (
    <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] p-4 shadow-[0_18px_50px_rgba(0,0,0,0.28)] sm:p-5">
      {/* background accents */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_38%,transparent_70%,rgba(255,255,255,0.025))]" />
      <div className="pointer-events-none absolute left-[-70px] top-[-70px] h-36 w-36 rounded-full bg-[var(--color-red)]/14 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative">
        {/* Header */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
              <GalleryHorizontal
                size={14}
                className="text-[var(--color-red)]"
              />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                Galería visual
              </span>
            </div>

            <h3 className="mt-3 font-[var(--font-display)] text-lg font-semibold text-white sm:text-[1.2rem]">
              Imagen analizada y referencias
            </h3>

            <p className="mt-1.5 max-w-xl text-sm leading-6 text-[var(--color-text-muted)]">
              Visualiza la imagen procesada por el sistema y compárala con las
              referencias del modelo identificado.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--color-red)]/20 bg-[var(--color-red)]/10 px-3 py-2 text-[11px] font-medium text-[var(--color-red)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            <ScanSearch size={14} />
            Vista del análisis
          </div>
        </div>

        {/* Main preview */}
        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[radial-gradient(circle_at_50%_30%,rgba(28,28,38,0.95),rgba(10,10,14,1)_72%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          {/* subtle grid */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px]" />

          {/* top labels */}
          <div className="absolute left-4 top-4 z-20 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white/80 backdrop-blur">
              {activeItem.type === 'analyzed'
                ? 'Imagen escaneada'
                : 'Referencia visual'}
            </span>

            <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[10px] text-[var(--color-text-muted)] backdrop-blur">
              {activeItem.label}
            </span>
          </div>

          <div className="relative aspect-[4/3] w-full min-h-[260px] sm:min-h-[300px]">
            {activeItem?.url ? (
              <img
                src={activeItem.url}
                alt={activeItem.label}
                className="h-full w-full object-contain p-4 sm:p-6"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-6">
                <div className="flex w-full max-w-[340px] flex-col items-center justify-center rounded-[24px] border border-white/10 bg-white/[0.03] px-5 py-8 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[var(--color-red)]">
                    <ImageIcon size={22} />
                  </div>

                  <div className="mb-4 w-full max-w-[210px] opacity-75">
                    <CarSilhouette className="w-full" />
                  </div>

                  <h4 className="text-base font-semibold text-white">
                    Sin vista disponible
                  </h4>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-[var(--color-text-muted)]">
                    No se encontró una imagen para mostrar en esta sección del
                    resultado.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* bottom glow */}
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-12 w-[68%] -translate-x-1/2 rounded-full bg-[var(--color-red)]/8 blur-2xl" />
        </div>

        {/* Thumbnails */}
        {thumbs.length > 1 && (
          <div className="mt-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-faint)]">
                Vistas disponibles
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                {thumbs.length} imágenes
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {thumbs.map((t) => {
                const isActive = active === t.id;

                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActive(t.id)}
                    className={`group relative overflow-hidden rounded-2xl border text-left transition-all duration-300 ${
                      isActive
                        ? 'border-[var(--color-red)]/50 bg-[var(--color-red)]/8 shadow-[0_0_0_1px_rgba(225,6,0,0.12),0_14px_30px_rgba(225,6,0,0.12)]'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.045]'
                    }`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#111219]">
                      <img
                        src={t.url}
                        alt={t.label}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      />

                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.55),transparent_45%)]" />

                      {isActive && (
                        <div className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[var(--color-red)] shadow-[0_0_10px_rgba(255,0,0,0.8)]" />
                      )}
                    </div>

                    <div className="px-3 py-2.5">
                      <p className="truncate text-sm font-medium text-white">
                        {t.label}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-faint)]">
                        {t.type === 'analyzed' ? 'Analizada' : 'Referencia'}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}