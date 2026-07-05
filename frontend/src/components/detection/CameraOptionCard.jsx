import { Camera, ChevronRight, ScanLine } from 'lucide-react';
import { useRef, useState } from 'react';

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

  return (
    <div
      className={`group relative w-full overflow-hidden rounded-[28px] border text-left transition-all duration-300 ${
        active
          ? 'border-[var(--color-red)]/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] shadow-[0_0_0_1px_rgba(225,6,0,0.18),0_22px_55px_rgba(225,6,0,0.12)]'
          : 'border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.02))] hover:border-[var(--color-red)]/28 hover:shadow-[0_0_0_1px_rgba(225,6,0,0.08),0_22px_50px_rgba(0,0,0,0.28)]'
      }`}
    >
      {/* background FX */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute -right-8 bottom-[-28px] h-32 w-32 rounded-full blur-3xl transition-opacity duration-300 ${
            active
              ? 'bg-[var(--color-red)]/18 opacity-100'
              : 'bg-[var(--color-red)]/8 opacity-70'
          }`}
        />
        <div className="absolute left-[-24px] top-[-24px] h-28 w-28 rounded-full bg-white/[0.03] blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.045),transparent_42%,transparent_70%,rgba(255,255,255,0.02))]" />
        <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div className="relative z-10 grid min-h-[220px] grid-cols-1 gap-6 p-5 sm:p-6 xl:grid-cols-[170px_minmax(0,1fr)_120px] xl:items-center">
        {/* LEFT ICON */}
        <div className="flex items-center xl:justify-start">
          <div className="relative flex h-[128px] w-[128px] items-center justify-center rounded-[30px] border border-[var(--color-red)]/30 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),rgba(255,255,255,0.02)_55%,rgba(0,0,0,0.18)_100%)] shadow-[0_0_30px_rgba(225,6,0,0.12)]">
            <div className="absolute inset-[10px] rounded-[24px] border border-[var(--color-red)]/15" />
            <Camera
              size={42}
              className="text-[var(--color-red)] drop-shadow-[0_0_12px_rgba(255,0,0,0.45)]"
            />
          </div>
        </div>

        {/* CENTER CONTENT */}
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5">
            <Camera
              size={13}
              className={
                active
                  ? 'text-[var(--color-red)]'
                  : 'text-[var(--color-text-muted)]'
              }
            />
            <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
              Cámara
            </span>
          </div>

          <h3 className="mt-5 font-[var(--font-display)] text-[1.75rem] font-semibold tracking-wide text-white">
            TOMAR FOTO
          </h3>

          <p className="mt-2 text-[15px] text-[var(--color-text-muted)]">
            Con tu cámara
          </p>

          {!cameraOpen ? (
            <>
              <div className="mt-5 space-y-1.5 text-sm text-[var(--color-text-muted)]">
                <p>Captura en tiempo real</p>
                <p>Escaneo inmediato</p>
              </div>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={startCamera}
                  disabled={starting}
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-red)] px-4 py-2.5 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-70"
                >
                  <ScanLine size={16} />
                  {starting ? 'Abriendo cámara...' : 'Abrir cámara'}
                </button>
              </div>
            </>
          ) : (
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="h-52 w-full object-cover"
              />

              <div className="flex flex-wrap gap-3 p-3">
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="rounded-xl bg-[var(--color-red)] px-4 py-2 text-sm font-medium text-white transition hover:brightness-110"
                >
                  Capturar
                </button>

                <button
                  type="button"
                  onClick={stopCamera}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white transition hover:bg-white/[0.08]"
                >
                  Cerrar cámara
                </button>
              </div>
            </div>
          )}

          {error && (
            <p className="mt-4 text-sm text-[var(--color-red)]">{error}</p>
          )}
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
    </div>
  );
}