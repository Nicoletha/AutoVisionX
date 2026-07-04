import { useNavigate } from 'react-router-dom';
import { Info, Sparkles, ScanSearch } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import UploadOptionCard from '../components/detection/UploadOptionCard';
import CameraOptionCard from '../components/detection/CameraOptionCard';
import HeroDetectionSection from '../components/detection/HeroDetectionSection';
import { useDetectionContext } from '../hooks/DetectionContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { imageFile, source, setImage } = useDetectionContext();

  const handleUpload = (file) => {
    setImage(file, 'upload');
    navigate('/escaneo');
  };

  const handleCapture = (file) => {
    setImage(file, 'camera');
    navigate('/escaneo');
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--color-background)] text-white">
      {/* Fondo decorativo global */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-140px] top-[-120px] h-80 w-80 rounded-full bg-[var(--color-red)]/16 blur-3xl" />
        <div className="absolute right-[-140px] top-[10%] h-[24rem] w-[24rem] rounded-full bg-white/[0.04] blur-3xl" />
        <div className="absolute bottom-[-140px] left-[18%] h-80 w-80 rounded-full bg-[var(--color-red)]/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_34%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.015),transparent_22%,transparent_78%,rgba(255,255,255,0.015))]" />
      </div>

      <Navbar />

      <main className="relative mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] shadow-[0_25px_90px_rgba(0,0,0,0.38)] backdrop-blur-sm">
          {/* Glow interno sutil */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),transparent_32%,transparent_72%,rgba(255,255,255,0.03))]" />
          <div className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="relative grid grid-cols-1 gap-10 px-5 py-6 sm:px-7 sm:py-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-12 lg:px-10 lg:py-10 xl:px-12">
            {/* ================= LEFT ================= */}
            <div className="relative z-10 flex flex-col justify-center">
              {/* Badge */}
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--color-red)]/30 bg-[var(--color-red)]/10 px-3.5 py-1.5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
                <Sparkles size={14} className="text-[var(--color-red)]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-red)]">
                  Reconocimiento visual
                </span>
              </div>

              {/* Heading */}
              <div className="mt-5 max-w-[520px]">
                <h1 className="font-[var(--font-display)] text-[2.7rem] font-bold leading-[0.98] tracking-tight text-white sm:text-[3.4rem] xl:text-[4.2rem]">
                  Escanea tu
                  <br />
                  <span className="relative inline-block text-[var(--color-red)]">
                    Automóvil
                    <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-[var(--color-red)]/70" />
                  </span>
                </h1>

                <p className="mt-5 max-w-[500px] text-[15px] leading-8 text-[var(--color-text-muted)] sm:text-[15.5px]">
                  Sube una imagen o toma una foto para identificar el modelo,
                  consultar su información y detectar su color dominante de
                  forma rápida y visual.
                </p>
              </div>

              {/* Chips */}
              <div className="mt-6 flex max-w-[560px] flex-wrap gap-3">
                {[
                  'Identificación del modelo',
                  'Detección de color HEX',
                  'Escaneo desde cámara',
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-[12.5px] text-[var(--color-text-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
                  >
                    {item}
                  </span>
                ))}
              </div>

              {/* Action cards */}
              <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <UploadOptionCard
                  active={!!imageFile && source === 'upload'}
                  onFileSelected={handleUpload}
                />

                <CameraOptionCard
                  active={!!imageFile && source === 'camera'}
                  onCapture={handleCapture}
                />
              </div>

              {/* Recommendation panel */}
              <div className="mt-6 max-w-[620px] rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))] p-4 shadow-[0_14px_40px_rgba(0,0,0,0.26)] sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--color-red)]/20 bg-[var(--color-red)]/12">
                    <Info size={16} className="text-[var(--color-red)]" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        Recomendación de escaneo
                      </span>
                      <ScanSearch
                        size={14}
                        className="text-[var(--color-text-muted)]"
                      />
                    </div>

                    <p className="mt-1.5 max-w-[520px] text-xs leading-6 text-[var(--color-text-muted)] sm:text-[13px]">
                      Usa buena iluminación, evita fondos demasiado saturados y
                      procura que el auto aparezca completo dentro del encuadre
                      para mejorar la precisión del reconocimiento.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= RIGHT ================= */}
            <div className="relative z-10 flex items-center justify-center lg:justify-end">
              <div className="w-full max-w-[760px] xl:max-w-[820px]">
                <HeroDetectionSection />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}