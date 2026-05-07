import { FaBolt, FaCircleNodes, FaRotate } from 'react-icons/fa6';

import { Panel } from './Panel';
import { Skeleton } from './Skeleton';

const icons = {
  LIVE_METRIC: FaBolt,
  SOCKET_ONLINE: FaCircleNodes,
  REST_SYNC: FaRotate,
  API_ERROR: FaBolt,
};

export function ActivityFeed({ items, loading }) {
  return (
    <Panel title="Live Event Stream" eyebrow="Activity">
      {loading && items.length === 0 ? (
        <div className="space-y-3">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : (
        <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
          {items.map((item) => {
            const Icon = icons[item.type] || FaBolt;

            return (
              <div key={item.id} className="group flex gap-3 rounded-[8px] border border-white/10 bg-black/20 p-3 transition duration-300 hover:border-emerald-300/30 hover:bg-emerald-300/[0.06]">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-emerald-300/10 text-emerald-200 shadow-[0_0_18px_rgba(52,211,153,0.12)]">
                  <Icon />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-semibold text-slate-100">{item.title}</p>
                    <span className="shrink-0 font-mono text-[11px] text-slate-500">{item.time}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{item.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
}
