import { FaArrowTrendUp } from 'react-icons/fa6';

import { Skeleton } from './Skeleton';

export function MetricCard({ label, value, helper, icon: Icon, tone = 'emerald', loading }) {
  const tones = {
    emerald: 'from-emerald-400/25 to-cyan-300/10 text-emerald-200 shadow-emerald-500/10',
    cyan: 'from-cyan-400/25 to-blue-400/10 text-cyan-200 shadow-cyan-500/10',
    rose: 'from-rose-400/25 to-orange-300/10 text-rose-200 shadow-rose-500/10',
    amber: 'from-amber-300/25 to-lime-300/10 text-amber-100 shadow-amber-500/10',
  };

  return (
    <article className="group relative overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30 backdrop-blur-2xl transition duration-300 hover:-translate-y-1 hover:border-emerald-300/30 hover:bg-white/[0.085]">
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${tones[tone]}`} />
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-400/10 blur-3xl transition duration-500 group-hover:bg-emerald-300/20" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400">{label}</p>
          {loading ? (
            <Skeleton className="mt-4 h-10 w-24" />
          ) : (
            <p className="mt-3 text-4xl font-bold leading-none text-white">{value}</p>
          )}
        </div>
        <div className={`rounded-[8px] bg-gradient-to-br p-3 shadow-lg ${tones[tone]}`}>
          <Icon className="text-xl" />
        </div>
      </div>
      <div className="relative mt-5 flex items-center gap-2 text-xs font-semibold text-slate-300">
        <span className="inline-flex h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
        <FaArrowTrendUp className="text-emerald-300" />
        <span>{helper}</span>
      </div>
    </article>
  );
}
