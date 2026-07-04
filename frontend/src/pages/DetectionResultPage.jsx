import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Repeat, Sparkles, ScanSearch } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import CarImageGallery from '../components/result/CarImageGallery';
import DetectionResultCard from '../components/result/DetectionResultCard';
import CarInfoPanel from '../components/result/CarInfoPanel';
import ColorPaletteCard from '../components/result/ColorPaletteCard';
import PrimaryButton from '../components/common/PrimaryButton';
import { useDetectionContext } from '../hooks/DetectionContext';
import PriceEstimateCard from '../components/result/PriceEstimateCard';
import NextReleaseForecastCard from '../components/result/NextReleaseForecastCard';

export default function DetectionResultPage() {
  const navigate = useNavigate();
  const { result, imagePreviewUrl, reset, setImage, imageFile } =
    useDetectionContext();

  useEffect(() => {
    if (!result) navigate('/', { replace: true });
  }, [result, navigate]);

  if (!result) return null;

  const {
    car,
    similarityScore,
    detectedPrimaryColorHex,
    detectedPrimaryColorName,
    secondaryColors,
  } = result;

  const accentColor = detectedPrimaryColorHex || 'var(--color-red)';

  const handleScanAgain = () => {
    reset();
    navigate('/');
  };

  const handleReanalyze = () => {
    if (imageFile) {
      setImage(imageFile);
      navigate('/escaneo');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--color-background)] text-white">
      {/* Fondo decorativo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-120px] top-[-120px] h-72 w-72 rounded-full bg-[var(--color-red)]/16 blur-3xl" />
        <div className="absolute right-[-120px] top-[18%] h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[-120px] left-[20%] h-72 w-72 rounded-full bg-[var(--color-red)]/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_35%)]" />
      </div>

      <Navbar showBack subtitle="Resultado de la detección" />

      <main className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10 lg:py-12">
        {/* Header */}
        <section className="mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-red)]/30 bg-[var(--color-red)]/10 px-3.5 py-1.5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
            <Sparkles size={14} className="text-[var(--color-red)]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-red)]">
              Resultado del análisis
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-[var(--font-display)] text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Resultado de la detección
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--color-text-muted)] sm:text-[15px]">
                Revisa el modelo identificado, la similitud encontrada y el
                color dominante detectado a partir de la imagen escaneada.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-[var(--color-text-muted)]">
              <ScanSearch size={14} className="text-[var(--color-red)]" />
              Detección completada correctamente
            </div>
          </div>
        </section>

        {/* Dashboard principal */}
        <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),transparent_35%,transparent_70%,rgba(255,255,255,0.03))]" />

          <div className="relative p-4 sm:p-6 lg:p-7">
            {/* FILA SUPERIOR: galería + resultado */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,0.98fr)_minmax(0,1.02fr)] xl:items-start">
              <div className="min-w-0">
                <CarImageGallery
                  analyzedImageUrl={imagePreviewUrl}
                  referenceImages={car?.images || []}
                />
              </div>

              <div className="min-w-0">
                <DetectionResultCard
                  car={car}
                  similarityScore={similarityScore}
                  accentColor={accentColor}
                />
              </div>
            </div>

            {/* COLOR DOMINANTE FULL WIDTH */}
            <div className="mt-6">
              <ColorPaletteCard
                primaryHex={detectedPrimaryColorHex}
                primaryName={detectedPrimaryColorName}
                secondaryHexes={secondaryColors}
              />
            </div>


            {/* Valor estimado y proyección del auto real (modelos de regresión) */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <PriceEstimateCard car={car} />
              <NextReleaseForecastCard car={car} />
            </div>

            {/* BOTONES */}
            <div className="mt-6 border-t border-white/10 pt-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <PrimaryButton icon={Repeat} onClick={handleScanAgain}>
                  Escanear otro auto
                </PrimaryButton>

                <PrimaryButton
                  icon={RefreshCw}
                  variant="outline"
                  onClick={handleReanalyze}
                >
                  Volver a analizar
                </PrimaryButton>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}