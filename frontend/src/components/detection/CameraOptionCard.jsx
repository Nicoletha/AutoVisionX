import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Camera, X, ScanLine, Aperture } from 'lucide-react';

function CameraModal({
  isOpen,
  isStarting,
  error,
  streamReady,
  videoRef,
  onClose,
  onTakePhoto,
}) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal wrapper */}
      <div className="relative z-[100000] flex min-h-screen items-center justify-center p-3 sm:p-5">
        <div
          className="relative flex h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#12131a] shadow-[0_30px_120px_rgba(0,0,0,0.65)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ambient background */}
          <div className="pointer-events-none absolute left-[-90px] top-[-90px] h-64 w-64 rounded-full bg-[var(--color-red)]/14 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-100px] right-[-100px] h-72 w-72 rounded-full bg-[var(--color-red)]/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Header */}
          <div className="relative shrink-0 border-b border-white/10 px-4 py-3 sm:px-5">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-white sm:text-lg">
                  Tomar foto
                </h2>
                <p className="mt-1 text-[11px] leading-5 text-[var(--color-text-muted)] sm:text-xs">
                  Coloca el auto dentro del marco y captura la imagen.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Body + footer wrapper */}
          <div className="relative flex min-h-0 flex-1 flex-col">
            {/* Body */}
            <div className="min-h-0 flex-1 p-3 sm:p-4">
              <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-[24px] border border-white/10 bg-[#0d0e13]">
                {/* Video area */}
                <div className="relative min-h-0 flex-1 bg-black">
                  {error ? (
                    <div className="flex h-full items-center justify-center p-6 text-center">
                      <div className="max-w-md rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
                        <p className="text-sm leading-6 text-red-200">{error}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="h-full w-full object-cover"
                      />

                      {/* Overlay */}
                      <div className="pointer-events-none absolute inset-0">
                        {/* dark overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.22),transparent_24%,transparent_76%,rgba(0,0,0,0.3))]" />

                        {/* top badges */}
                        <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 backdrop-blur">
                          <ScanLine
                            size={13}
                            className="text-[var(--color-red)]"
                          />
                          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/85">
                            Cámara activa
                          </span>
                        </div>

                        <div className="absolute right-3 top-3 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-300">
                          IA lista
                        </div>

                        {/* central frame */}
                        <div className="absolute inset-0 flex items-center justify-center px-4 py-5 sm:px-6 lg:px-10">
                          <div className="relative h-[62%] w-full max-w-[780px] sm:h-[66%]">
                            {/* borde general */}
                            <div className="absolute inset-0 rounded-[26px] border border-white/12 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]" />

                            {/* corners */}
                            <div className="absolute left-0 top-0 h-10 w-10 rounded-tl-[26px] border-l-2 border-t-2 border-[var(--color-red)] shadow-[0_0_14px_rgba(255,0,0,0.35)]" />
                            <div className="absolute right-0 top-0 h-10 w-10 rounded-tr-[26px] border-r-2 border-t-2 border-[var(--color-red)] shadow-[0_0_14px_rgba(255,0,0,0.35)]" />
                            <div className="absolute bottom-0 left-0 h-10 w-10 rounded-bl-[26px] border-b-2 border-l-2 border-[var(--color-red)] shadow-[0_0_14px_rgba(255,0,0,0.35)]" />
                            <div className="absolute bottom-0 right-0 h-10 w-10 rounded-br-[26px] border-b-2 border-r-2 border-[var(--color-red)] shadow-[0_0_14px_rgba(255,0,0,0.35)]" />

                            {/* scan line */}
                            <div className="absolute inset-x-[7%] top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-[var(--color-red)] to-transparent shadow-[0_0_18px_rgba(255,0,0,0.65)]" />
                            <div className="absolute inset-x-[12%] top-1/2 h-10 -translate-y-1/2 bg-[radial-gradient(circle,rgba(255,0,0,0.16)_0%,rgba(255,0,0,0.08)_42%,transparent_75%)] blur-md" />
                          </div>
                        </div>

                        {/* bottom hint */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/45 px-3 py-1.5 text-[11px] text-white/80 backdrop-blur">
                          Coloca el Hot Wheels completo dentro del marco
                        </div>
                      </div>
                    </>
                  )}

                  {/* Loading */}
                  {isStarting && !error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[2px]">
                      <div className="rounded-2xl border border-white/10 bg-[#171922]/85 px-5 py-4 text-center shadow-xl">
                        <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-red)]/30 bg-[var(--color-red)]/10 text-[var(--color-red)]">
                          <Aperture size={20} className="animate-spin" />
                        </div>
                        <p className="text-sm font-medium text-white">
                          Iniciando cámara...
                        </p>
                        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                          Espera un momento
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="shrink-0 border-t border-white/10 bg-[#111219]/95 px-4 py-3 sm:px-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <p className="max-w-2xl text-[11px] leading-5 text-[var(--color-text-muted)] sm:text-xs">
                  Usa buena iluminación, evita reflejos y centra el auto dentro
                  del marco para mejorar el reconocimiento.
                </p>

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    onClick={onTakePhoto}
                    disabled={!streamReady || !!error}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-red)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(255,0,0,0.25)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Camera size={16} />
                    Capturar foto
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function CameraOptionCard({ active = false, onCapture }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState('');
  const [streamReady, setStreamReady] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const openCamera = () => {
    setError('');
    setStreamReady(false);
    setIsOpen(true);
    setIsStarting(true);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const closeCamera = () => {
    stopCamera();
    setIsOpen(false);
    setIsStarting(false);
    setStreamReady(false);
    setError('');
  };

  useEffect(() => {
    const startCamera = async () => {
      if (!isOpen) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
          },
          audio: false,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setStreamReady(true);
      } catch (err) {
        console.error(err);
        setError(
          'No se pudo acceder a la cámara. Verifica los permisos del navegador.'
        );
      } finally {
        setIsStarting(false);
      }
    };

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleTakePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const file = new File([blob], `capture-${Date.now()}.jpg`, {
          type: 'image/jpeg',
        });

        onCapture?.(file);
        closeCamera();
      },
      'image/jpeg',
      0.95
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={openCamera}
        className={`group relative min-h-[210px] flex-1 overflow-hidden rounded-[28px] border p-6 text-left transition-all duration-300 ${
          active
            ? 'border-[var(--color-red)]/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] shadow-[0_0_0_1px_rgba(225,6,0,0.22),0_20px_45px_rgba(225,6,0,0.12)]'
            : 'border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] hover:border-[var(--color-red)]/30 hover:shadow-[0_0_0_1px_rgba(225,6,0,0.08),0_20px_45px_rgba(0,0,0,0.25)]'
        }`}
      >
        <div className="pointer-events-none absolute inset-0">
          <div
            className={`absolute -right-8 bottom-[-30px] h-32 w-32 rounded-full blur-3xl transition-opacity ${
              active
                ? 'bg-[var(--color-red)]/18 opacity-100'
                : 'bg-white/5 opacity-60'
            }`}
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),transparent_45%)]" />
        </div>

        <div className="relative z-10 flex h-full flex-col">
          <div
            className={`mb-6 flex h-12 w-12 items-center justify-center rounded-[18px] border transition-all duration-300 ${
              active
                ? 'border-[var(--color-red)]/45 bg-[var(--color-red)]/12 text-[var(--color-red)] shadow-[0_0_18px_rgba(225,6,0,0.12)]'
                : 'border-white/10 bg-white/[0.04] text-[var(--color-text-muted)] group-hover:border-[var(--color-red)]/30 group-hover:text-[var(--color-red)]'
            }`}
          >
            <Camera size={20} />
          </div>

          <div className="max-w-[220px]">
            <h3 className="font-[var(--font-display)] text-[1.55rem] font-semibold leading-tight text-white">
              Tomar foto
            </h3>

            <p className="mt-3 text-[13px] leading-7 text-[var(--color-text-muted)]">
              Usa la cámara del dispositivo para capturar el auto y comenzar el
              escaneo.
            </p>
          </div>

          <div className="mt-auto pt-6">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-faint)]">
              <span
                className={`h-2 w-2 rounded-full transition-all ${
                  active
                    ? 'bg-[var(--color-red)] shadow-[0_0_10px_rgba(255,0,0,0.8)]'
                    : 'bg-white/20'
                }`}
              />
              Abrir cámara
            </div>
          </div>
        </div>
      </button>

      <CameraModal
        isOpen={isOpen}
        isStarting={isStarting}
        error={error}
        streamReady={streamReady}
        videoRef={videoRef}
        onClose={closeCamera}
        onTakePhoto={handleTakePhoto}
      />
    </>
  );
}