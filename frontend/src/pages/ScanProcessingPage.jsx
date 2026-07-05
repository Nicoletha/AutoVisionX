import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Crosshair,
  Palette,
  Radar,
  ScanSearch,
  Sparkles,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import ScannerOverlay from '../components/detection/ScannerOverlay';
import PrimaryButton from '../components/common/PrimaryButton';
import { useDetectionContext } from '../hooks/DetectionContext';

const STAGES = [
  {
    title: 'Analizando imagen',
    detail: 'Inicializando módulo de visión artificial',
    icon: ScanSearch,
  },
  {
    title: 'Extrayendo características visuales',
    detail: 'Procesando contornos, forma y detalles del vehículo',
    icon: Crosshair,
  },
  {
    title: 'Comparando con el catálogo',
    detail: 'Buscando coincidencias con embeddings y referencias',
    icon: Cpu,
  },
  {
    title: 'Detectando color dominante',
    detail: 'Calculando tono principal y variaciones visibles',
    icon: Palette,
  },
];

const SYSTEM_METRICS = [
  { label: 'ENGINE', value: 'CLIP + API' },
  { label: 'MODE', value: 'REAL TIME' },
  { label: 'SOURCE', value: 'IMAGE INPUT' },
];

export default function ScanProcessingPage() {
  const navigate = useNavigate();
  const { imageFile, imagePreviewUrl, runDetection, error } =
    useDetectionContext();

  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const hasStarted = useRef(false);

  // Si entran directo sin imagen, regresarlos al inicio
  useEffect(() => {
    if (!imageFile) navigate('/', { replace: true });
  }, [imageFile, navigate]);

  // Progreso visual mientras corre la detección
  useEffect(() => {
    if (!imageFile) return;

    const progressTimer = setInterval(() => {
      setProgress((p) => (p < 90 ? p + 2 : p));
    }, 120);

    const stageTimer = setInterval(() => {
      setStageIndex((i) => (i + 1) % STAGES.length);
    }, 1500);

    return () => {
      clearInterval(progressTimer);
      clearInterval(stageTimer);
    };
  }, [imageFile]);

  // Ejecutar detección real una sola vez
  useEffect(() => {
    if (!imageFile || hasStarted.current) return;
    hasStarted.current = true;

    runDetection()
      .then(() => {
        setProgress(100);
        setTimeout(() => navigate('/resultado'), 500);
      })
      .catch(() => {
        setProgress(0);
      });
  }, [imageFile, runDetection, navigate]);

  const currentStage = STAGES[stageIndex];
  const CurrentStageIcon = currentStage.icon;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#05070b] text-white">
      {/* Fondo global */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:36px_36px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.035),transparent_22%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_20%,transparent_80%,rgba(255,255,255,0.015))]" />
        <div className="absolute left-1/2 top-[28%] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[var(--color-red)]/10 blur-[140px]" />
        <div className="absolute left-[-120px] top-[10%] h-72 w-72 rounded-full bg-[var(--color-red)]/7 blur-[120px]" />
        <div className="absolute bottom-[-80px] right-[-60px] h-80 w-80 rounded-full bg-[var(--color-red)]/8 blur-[140px]" />
      </div>

      <Navbar showBack subtitle="Procesamiento de escaneo" />

      <main className="relative mx-auto max-w-[1800px] px-4 pb-12 pt-5 sm:px-6 lg:px-8">
        {/* ================= TOP STATUS BAR ================= */}
        <section className="relative overflow-hidden rounded-[30px] border border-[var(--color-red)]/16 bg-[rgba(8,10,14,0.78)] px-4 py-4 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:px-5 lg:px-6">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-[10px] rounded-[22px] border border-white/[0.05]" />
            <div className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-red)]/30 to-transparent" />
            <div className="absolute left-[-50px] top-[-40px] h-40 w-40 rounded-full bg-[var(--color-red)]/8 blur-3xl" />
          </div>

          <div className="relative grid gap-4 xl:grid-cols-[1.3fr_0.9fr] xl:items-center">
            {/* left */}
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-red)]/18 bg-[var(--color-red)]/8 px-3 py-1.5">
                <Radar size={13} className="text-[var(--color-red)]" />
                <span className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.18em] text-[var(--color-red)]">
                  Módulo de análisis
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[var(--color-red)]/22 bg-[var(--color-red)]/10 text-[var(--color-red)] shadow-[0_0_24px_rgba(225,6,0,0.14)]">
                  <CurrentStageIcon size={22} />
                </div>

                <div className="min-w-0">
                  <h1 className="font-[var(--font-display)] text-[1.6rem] font-bold uppercase tracking-[0.05em] text-white sm:text-[2rem]">
                    {error ? 'Análisis interrumpido' : currentStage.title}
                  </h1>

                  <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--color-text-muted)] sm:text-[15px]">
                    {error
                      ? error
                      : currentStage.detail}
                  </p>
                </div>
              </div>
            </div>

            {/* right */}
            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-3">
              {SYSTEM_METRICS.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] px-4 py-4"
                >
                  <p className="font-[var(--font-display)] text-[9px] uppercase tracking-[0.2em] text-[var(--color-text-faint)]">
                    {item.label}
                  </p>
                  <p className="mt-2 font-[var(--font-display)] text-[0.95rem] font-semibold uppercase tracking-[0.04em] text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= MAIN PROCESSING LAYOUT ================= */}
        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_420px]">
          {/* ================= LEFT: SCANNER PREVIEW ================= */}
          <div className="relative overflow-hidden rounded-[34px] border border-[var(--color-red)]/16 bg-[linear-gradient(180deg,rgba(8,10,16,0.96),rgba(6,8,12,0.98))] p-3 shadow-[0_30px_90px_rgba(0,0,0,0.38)]">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-[12px] rounded-[26px] border border-white/[0.05]" />
              <div className="absolute left-4 top-4 h-5 w-5 rounded-tl-xl border-l border-t border-[var(--color-red)]/28" />
              <div className="absolute right-4 top-4 h-5 w-5 rounded-tr-xl border-r border-t border-[var(--color-red)]/28" />
              <div className="absolute bottom-4 left-4 h-5 w-5 rounded-bl-xl border-b border-l border-[var(--color-red)]/28" />
              <div className="absolute bottom-4 right-4 h-5 w-5 rounded-br-xl border-b border-r border-[var(--color-red)]/28" />
              <div className="absolute inset-x-14 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-red)]/28 to-transparent" />
              <div className="absolute left-1/2 top-[48%] h-[2px] w-[88%] -translate-x-1/2 bg-[var(--color-red)]/70 shadow-[0_0_22px_rgba(255,0,0,0.7)]" />
            </div>

            {/* header scanner */}
            <div className="relative z-10 mb-4 flex flex-wrap items-center justify-between gap-3 px-2 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--color-red)]/20 bg-[var(--color-red)]/10">
                  <ScanSearch size={18} className="text-[var(--color-red)]" />
                </div>

                <div>
                  <p className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-faint)]">
                    Live Processing View
                  </p>
                  <p className="text-sm font-medium text-white">
                    Escaneo visual del vehículo
                  </p>
                </div>
              </div>

              {!error && (
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.9)]" />
                  <span className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                    Stream activo
                  </span>
                </div>
              )}
            </div>

            {/* scanner */}
            <div className="relative z-10">
              <ScannerOverlay imageUrl={imagePreviewUrl} />
            </div>

            {/* footer scanner */}
            <div className="relative z-10 mt-4 grid gap-3 px-2 pb-2 sm:grid-cols-3">
              <HudMiniCard
                label="PROCESO"
                value={error ? 'DETENIDO' : 'ACTIVO'}
                accent={error ? 'text-[var(--color-red)]' : 'text-emerald-300'}
              />
              <HudMiniCard
                label="ETAPA"
                value={`${stageIndex + 1}/${STAGES.length}`}
              />
              <HudMiniCard
                label="PROGRESO"
                value={`${progress}%`}
              />
            </div>
          </div>

          {/* ================= RIGHT: SYSTEM PANEL ================= */}
          <aside className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,10,16,0.96),rgba(6,8,12,0.98))] p-4 shadow-[0_26px_80px_rgba(0,0,0,0.34)] sm:p-5">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-[10px] rounded-[24px] border border-white/[0.05]" />
              <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-red)]/26 to-transparent" />
              <div className="absolute right-[-50px] top-[-40px] h-40 w-40 rounded-full bg-[var(--color-red)]/7 blur-3xl" />
            </div>

            <div className="relative z-10">
              {/* heading */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--color-red)]/20 bg-[var(--color-red)]/10 text-[var(--color-red)]">
                  <Cpu size={20} />
                </div>

                <div>
                  <p className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-faint)]">
                    Engine status
                  </p>
                  <h2 className="font-[var(--font-display)] text-[1.1rem] font-semibold uppercase tracking-[0.04em] text-white">
                    Motor de análisis
                  </h2>
                </div>
              </div>

              {/* progress module */}
              <div className="mt-6 rounded-[24px] border border-[var(--color-red)]/18 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-[var(--font-display)] text-[9px] uppercase tracking-[0.2em] text-[var(--color-text-faint)]">
                      Progress
                    </p>
                    <p className="mt-1 font-[var(--font-display)] text-[1.7rem] font-bold uppercase text-white">
                      {progress}%
                    </p>
                  </div>

                  {!error ? (
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
                      <Activity size={14} className="text-emerald-400" />
                      <span className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                        Running
                      </span>
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-red)]/20 bg-[var(--color-red)]/10 px-3 py-1.5">
                      <AlertTriangle size={14} className="text-[var(--color-red)]" />
                      <span className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.18em] text-[var(--color-red)]">
                        Error
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--color-red-dim)] via-[var(--color-red)] to-[#ff6b63] shadow-[0_0_18px_rgba(255,0,0,0.28)] transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between font-[var(--font-display)] text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                  <span>Estado</span>
                  <span>{error ? 'Detenido' : 'En ejecución'}</span>
                </div>
              </div>

              {/* current stage */}
              <div className="mt-4 rounded-[24px] border border-white/10 bg-[rgba(255,255,255,0.02)] p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--color-red)]/18 bg-[var(--color-red)]/10 text-[var(--color-red)]">
                    <CurrentStageIcon size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="font-[var(--font-display)] text-[9px] uppercase tracking-[0.2em] text-[var(--color-text-faint)]">
                      Etapa actual
                    </p>
                    <p className="mt-2 font-[var(--font-display)] text-[1rem] font-semibold uppercase tracking-[0.04em] text-white">
                      {error ? 'Proceso cancelado' : currentStage.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                      {error
                        ? 'La ejecución se detuvo antes de completar el reconocimiento.'
                        : currentStage.detail}
                    </p>
                  </div>
                </div>
              </div>

              {/* pipeline */}
              <div className="mt-4 rounded-[24px] border border-white/10 bg-[rgba(255,255,255,0.02)] p-4">
                <p className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-faint)]">
                  Pipeline
                </p>

                <div className="mt-4 space-y-3">
                  {STAGES.map((stage, index) => {
                    const Icon = stage.icon;
                    const isDone = !error && progress >= ((index + 1) / STAGES.length) * 100;
                    const isCurrent = !error && index === stageIndex;

                    return (
                      <div
                        key={stage.title}
                        className={`flex items-center gap-3 rounded-[18px] border px-3 py-3 transition ${
                          isCurrent
                            ? 'border-[var(--color-red)]/22 bg-[var(--color-red)]/8'
                            : 'border-white/10 bg-white/[0.02]'
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                            isDone
                              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                              : isCurrent
                              ? 'border-[var(--color-red)]/22 bg-[var(--color-red)]/10 text-[var(--color-red)]'
                              : 'border-white/10 bg-white/[0.03] text-[var(--color-text-muted)]'
                          }`}
                        >
                          {isDone ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white">
                            {stage.title}
                          </p>
                          <p className="text-xs text-[var(--color-text-muted)]">
                            {stage.detail}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* error / retry */}
              {error && (
                <div className="mt-4 rounded-[24px] border border-[var(--color-red)]/20 bg-[var(--color-red)]/8 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      size={18}
                      className="mt-0.5 shrink-0 text-[var(--color-red)]"
                    />
                    <div className="min-w-0">
                      <p className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.18em] text-[var(--color-red)]">
                        Error de procesamiento
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                        Verifica tu conexión con el servidor o confirma que la
                        API y el servicio de IA estén disponibles antes de
                        reintentar.
                      </p>

                      <div className="mt-4">
                        <PrimaryButton onClick={() => window.location.reload()}>
                          Reintentar
                        </PrimaryButton>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

function HudMiniCard({ label, value, accent = 'text-white' }) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-[rgba(255,255,255,0.02)] px-4 py-3">
      <p className="font-[var(--font-display)] text-[9px] uppercase tracking-[0.2em] text-[var(--color-text-faint)]">
        {label}
      </p>
      <p className={`mt-2 font-[var(--font-display)] text-[0.95rem] font-semibold uppercase tracking-[0.04em] ${accent}`}>
        {value}
      </p>
    </div>
  );
}