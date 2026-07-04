import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import ScannerOverlay from '../components/detection/ScannerOverlay';
import ScanProgressCard from '../components/detection/ScanProgressCard';
import PrimaryButton from '../components/common/PrimaryButton';
import { useDetectionContext } from '../hooks/DetectionContext';

const STAGES = [
  'Analizando imagen…',
  'Extrayendo características visuales…',
  'Comparando con el catálogo…',
  'Detectando color dominante…',
];

export default function ScanProcessingPage() {
  const navigate = useNavigate();
  const { imageFile, imagePreviewUrl, runDetection, error } = useDetectionContext();
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const hasStarted = useRef(false);

  // Redirige a Home si se entra directo a /escaneo sin imagen.
  useEffect(() => {
    if (!imageFile) navigate('/', { replace: true });
  }, [imageFile, navigate]);

  // Avance visual de progreso mientras la petición real está en curso.
  useEffect(() => {
    if (!imageFile) return;
    const progressTimer = setInterval(() => {
      setProgress((p) => (p < 90 ? p + 2 : p));
    }, 120);
    const stageTimer = setInterval(() => {
      setStageIndex((i) => (i + 1) % STAGES.length);
    }, 1400);
    return () => {
      clearInterval(progressTimer);
      clearInterval(stageTimer);
    };
  }, [imageFile]);

  // Dispara la detección real contra el backend una sola vez.
  useEffect(() => {
    if (!imageFile || hasStarted.current) return;
    hasStarted.current = true;

    runDetection()
      .then(() => {
        setProgress(100);
        setTimeout(() => navigate('/resultado'), 450);
      })
      .catch(() => {
        setProgress(0);
      });
  }, [imageFile, runDetection, navigate]);

  return (
    <div className="min-h-screen">
      <Navbar showBack />

      <main className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
        <div className="text-center">
          <h1 className="font-[var(--font-display)] text-2xl font-semibold text-white sm:text-3xl">
            {error ? 'No se pudo completar el análisis' : STAGES[stageIndex]}
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            {error ? error : 'Esto puede tardar unos segundos'}
          </p>
        </div>

        <div className="mt-10">
          <ScannerOverlay imageUrl={imagePreviewUrl} />
        </div>

        <div className="mt-8 flex flex-col items-center gap-6">
          {error ? (
            <>
              <div className="flex items-center gap-2 rounded-xl border border-[var(--color-red)]/40 bg-[var(--color-red)]/10 px-4 py-3 text-sm text-[var(--color-red)]">
                <AlertTriangle size={16} />
                Verifica tu conexión con el servidor e inténtalo de nuevo.
              </div>
              <PrimaryButton onClick={() => window.location.reload()}>
                Reintentar
              </PrimaryButton>
            </>
          ) : (
            <>
              <div className="w-full max-w-sm">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1c1c22]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--color-red-dim)] to-[var(--color-red)] transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <ScanProgressCard progress={progress} statusText={STAGES[stageIndex]} />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
