import { X } from 'lucide-react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const SIZE_CLASSES = {
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  size = 'lg',
}) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const modalSize = SIZE_CLASSES[size] || SIZE_CLASSES.lg;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/72 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8">
        <div
          className={`relative flex w-full ${modalSize} max-h-[88vh] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[var(--color-bg-elevated)] shadow-[0_30px_120px_rgba(0,0,0,0.6)]`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6 lg:px-7">
            <h3 className="pr-2 font-[var(--font-display)] text-base font-semibold text-white sm:text-lg">
              {title}
            </h3>

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 text-[var(--color-text-muted)] transition hover:bg-white/5 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* BODY */}
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6 lg:px-7 lg:py-7">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}