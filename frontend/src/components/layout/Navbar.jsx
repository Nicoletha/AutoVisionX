import { ArrowLeft, Menu, Scan, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navbar({ showBack = false, subtitle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = location.pathname === '/';

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1480px]">
        <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-[rgba(10,10,14,0.76)] shadow-[0_18px_50px_rgba(0,0,0,0.34)] backdrop-blur-xl">
          {/* FX */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05),transparent_30%,transparent_70%,rgba(255,255,255,0.03))]" />
          <div className="pointer-events-none absolute left-[-70px] top-[-60px] h-44 w-44 rounded-full bg-[var(--color-red)]/10 blur-3xl" />
          <div className="pointer-events-none absolute right-[-60px] top-[-40px] h-40 w-40 rounded-full bg-white/[0.03] blur-3xl" />
          <div className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="relative flex min-h-[74px] items-center justify-between px-4 py-3 sm:px-5 lg:px-6">
            {/* LEFT */}
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              {showBack && (
                <button
                  onClick={() => navigate(-1)}
                  aria-label="Volver"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-[var(--color-text-muted)] transition hover:border-[var(--color-red)]/40 hover:text-white"
                >
                  <ArrowLeft size={17} />
                </button>
              )}

              <Link to="/" className="flex min-w-0 items-center gap-3">
                <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[var(--color-red)]/30 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_0_30px_rgba(225,6,0,0.18)]">
                  <span className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_42%)]" />
                  <Scan
                    size={19}
                    className="relative z-10 text-[var(--color-red)]"
                    strokeWidth={2.3}
                  />
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-[var(--font-display)] text-[1.08rem] font-semibold tracking-tight text-white sm:text-[1.15rem]">
                      AutoVision
                      <span className="text-[var(--color-red)]">X</span>
                    </span>

                    <span className="hidden rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-faint)] lg:inline-flex">
                      Scanner IA
                    </span>
                  </div>

                  {isHome ? (
                    <p className="hidden text-[12px] text-[var(--color-text-muted)] sm:block">
                      Reconocimiento visual de automóviles a partir de imagen o cámara
                    </p>
                  ) : subtitle ? (
                    <p className="hidden text-[12px] text-[var(--color-text-muted)] sm:block">
                      {subtitle}
                    </p>
                  ) : null}
                </div>
              </Link>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2">
              {isHome && (
                <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 lg:flex">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
                  <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                    IA activa
                  </span>
                </div>
              )}

              <Link
                to="/"
                className="hidden rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-[var(--color-text-muted)] transition hover:border-[var(--color-red)]/35 hover:text-white md:inline-flex"
              >
                Reconocimiento
              </Link>

              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Abrir menú"
                className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-[var(--color-text-muted)] transition hover:border-[var(--color-red)]/35 hover:text-white md:hidden"
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* MOBILE MENU */}
          {menuOpen && (
            <div className="border-t border-white/10 bg-[rgba(12,12,18,0.92)] px-4 py-4 md:hidden">
              <div className="flex flex-col gap-2">
                <Link
                  to="/"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white transition hover:border-[var(--color-red)]/35"
                >
                  Reconocimiento
                </Link>

                {subtitle && !isHome && (
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-[var(--color-text-muted)]">
                    {subtitle}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}