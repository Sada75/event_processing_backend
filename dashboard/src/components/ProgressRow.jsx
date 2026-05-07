export function ProgressRow({ label, value, max, meta, tone = 'bg-emerald-300' }) {
  const width = max > 0 ? Math.max(6, Math.round((value / max) * 100)) : 0;
  const widthClass = width >= 95
    ? 'w-full'
    : width >= 85
      ? 'w-11/12'
      : width >= 75
        ? 'w-4/5'
        : width >= 60
          ? 'w-2/3'
          : width >= 45
            ? 'w-1/2'
            : width >= 30
              ? 'w-1/3'
              : width > 0
                ? 'w-1/6'
                : 'w-0';

  return (
    <div className="rounded-[8px] border border-white/10 bg-black/20 p-3 transition duration-300 hover:border-white/20 hover:bg-white/[0.06]">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-100">{label}</p>
          {meta && <p className="mt-0.5 text-xs text-slate-500">{meta}</p>}
        </div>
        <span className="font-mono text-sm font-semibold text-white">{value}</span>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${tone} ${widthClass} shadow-[0_0_18px_currentColor] transition-all duration-700`} />
      </div>
    </div>
  );
}
