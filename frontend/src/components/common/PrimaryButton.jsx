export default function PrimaryButton({
  children,
  icon: Icon,
  variant = 'solid',
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold tracking-tight transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50';

  const variants = {
    solid:
      'border border-[var(--color-red)]/40 bg-[linear-gradient(180deg,var(--color-red),var(--color-red-dim))] text-white shadow-[0_14px_34px_rgba(225,6,0,0.28)] hover:brightness-110 hover:shadow-[0_18px_40px_rgba(225,6,0,0.35)] active:scale-[0.985]',
    outline:
      'border border-white/10 bg-white/[0.03] text-[var(--color-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] hover:border-[var(--color-red)]/35 hover:bg-white/[0.05] hover:text-white active:scale-[0.985]',
    ghost:
      'text-[var(--color-text-muted)] hover:bg-white/[0.04] hover:text-white active:scale-[0.985]',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {Icon && <Icon size={17} strokeWidth={2.2} />}
      <span>{children}</span>
    </button>
  );
}