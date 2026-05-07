import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Panel } from '../components/Panel';
import { Skeleton } from '../components/Skeleton';
import { ChartTooltip } from './ChartTooltip';

export function StreamingMetricsChart({ data, loading }) {
  return (
    <Panel title="Live Streaming Metrics" eyebrow="Socket.IO">
      {loading && data.length === 0 ? (
        <Skeleton className="h-[230px]" />
      ) : (
        <div className="h-[230px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 16, right: 12, left: -18, bottom: 0 }}>
              <XAxis dataKey="time" hide />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(190,242,100,0.32)' }} />
              <Line type="monotone" dataKey="events" stroke="#bef264" strokeWidth={3} dot={false} name="Total events" />
              <Line type="monotone" dataKey="activeUsers" stroke="#22d3ee" strokeWidth={2} dot={false} name="Active users" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Panel>
  );
}
