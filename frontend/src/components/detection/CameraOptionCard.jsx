import {
  Camera,
  ChevronRight,
  ScanLine,
  Aperture,
  Radar,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const SPECS = [
  { label: 'MODO', value: 'LIVE CAPTURE' },
  { label: 'LENTE', value: 'CAMERA INPUT' },
  { label: 'ESTADO', value: 'REAL TIME' },
];

export default function CameraOptionCard({ active = false, onCapture }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  const startCamera = async () => {
    try {
      setError('');
      setStarting(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });

      streamRef.current = stream;
      setCameraOpen(true);

      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });
    } catch (err) {
      console.error(err);
      setError('No se pudo acceder a la cámara.');
    } finally {
      setStarting(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
  };

  const capturePhoto = () => {
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
        stopCamera();
      },
      'image/jpeg',
      0.95
    );
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div
      className={`group relative w-full overflow-hidden rounded-[30px] border text-left transition-all duration-300 ${
        active
          ? 'border-[var(--color-red)]/50 bg-[linear-gradient(180deg,rgba(255,255,255,0.055),rgba(255,255,255,0.02))] shadow-[0_0_0_1px_rgba(225,6,0,0.15),0_24px_60px_rgba(225,6,0,0.08)]'
          : 'border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] hover:border-[var(--color-red)]/28 hover:shadow-[0_24px_60px_rgba(0,0,0,0.28)]'
      }`}
    >
      {/* ===================== FX / HUD ===================== */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-14 bottom-[-32px] h-36 w-36 rounded-full bg-[var(--color-red)]/12 blur-3xl" />
        <div className="absolute left-[-24px] top-[-10px] h-28 w-28 rounded-full bg-white/[0.03] blur-3xl" />

        <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-[var(--color-red)]/35 to-transparent" />

        {/* scanner corners */}
        <div className="absolute left-4 top-4 h-6 w-6 rounded-tl-xl border-l border-t border-[var(--color-red)]/35" />
        <div className="absolute right-4 top-4 h-6 w-6 rounded-tr-xl border-r border-t border-[var(--color-red)]/35" />
        <div className="absolute bottom-4 left-4 h-6 w-6 rounded-bl-xl border-b border-l border-[var(--color-red)]/35" />
        <div className="absolute bottom-4 right-4 h-6 w-6 rounded-br-xl border-b border-r border-[var(--color-red)]/35" />

        {/* frame interno */}
        <div className="absolute inset-[10px] rounded-[24px] border border-white/[0.05]" />

        {/* barra lateral roja */}
        <div className="absolute bottom-6 right-0 top-6 w-[3px] rounded-l-full bg-gradient-to-b from-transparent via-[var(--color-red)] to-transparent shadow-[0_0_18px_rgba(255,0,0,0.55)]" />
      </div>

      <div className="relative z-10 p-5 sm:p-6">
        {!cameraOpen ? (
          <div className="grid min-h-[260px] grid-cols-1 gap-6 xl:grid-cols-[185px_minmax(0,1fr)_130px] xl:items-center">
            {/* LEFT VISUAL */}
            <div className="flex items-center justify-center xl:justify-start">
              <div className="relative flex h-[132px] w-[132px] items-center justify-center rounded-[32px] border border-[var(--color-red)]/25 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015))] shadow-[0_0_36px_rgba(225,6,0,0.12)]">
                <div className="absolute inset-[12px] rounded-[24px] border border-[var(--color-red)]/14" />
                <div className="absolute inset-[26px] rounded-[18px] border border-white/8" />

                <Camera
                  size={46}
                  className="text-[var(--color-red)] drop-shadow-[0_0_14px_rgba(255,0,0,0.45)]"
                />

                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-[var(--color-red)]/25 bg-[rgba(12,12,18,0.95)] px-3 py-1">
                  <span className="font-[var(--font-display)] text-[9px] uppercase tracking-[0.18em] text-[var(--color-red)]">
                    Camera
                  </span>
                </div>
              </div>
            </div>

            {/* CENTER */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5">
                  <Radar
                    size={13}
                    className={
                      active
                        ? 'text-[var(--color-red)]'
                        : 'text-[var(--color-text-muted)]'
                    }
                  />
                  <span className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                    Capture Module
                  </span>
                </div>

                <div className="rounded-full border border-[var(--color-red)]/18 bg-[var(--color-red)]/8 px-3 py-1.5">
                  <span className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.18em] text-[var(--color-red)]">
                    Live Source
                  </span>
                </div>
              </div>

              <h3 className="mt-5 font-[var(--font-display)] text-[1.95rem] font-bold uppercase tracking-[0.08em] text-white sm:text-[2.1rem]">
                Tomar foto
              </h3>

              <p className="mt-2 max-w-[40rem] text-[15px] leading-7 text-[var(--color-text-muted)]">
                Activa la cámara del dispositivo para capturar el automóvil en
                tiempo real y enviarlo al módulo de reconocimiento.
              </p>

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

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={startCamera}
                  disabled={starting}
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-red)]/25 bg-[var(--color-red)] px-4 py-2.5 text-sm font-medium text-white shadow-[0_12px_30px_rgba(225,6,0,0.22)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <ScanLine size={16} />
                  {starting ? 'Abriendo cámara...' : 'Abrir cámara'}
                </button>

                <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
                  <span className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                    Captura instantánea
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT CTA */}
            <div className="flex items-center justify-center xl:justify-end">
              <div className="relative flex h-[110px] w-[110px] items-center justify-center rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.02)]">
                <div className="absolute inset-[12px] rounded-[22px] border border-[var(--color-red)]/16" />

                <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[var(--color-red)]/35 bg-[var(--color-red)]/10 shadow-[0_0_28px_rgba(225,6,0,0.18)] transition duration-300 group-hover:scale-105 group-hover:shadow-[0_0_34px_rgba(225,6,0,0.28)]">
                  <ChevronRight
                    size={30}
                    className="translate-x-[1px] text-[var(--color-red)]"
                    strokeWidth={2.3}
                  />
                </div>

                <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2">
                  <span className="font-[var(--font-display)] text-[9px] uppercase tracking-[0.2em] text-[var(--color-text-faint)]">
                    Launch
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* HEADER PREVIEW */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-white/10 bg-[rgba(255,255,255,0.02)] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-red)]/20 bg-[var(--color-red)]/10">
                  <Aperture size={16} className="text-[var(--color-red)]" />
                </div>

                <div>
                  <p className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-faint)]">
                    Captura en vivo
                  </p>
                  <p className="text-sm font-medium text-white">
                    Cámara activa · lista para escanear
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.9)]" />
                <span className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                  Stream online
                </span>
              </div>
            </div>

            {/* PREVIEW */}
            <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-black/40">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-[340px] w-full object-cover sm:h-[390px]"
              />

              {/* overlay */}
              <div className="pointer-events-none absolute inset-0">
                {/* dark gradient */}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18),transparent_25%,transparent_75%,rgba(0,0,0,0.25))]" />

                {/* scan line */}
                <div className="absolute left-1/2 top-1/2 h-[2px] w-[88%] -translate-x-1/2 -translate-y-1/2 bg-[var(--color-red)]/95 shadow-[0_0_18px_rgba(255,0,0,0.75)]" />

                {/* center glow */}
                <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-red)]/10 blur-3xl" />

                {/* scanner corners */}
                <div className="absolute left-5 top-5 h-10 w-10 rounded-tl-2xl border-l-[3px] border-t-[3px] border-[var(--color-red)] shadow-[0_0_16px_rgba(255,0,0,0.35)]" />
                <div className="absolute right-5 top-5 h-10 w-10 rounded-tr-2xl border-r-[3px] border-t-[3px] border-[var(--color-red)] shadow-[0_0_16px_rgba(255,0,0,0.35)]" />
                <div className="absolute bottom-5 left-5 h-10 w-10 rounded-bl-2xl border-b-[3px] border-l-[3px] border-[var(--color-red)] shadow-[0_0_16px_rgba(255,0,0,0.35)]" />
                <div className="absolute bottom-5 right-5 h-10 w-10 rounded-br-2xl border-b-[3px] border-r-[3px] border-[var(--color-red)] shadow-[0_0_16px_rgba(255,0,0,0.35)]" />

                {/* subtle grid */}
                <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.25)_1px,transparent_1px)] [background-size:34px_34px]" />
              </div>

              {/* bottom controls */}
              <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/10 bg-[linear-gradient(180deg,rgba(6,8,12,0.1),rgba(6,8,12,0.92))] p-4 backdrop-blur-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                    <ScanLine size={14} className="text-[var(--color-red)]" />
                    <span className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.18em] text-white">
                      Scanner activo
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-red)]/25 bg-[var(--color-red)] px-4 py-2.5 text-sm font-medium text-white shadow-[0_12px_30px_rgba(225,6,0,0.22)] transition hover:brightness-110"
                    >
                      <Camera size={16} />
                      Capturar
                    </button>

                    <button
                      type="button"
                      onClick={stopCamera}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white transition hover:bg-white/[0.08]"
                    >
                      <X size={16} />
                      Cerrar cámara
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-2xl border border-[var(--color-red)]/18 bg-[var(--color-red)]/8 px-4 py-3">
            <p className="text-sm text-[var(--color-red)]">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}