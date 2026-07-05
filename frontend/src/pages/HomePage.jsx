import { useNavigate } from 'react-router-dom';
import { Info, ScanSearch } from 'lucide-react';
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
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--color-background)] text-white">
      {/* Fondo global */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-220px] top-[-120px] h-[34rem] w-[34rem] rounded-full bg-[var(--color-red)]/14 blur-3xl" />
        <div className="absolute right-[-180px] top-[8%] h-[28rem] w-[28rem] rounded-full bg-[var(--color-red)]/10 blur-3xl" />
        <div className="absolute bottom-[-220px] left-[12%] h-[28rem] w-[28rem] rounded-full bg-[var(--color-red)]/8 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.045),transparent_30%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.015),transparent_20%,transparent_80%,rgba(255,255,255,0.015))]" />
      </div>

      <Navbar />

  
        <main className="relative mx-auto max-w-[1600px] px-3 pb-10 pt-6 sm:px-5 sm:pb-12 sm:pt-8 lg:px-6 lg:pb-14">
        <HeroDetectionSection />

        {/* OPTIONS */}
        <section className="mt-6 rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,12,18,0.9),rgba(10,10,14,0.96))] px-5 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.34)] sm:px-7 sm:py-7 lg:px-8 lg:py-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-red)]/25 bg-[var(--color-red)]/10 px-3.5 py-1.5">
              <ScanSearch size={14} className="text-[var(--color-red)]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-red)]">
                Iniciar escaneo
              </span>
            </div>

            <h2 className="mt-4 font-[var(--font-display)] text-2xl font-bold text-white sm:text-[2rem]">
              Selecciona una opción para comenzar
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[var(--color-text-muted)] sm:text-[15px]">
              Sube una imagen desde tu dispositivo o usa la cámara para capturar
              el automóvil y analizarlo en tiempo real.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <UploadOptionCard
              active={!!imageFile && source === 'upload'}
              onFileSelected={handleUpload}
            />

            <CameraOptionCard
              active={!!imageFile && source === 'camera'}
              onCapture={handleCapture}
            />
          </div>

          <div className="mt-6 rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.22)] sm:p-5">
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

                <p className="mt-1.5 text-xs leading-6 text-[var(--color-text-muted)] sm:text-[13px]">
                  Usa buena iluminación, evita fondos saturados y procura que el
                  automóvil aparezca completo dentro del encuadre para mejorar la
                  precisión del reconocimiento.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}