import { ArrowLeft, Menu, Crosshair, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  { label: 'Inicio', to: '/' },
  { label: 'Escanear', to: '/escaneo' },
  { label: 'Historial', to: '#' },
  { label: 'Catálogo', to: '#' },
  { label: 'Sobre nosotros', to: '#' },
];

export default function Navbar({ showBack = false, subtitle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = location.pathname === '/';

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50">
      <div className="relative border-b border-white/8 bg-[rgba(4,6,10,0.82)] backdrop-blur-xl">
        {/* FX de fondo */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),rgba(255,255,255,0.008))]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--color-red)]/45 to-transparent" />
          <div className="absolute left-[8%] top-0 h-24 w-24 rounded-full bg-[var(--color-red)]/8 blur-3xl" />
          <div className="absolute right-[10%] top-0 h-24 w-24 rounded-full bg-[var(--color-red)]/6 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="grid min-h-[88px] grid-cols-[auto_1fr_auto] items-center gap-4">
            {/* =========================
                IZQUIERDA
            ========================= */}
            <div className="flex min-w-0 items-center gap-3">
              {showBack && (
                <button
                  onClick={() => navigate(-1)}
                  aria-label="Volver"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-[var(--color-text-muted)] transition hover:border-[var(--color-red)]/40 hover:text-white"
                >
                  <ArrowLeft size={18} />
                </button>
              )}

              <Link to="/" className="flex min-w-0 items-center gap-3">
                {/* icono */}
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-[var(--color-red)]/25" />
                  <div className="absolute inset-[7px] rounded-full border border-[var(--color-red)]/20" />
                  <Crosshair
                    size={20}
                    className="text-[var(--color-red)] drop-shadow-[0_0_8px_rgba(255,59,59,0.6)]"
                    strokeWidth={2.2}
                  />
                </div>

                {/* marca */}
                <div className="min-w-0">
                  <div className="flex items-end gap-2">
                    <span className="truncate font-[var(--font-display)] text-[1.35rem] font-bold uppercase tracking-[0.04em] text-white sm:text-[1.55rem]">
                      AUTOVISION <span className="text-[var(--color-red)]">X</span>
                    </span>
                  </div>

                  <p className="hidden text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-text-muted)] sm:block">
                    Visión artificial automotriz
                  </p>
                </div>
              </Link>
            </div>

            {/* =========================
                CENTRO - NAV DESKTOP
            ========================= */}
            <nav className="hidden items-center justify-center gap-2 xl:flex">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.to !== '#' &&
                  (item.to === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(item.to));

                const isDisabled = item.to === '#';

                const content = (
                  <span
                    className={[
                      'relative inline-flex h-14 items-center px-5 text-[13px] font-semibold uppercase tracking-[0.14em] transition',
                      isActive
                        ? 'text-[var(--color-red)]'
                        : 'text-white/72 hover:text-white',
                      isDisabled ? 'cursor-default opacity-90' : '',
                    ].join(' ')}
                  >
                    {item.label}
                    {isActive && (
                      <>
                        <span className="absolute bottom-[14px] left-1/2 h-[2px] w-12 -translate-x-1/2 rounded-full bg-[var(--color-red)] shadow-[0_0_12px_rgba(255,59,59,0.7)]" />
                        <span className="absolute bottom-[10px] left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[var(--color-red)]" />
                      </>
                    )}
                  </span>
                );

                if (isDisabled) {
                  return (
                    <div key={item.label} className="select-none">
                      {content}
                    </div>
                  );
                }

                return (
                  <Link key={item.label} to={item.to}>
                    {content}
                  </Link>
                );
              })}
            </nav>

            {/* =========================
                DERECHA
            ========================= */}
            <div className="flex items-center justify-end gap-2">
              {/* badge desktop */}
              <div className="hidden min-w-[170px] items-center gap-3 rounded-2xl border border-[#7a5a55]/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015))] px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_14px_30px_rgba(0,0,0,0.22)] lg:flex">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="absolute inset-0 rounded-full bg-emerald-400/30 blur-[4px]" />
                  <span className="relative h-3 w-3 rounded-full border border-emerald-300/40 bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]" />
                </span>

                <div className="leading-tight">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white">
                    IA ACTIVA
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                    Sistema listo
                  </p>
                </div>
              </div>

              {/* botón menú mobile */}
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Abrir menú"
                className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-[var(--color-text-muted)] transition hover:border-[var(--color-red)]/35 hover:text-white xl:hidden"
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* =========================
            SUBTÍTULO EXTRA EN PÁGINAS INTERNAS
        ========================= */}
        {!isHome && subtitle && (
          <div className="relative border-t border-white/6 bg-[rgba(255,255,255,0.015)]">
            <div className="mx-auto max-w-[1600px] px-4 py-2 sm:px-6 lg:px-8">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                {subtitle}
              </p>
            </div>
          </div>
        )}

        {/* =========================
            MOBILE MENU
        ========================= */}
        {menuOpen && (
          <div className="border-t border-white/10 bg-[rgba(8,10,14,0.96)] xl:hidden">
            <div className="mx-auto max-w-[1600px] px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-2">
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    item.to !== '#' &&
                    (item.to === '/'
                      ? location.pathname === '/'
                      : location.pathname.startsWith(item.to));

                  const baseClass =
                    'rounded-2xl border px-4 py-3 text-sm uppercase tracking-[0.14em] transition';

                  if (item.to === '#') {
                    return (
                      <div
                        key={item.label}
                        className={`${baseClass} border-white/8 bg-white/[0.02] text-white/55`}
                      >
                        {item.label}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                      className={`${baseClass} ${
                        isActive
                          ? 'border-[var(--color-red)]/30 bg-[var(--color-red)]/10 text-[var(--color-red)]'
                          : 'border-white/10 bg-white/[0.03] text-white hover:border-[var(--color-red)]/35'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <span className="relative flex h-3 w-3 shrink-0">
                    <span className="absolute inset-0 rounded-full bg-emerald-400/30 blur-[4px]" />
                    <span className="relative h-3 w-3 rounded-full border border-emerald-300/40 bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]" />
                  </span>

                  <div className="leading-tight">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white">
                      IA ACTIVA
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
                      Sistema listo
                    </p>
                  </div>
                </div>

                {!isHome && subtitle && (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-[var(--color-text-muted)]">
                    {subtitle}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}