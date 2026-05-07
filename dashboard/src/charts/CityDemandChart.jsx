import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Panel } from '../components/Panel';
import { Skeleton } from '../components/Skeleton';
import { ChartTooltip } from './ChartTooltip';

export function CityDemandChart({ data, loading }) {
  return (
    <Panel title="City Demand Comparison" eyebrow="Market Load">
      {loading && data.length === 0 ? (
        <Skeleton className="h-[300px]" />
      ) : (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="demandGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#bef264" stopOpacity={0.92} />
                  <stop offset="100%" stopColor="#1db954" stopOpacity={0.74} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
              <XAxis dataKey="city" tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
              <Bar dataKey="requests" name="Requests" fill="url(#demandGradient)" radius={[8, 8, 2, 2]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Panel>
  );
}
