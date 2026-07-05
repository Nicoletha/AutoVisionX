import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  RefreshCw,
  Repeat,
  Sparkles,
  ScanSearch,
  CheckCircle2,
} from 'lucide-react';
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
    <div className="relative min-h-screen overflow-x-hidden bg-[#05070b] text-white">
      {/* ================= FONDO ================= */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:42px_42px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_28%)]" />
        <div className="absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full bg-[var(--color-red)]/12 blur-[140px]" />
        <div className="absolute right-[-120px] top-[18%] h-96 w-96 rounded-full bg-white/[0.03] blur-[150px]" />
        <div className="absolute bottom-[-120px] left-[20%] h-80 w-80 rounded-full bg-[var(--color-red)]/8 blur-[130px]" />
      </div>

      <Navbar showBack subtitle="Resultado de la detección" />

      <main className="relative mx-auto w-full max-w-[1680px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        {/* ================= HEADER ================= */}
        <section className="mb-6 sm:mb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-red)]/20 bg-[var(--color-red)]/8 px-3.5 py-1.5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                <Sparkles size={14} className="text-[var(--color-red)]" />
                <span className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-red)]">
                  Resultado del análisis
                </span>
              </div>

              <h1 className="mt-4 font-[var(--font-display)] text-3xl font-bold uppercase tracking-[0.04em] text-white sm:text-4xl">
                Resultado de la detección
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-text-muted)] sm:text-[15px]">
                Revisa el modelo identificado, la similitud encontrada y el
                color dominante detectado a partir de la imagen escaneada.
              </p>
            </div>

            <div className="inline-flex items-center gap-3 self-start rounded-2xl border border-emerald-500/18 bg-emerald-500/10 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                <CheckCircle2 size={18} className="text-emerald-300" />
              </div>

              <div>
                <p className="font-[var(--font-display)] text-[9px] uppercase tracking-[0.18em] text-emerald-300/80">
                  Estado
                </p>
                <p className="mt-1 font-[var(--font-display)] text-[11px] uppercase tracking-[0.14em] text-white">
                  Detección completada
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= DASHBOARD PRINCIPAL ================= */}
        <section className="relative w-full overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,10,16,0.92),rgba(6,8,12,0.98))] shadow-[0_28px_90px_rgba(0,0,0,0.38)] backdrop-blur-sm">
          {/* overlay del panel */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-[10px] rounded-[26px] border border-white/[0.05]" />
            <div className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-red)]/24 to-transparent" />
            <div className="absolute left-4 top-4 h-5 w-5 rounded-tl-xl border-l border-t border-[var(--color-red)]/20" />
            <div className="absolute right-4 top-4 h-5 w-5 rounded-tr-xl border-r border-t border-[var(--color-red)]/20" />
            <div className="absolute bottom-4 left-4 h-5 w-5 rounded-bl-xl border-b border-l border-[var(--color-red)]/20" />
            <div className="absolute bottom-4 right-4 h-5 w-5 rounded-br-xl border-b border-r border-[var(--color-red)]/20" />
            <div className="absolute left-[10%] top-[-70px] h-44 w-44 rounded-full bg-[var(--color-red)]/8 blur-3xl" />
          </div>

          <div className="relative p-4 sm:p-6 lg:p-7 xl:p-8">
            {/* ================= TOP BAR ================= */}
            <div className="mb-6 flex flex-col gap-3 rounded-[24px] border border-white/10 bg-white/[0.025] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--color-red)]/18 bg-[var(--color-red)]/10">
                  <ScanSearch size={18} className="text-[var(--color-red)]" />
                </div>

                <div className="min-w-0">
                  <p className="font-[var(--font-display)] text-[9px] uppercase tracking-[0.2em] text-[var(--color-text-faint)]">
                    Detection output
                  </p>
                  <p className="text-sm font-medium text-white">
                    Resultado generado por el motor de reconocimiento
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 sm:self-auto">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
                <span className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                  Match: {Math.round((similarityScore || 0) * 100)}%
                </span>
              </div>
            </div>

            {/* FILA SUPERIOR: galería + resultado */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.95fr)] 2xl:grid-cols-[minmax(0,1.1fr)_minmax(430px,0.9fr)] xl:items-start">
              <div className="min-w-0 rounded-[28px] border border-white/10 bg-white/[0.02] p-3 sm:p-4">
                <CarImageGallery
                  analyzedImageUrl={imagePreviewUrl}
                  referenceImages={car?.images || []}
                />
              </div>

              <div className="min-w-0 rounded-[28px] border border-[var(--color-red)]/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-4 sm:p-5">
                <DetectionResultCard
                  car={car}
                  similarityScore={similarityScore}
                  accentColor={accentColor}
                />
              </div>
            </div>

            {/* COLOR DOMINANTE FULL WIDTH */}
            <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.02] p-4 sm:p-5">
              <div className="mb-4">
                <p className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-faint)]">
                  Color analysis
                </p>
                <h2 className="mt-1 font-[var(--font-display)] text-[1rem] font-semibold uppercase tracking-[0.04em] text-white">
                  Color dominante detectado
                </h2>
              </div>

              <ColorPaletteCard
                primaryHex={detectedPrimaryColorHex}
                primaryName={detectedPrimaryColorName}
                secondaryHexes={secondaryColors}
              />
            </div>

            {/* INFO DEL AUTO */}
            <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.02] p-4 sm:p-5">
              <div className="mb-4">
                <p className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-faint)]">
                  Vehicle data
                </p>
                <h2 className="mt-1 font-[var(--font-display)] text-[1rem] font-semibold uppercase tracking-[0.04em] text-white">
                  Información detectada
                </h2>
              </div>

              <CarInfoPanel car={car} />
            </div>

            {/* Valor estimado y proyección del auto real */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-4 sm:p-5">
                <PriceEstimateCard car={car} />
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-4 sm:p-5">
                <NextReleaseForecastCard car={car} />
              </div>
            </div>

            {/* ================= ACTIONS ================= */}
            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] px-4 py-5 sm:px-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="text-center">
                    <p className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-faint)]">
                      Next action
                    </p>
                    <h3 className="mt-1 font-[var(--font-display)] text-lg font-semibold uppercase tracking-[0.04em] text-white sm:text-xl">
                      Realizar un nuevo escaneo
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)]">
                      Puedes volver al inicio para escanear otro automóvil con una
                      nueva imagen o captura desde cámara.
                    </p>
                  </div>

                  <div className="flex w-full justify-center">
                    <PrimaryButton
                      icon={Repeat}
                      onClick={handleScanAgain}
                      className="min-h-[64px] w-full max-w-[420px] rounded-2xl px-8 text-base font-semibold shadow-[0_18px_40px_rgba(225,6,0,0.18)] sm:min-h-[72px] sm:px-10 sm:text-lg"
                    >
                      Escanear otro auto
                    </PrimaryButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}