import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Panel } from '../components/Panel';
import { Skeleton } from '../components/Skeleton';
import { ChartTooltip } from './ChartTooltip';

export function RideActivityChart({ data, loading }) {
  return (
    <Panel title="Real-Time Ride Activity" eyebrow="Operations Signal" className="lg:col-span-2">
      {loading && data.length === 0 ? (
        <Skeleton className="h-[330px]" />
      ) : (
        <div className="h-[330px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 12, right: 16, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="activeRideGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#1db954" stopOpacity={0.72} />
                  <stop offset="95%" stopColor="#1db954" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="completedRideGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.46} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={28} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(29,185,84,0.34)' }} />
              <Area type="monotone" dataKey="completed" stroke="#22d3ee" strokeWidth={2} fill="url(#completedRideGradient)" name="Completed" />
              <Area type="monotone" dataKey="active" stroke="#1db954" strokeWidth={3} fill="url(#activeRideGradient)" name="Active" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Panel>
  );
}
