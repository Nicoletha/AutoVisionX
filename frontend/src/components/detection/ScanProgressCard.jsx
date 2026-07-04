export default function ScanProgressCard({ progress, statusText }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-20 w-20">
        <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="#232329"
            strokeWidth="6"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="var(--color-red)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.3s ease' }}
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center font-[var(--font-display)] text-lg font-semibold text-[var(--color-red)]">
          {Math.round(progress)}%
        </span>
      </div>
      <p className="max-w-xs text-center text-xs leading-relaxed text-[var(--color-text-muted)]">
        {statusText}
      </p>
    </div>
  );
}
