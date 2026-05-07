export function StatusPill({ status }) {
  const isConnected = status === 'connected';
  const label = isConnected ? 'Live' : status === 'reconnecting' ? 'Reconnecting' : 'Offline';
  const color = isConnected ? 'bg-emerald-300' : status === 'reconnecting' ? 'bg-amber-300' : 'bg-rose-300';

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200 backdrop-blur-xl">
      <span className={`h-2 w-2 rounded-full ${color} animate-pulse shadow-[0_0_16px_currentColor]`} />
      {label}
    </div>
  );
}
