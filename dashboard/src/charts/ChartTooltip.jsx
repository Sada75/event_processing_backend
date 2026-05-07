export function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-[8px] border border-white/10 bg-slate-950/95 p-3 text-sm shadow-2xl shadow-black/40 backdrop-blur-xl">
      <p className="mb-2 font-mono text-xs text-slate-400">{label}</p>
      <div className="space-y-1.5">
        {payload.map((item) => (
          <div key={item.dataKey} className="flex items-center justify-between gap-6">
            <span className="text-slate-300">{item.name}</span>
            <span className="font-mono font-semibold text-white">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
