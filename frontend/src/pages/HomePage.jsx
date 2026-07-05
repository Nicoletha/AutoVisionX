import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Info,
  ScanSearch,
  Sparkles,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import UploadOptionCard from '../components/detection/UploadOptionCard';
import CameraOptionCard from '../components/detection/CameraOptionCard';
import HeroDetectionSection from '../components/detection/HeroDetectionSection';
import { useDetectionContext } from '../hooks/DetectionContext';

const STATUS_ITEMS = [
  { label: 'MODO', value: 'VISUAL SCAN' },
  { label: 'IA', value: 'ACTIVA' },
  { label: 'ESTADO', value: 'ÓPTIMO' },
];

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
    <div className="relative min-h-screen overflow-x-hidden bg-[#04060a] text-white">
      {/* ================= BACKGROUND / HUD ================= */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* glows */}
        <div className="absolute left-1/2 top-[10%] h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-[var(--color-red)]/10 blur-[180px]" />
        <div className="absolute left-[-180px] top-[8%] h-[28rem] w-[28rem] rounded-full bg-[var(--color-red)]/7 blur-[140px]" />
        <div className="absolute right-[-180px] bottom-[4%] h-[28rem] w-[28rem] rounded-full bg-[var(--color-red)]/7 blur-[150px]" />

        {/* top spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_22%)]" />

        {/* grid principal */}
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:44px_44px]" />

        {/* scan lines */}
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(180deg,transparent,transparent_92%,rgba(255,255,255,0.12)_100%)] [background-size:100%_10px]" />

        {/* ambient red lines */}
        <div className="absolute left-0 right-0 top-[86px] h-px bg-gradient-to-r from-transparent via-[var(--color-red)]/28 to-transparent" />
        <div className="absolute left-0 right-0 bottom-[160px] h-px bg-gradient-to-r from-transparent via-[var(--color-red)]/16 to-transparent" />

        {/* vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.35)_100%)]" />
      </div>

      <Navbar />

      <main className="relative mx-auto max-w-[1920px] px-4 pb-10 pt-5 sm:px-6 lg:px-8">
        {/* HERO */}
        <HeroDetectionSection />

        {/* ================== SCAN CONTROL PANEL ================== */}
        <section className="relative mt-6">
          {/* outer frame */}
          <div className="relative overflow-hidden rounded-[38px] border border-[var(--color-red)]/18 bg-[linear-gradient(180deg,rgba(8,10,16,0.97),rgba(4,6,10,0.99))] p-[1px] shadow-[0_34px_120px_rgba(0,0,0,0.42)]">
            {/* inner panel */}
            <div className="relative overflow-hidden rounded-[38px] bg-[linear-gradient(180deg,rgba(7,9,14,0.98),rgba(4,6,10,1))] px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
              {/* fx */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_20%,transparent_80%,rgba(255,255,255,0.01))]" />
                <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:34px_34px]" />

                {/* glows */}
                <div className="absolute left-[-70px] top-[-50px] h-56 w-56 rounded-full bg-[var(--color-red)]/8 blur-3xl" />
                <div className="absolute right-[-70px] bottom-[-50px] h-56 w-56 rounded-full bg-[var(--color-red)]/8 blur-3xl" />

                {/* scanner corners */}
                <div className="absolute left-5 top-5 h-7 w-7 rounded-tl-2xl border-l border-t border-[var(--color-red)]/35" />
                <div className="absolute right-5 top-5 h-7 w-7 rounded-tr-2xl border-r border-t border-[var(--color-red)]/35" />
                <div className="absolute bottom-5 left-5 h-7 w-7 rounded-bl-2xl border-b border-l border-[var(--color-red)]/35" />
                <div className="absolute bottom-5 right-5 h-7 w-7 rounded-br-2xl border-b border-r border-[var(--color-red)]/35" />

                {/* top line */}
                <div className="absolute inset-x-20 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-red)]/35 to-transparent" />
              </div>

              {/* ======= TOP STRIP ======= */}
              <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                {/* left title */}
                <div className="text-center xl:text-left">
                  <div className="inline-flex items-center gap-3">
                    <span className="h-[3px] w-10 rounded-full bg-[var(--color-red)] shadow-[0_0_14px_rgba(255,0,0,0.55)]" />
                    <div className="inline-flex items-center gap-2">
                      <ScanSearch size={14} className="text-[var(--color-red)]" />
                      <span className="font-[var(--font-display)] text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-red)] sm:text-[12px]">
                        Centro de escaneo
                      </span>
                    </div>
                    <span className="h-[3px] w-10 rounded-full bg-[var(--color-red)] shadow-[0_0_14px_rgba(255,0,0,0.55)]" />
                  </div>

                  <h2 className="mt-4 font-[var(--font-display)] text-[1.85rem] font-bold uppercase tracking-[0.03em] text-white sm:text-[2.25rem]">
                    Selecciona una fuente de captura
                  </h2>

                  <p className="mx-auto mt-2 max-w-3xl text-[15px] leading-7 text-[var(--color-text-muted)] xl:mx-0">
                    Carga una imagen desde tu dispositivo o usa la cámara para
                    iniciar el análisis visual del automóvil en tiempo real.
                  </p>
                </div>

                {/* right status modules */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:min-w-[520px]">
                  {STATUS_ITEMS.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[20px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,14,20,0.9),rgba(8,10,14,0.95))] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                    >
                      <p className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-faint)]">
                        {item.label}
                      </p>
                      <p className="mt-2 font-[var(--font-display)] text-[1rem] font-semibold uppercase tracking-[0.08em] text-white">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ======= ACTION FRAME ======= */}
              <div className="relative z-10 mt-7 rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(10,12,18,0.68),rgba(6,8,12,0.88))] p-3 sm:p-4 lg:p-5">
                {/* internal HUD */}
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute left-4 top-4 h-6 w-6 rounded-tl-xl border-l border-t border-[var(--color-red)]/35" />
                  <div className="absolute right-4 top-4 h-6 w-6 rounded-tr-xl border-r border-t border-[var(--color-red)]/35" />
                  <div className="absolute bottom-4 left-4 h-6 w-6 rounded-bl-xl border-b border-l border-[var(--color-red)]/35" />
                  <div className="absolute bottom-4 right-4 h-6 w-6 rounded-br-xl border-b border-r border-[var(--color-red)]/35" />

                  <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                </div>

                {/* tiny top strip */}
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-white/8 bg-[rgba(255,255,255,0.02)] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-red)]/20 bg-[var(--color-red)]/10">
                      <Cpu size={16} className="text-[var(--color-red)]" />
                    </div>

                    <div>
                      <p className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-faint)]">
                        Módulo activo
                      </p>
                      <p className="text-sm font-medium text-white">
                        Captura y análisis visual
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.9)]" />
                      <span className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                        IA lista
                      </span>
                    </div>

                    <div className="hidden h-px w-12 bg-gradient-to-r from-transparent to-[var(--color-red)]/30 md:block" />
                  </div>
                </div>

                {/* cards */}
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                  <UploadOptionCard
                    active={!!imageFile && source === 'upload'}
                    onFileSelected={handleUpload}
                  />

                  <CameraOptionCard
                    active={!!imageFile && source === 'camera'}
                    onCapture={handleCapture}
                  />
                </div>
              </div>

              {/* ======= BOTTOM INFO BAR ======= */}
              <div className="relative z-10 mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_0.7fr]">
                {/* recommendation bar */}
                <div className="relative overflow-hidden rounded-[24px] border border-[var(--color-red)]/18 bg-[linear-gradient(180deg,rgba(9,11,16,0.98),rgba(6,8,12,1))] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:px-5">
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-3 top-3 h-4 w-4 rounded-tl-lg border-l border-t border-[var(--color-red)]/40" />
                    <div className="absolute right-3 top-3 h-4 w-4 rounded-tr-lg border-r border-t border-[var(--color-red)]/40" />
                    <div className="absolute bottom-3 left-3 h-4 w-4 rounded-bl-lg border-b border-l border-[var(--color-red)]/40" />
                    <div className="absolute bottom-3 right-3 h-4 w-4 rounded-br-lg border-b border-r border-[var(--color-red)]/40" />
                    <div className="absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-red)]/30 to-transparent" />
                  </div>

                  <div className="relative flex items-start gap-3 sm:gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--color-red)]/25 bg-[var(--color-red)]/10 shadow-[0_0_18px_rgba(255,0,0,0.08)]">
                      <Info size={16} className="text-[var(--color-red)]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-[var(--font-display)] text-[11px] uppercase tracking-[0.2em] text-white">
                          Recomendación de captura
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 font-[var(--font-display)] text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-faint)]">
                          Scanner Tip
                        </span>
                      </div>

                      <p className="mt-2 text-sm leading-7 text-[var(--color-text-muted)] sm:text-[15px]">
                        Usa buena iluminación, evita fondos saturados y asegúrate
                        de que todo el automóvil sea visible dentro del encuadre
                        para obtener un reconocimiento más preciso.
                      </p>
                    </div>

                    <div className="hidden items-center gap-2 md:flex">
                      <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--color-red)]/35" />
                      <ScanSearch size={16} className="text-[var(--color-red)]" />
                    </div>
                  </div>
                </div>

                {/* status bar right */}
                <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,12,18,0.94),rgba(7,8,12,1))] px-4 py-4">
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                  </div>

                  <div className="relative flex h-full flex-col justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
                        <ShieldCheck size={16} className="text-emerald-400" />
                      </div>

                      <div>
                        <p className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-faint)]">
                          Estado del sistema
                        </p>
                        <p className="text-sm font-medium text-white">
                          Preparado para analizar
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between font-[var(--font-display)] text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-faint)]">
                        <span>Disponibilidad</span>
                        <span>100%</span>
                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300 shadow-[0_0_16px_rgba(52,211,153,0.55)]" />
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-red)]/18 bg-[var(--color-red)]/8 px-3 py-1.5 self-start">
                      <Activity size={14} className="text-[var(--color-red)]" />
                      <span className="font-[var(--font-display)] text-[10px] uppercase tracking-[0.18em] text-[var(--color-red)]">
                        Scanner Ready
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* ======= END BOTTOM BAR ======= */}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}