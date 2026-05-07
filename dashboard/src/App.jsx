import { useCallback, useState } from 'react';
import {
  FaBolt,
  FaCarSide,
  FaCheck,
  FaFireFlameCurved,
  FaTowerBroadcast,
  FaTriangleExclamation,
  FaUserGroup,
  FaXmark,
} from 'react-icons/fa6';

import { ActivityFeed } from './components/ActivityFeed';
import { MetricCard } from './components/MetricCard';
import { Panel } from './components/Panel';
import { ProgressRow } from './components/ProgressRow';
import { Skeleton } from './components/Skeleton';
import { CityDemandChart } from './charts/CityDemandChart';
import { RideActivityChart } from './charts/RideActivityChart';
import { StreamingMetricsChart } from './charts/StreamingMetricsChart';
import { useOperationsData } from './hooks/useOperationsData';
import { DashboardShell } from './layout/DashboardShell';

function SurgeDetectionPanel({ surgeAreas, loading }) {
  return (
    <Panel
      title="Surge Detection"
      eyebrow="Heat Index"
      action={<span className="rounded-full bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-100">{surgeAreas.length} active</span>}
    >
      {loading && surgeAreas.length === 0 ? (
        <div className="space-y-3">
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
          <Skeleton className="h-14" />
        </div>
      ) : surgeAreas.length === 0 ? (
        <div className="rounded-[8px] border border-white/10 bg-black/20 p-5 text-sm text-slate-400">
          No active surge zones reported by Redis.
        </div>
      ) : (
        <div className="space-y-3">
          {surgeAreas.map((zone) => (
            <div key={`${zone.city}-${zone.area}`} className="group flex items-center justify-between gap-3 rounded-[8px] border border-amber-300/15 bg-amber-300/[0.055] p-3 transition duration-300 hover:border-amber-200/35 hover:bg-amber-300/10">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{zone.area}</p>
                <p className="mt-0.5 text-xs uppercase tracking-[0.18em] text-amber-100/60">{zone.city}</p>
              </div>
              <FaFireFlameCurved className="shrink-0 text-amber-200 drop-shadow-[0_0_12px_rgba(253,230,138,0.65)]" />
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

function TopRideZones({ areas, loading }) {
  const max = Math.max(...areas.map((area) => area.rides), 0);

  return (
    <Panel title="Top Active Ride Zones" eyebrow="Demand Leaders">
      {loading && areas.length === 0 ? (
        <div className="space-y-3">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : (
        <div className="space-y-3">
          {areas.map((area, index) => (
            <ProgressRow
              key={area.area}
              label={area.area}
              max={max}
              meta={`Rank ${index + 1}`}
              tone={index === 0 ? 'bg-lime-300' : 'bg-emerald-300'}
              value={area.rides}
            />
          ))}
        </div>
      )}
    </Panel>
  );
}

function SystemHealth({ streamMetrics, socketStatus, completionRate, cancellationRate }) {
  const connected = socketStatus === 'connected';
  const healthItems = [
    { label: 'Socket stream', value: connected ? 'Connected' : 'Waiting', good: connected },
    { label: 'Events processed', value: streamMetrics.total || 0, good: true },
    { label: 'Active users', value: streamMetrics.activeUsers || 0, good: true },
    { label: 'Completion rate', value: `${completionRate}%`, good: completionRate >= cancellationRate },
    { label: 'Cancellation rate', value: `${cancellationRate}%`, good: cancellationRate <= completionRate },
  ];

  return (
    <Panel title="System Health Indicators" eyebrow="Service Pulse">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {healthItems.map((item) => (
          <div key={item.label} className="rounded-[8px] border border-white/10 bg-black/20 p-4 transition duration-300 hover:border-emerald-300/25 hover:bg-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${item.good ? 'bg-emerald-300' : 'bg-amber-300'} shadow-[0_0_16px_currentColor]`} />
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
            </div>
            <p className="mt-3 text-xl font-bold text-white">{item.value}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function StreamLeaders({ users }) {
  return (
    <Panel title="Streaming Top Users" eyebrow="Live Consumers">
      {users.length === 0 ? (
        <div className="rounded-[8px] border border-white/10 bg-black/20 p-5 text-sm text-slate-400">
          Waiting for stream ranking data.
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user, index) => (
            <div key={user.user} className="flex items-center justify-between rounded-[8px] border border-white/10 bg-black/20 p-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-white/10 text-sm font-bold text-emerald-200">{index + 1}</span>
                <p className="truncate text-sm font-semibold text-white">{user.user}</p>
              </div>
              <span className="font-mono text-sm text-lime-200">{user.score}</span>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

function App() {
  const data = useOperationsData();
  const [activeSection, setActiveSection] = useState('overview');

  const handleNavigate = useCallback((sectionId) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, []);

  return (
    <DashboardShell
      activeSection={activeSection}
      apiError={data.apiError}
      onNavigate={handleNavigate}
      socketStatus={data.socketStatus}
    >
      <div className="space-y-6">
        <section id="overview" className="scroll-mt-36 grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          <MetricCard icon={FaCarSide} label="Active Rides" loading={data.isLoading} helper="Refreshing from ride metrics API" tone="emerald" value={data.activeRides} />
          <MetricCard icon={FaCheck} label="Completed Rides" loading={data.isLoading} helper={`${data.completionRate}% completion share`} tone="cyan" value={data.completedRides} />
          <MetricCard icon={FaXmark} label="Cancelled Rides" loading={data.isLoading} helper={`${data.cancellationRate}% cancellation share`} tone="rose" value={data.cancelledRides} />
          <MetricCard icon={FaFireFlameCurved} label="Surge Zones" loading={data.isLoading} helper="Detected from existing surge keys" tone="amber" value={data.surgeAreas.length} />
        </section>

        <SystemHealth
          cancellationRate={data.cancellationRate}
          completionRate={data.completionRate}
          socketStatus={data.socketStatus}
          streamMetrics={data.streamMetrics}
        />

        <section id="ride-activity" className="scroll-mt-36 grid gap-6 xl:grid-cols-3">
          <RideActivityChart data={data.rideTrend} loading={data.isLoading} />
          <div className="grid gap-6">
            <Panel title="Control Room Snapshot" eyebrow="Now">
              <div className="grid gap-3">
                <div className="flex items-center justify-between rounded-[8px] border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-3 text-slate-300"><FaTowerBroadcast className="text-emerald-300" /> Total stream events</div>
                  <span className="font-mono text-xl font-bold text-white">{data.streamMetrics.total || 0}</span>
                </div>
                <div className="flex items-center justify-between rounded-[8px] border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-3 text-slate-300"><FaUserGroup className="text-cyan-300" /> Active stream users</div>
                  <span className="font-mono text-xl font-bold text-white">{data.streamMetrics.activeUsers || 0}</span>
                </div>
                <div className="flex items-center justify-between rounded-[8px] border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center gap-3 text-slate-300"><FaBolt className="text-lime-300" /> Total ride volume</div>
                  <span className="font-mono text-xl font-bold text-white">{data.rideTotal}</span>
                </div>
              </div>
            </Panel>
            <div id="surge-zones" className="scroll-mt-36">
              <SurgeDetectionPanel loading={data.isLoading} surgeAreas={data.surgeAreas} />
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <TopRideZones areas={data.topAreas} loading={data.isLoading} />
          <div id="demand-map" className="scroll-mt-36">
            <CityDemandChart data={data.cityDemand} loading={data.isLoading} />
          </div>
          <div id="streams" className="scroll-mt-36">
            <StreamingMetricsChart data={data.streamTrend} loading={data.isLoading} />
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <ActivityFeed items={data.eventFeed} loading={data.isLoading} />
          </div>
          <div className="grid gap-6">
            <StreamLeaders users={data.streamMetrics.topUsers || []} />
            <Panel title="Incident Watch" eyebrow="Signals">
              <div className="rounded-[8px] border border-white/10 bg-black/20 p-4">
                <div className="flex items-start gap-3">
                  <FaTriangleExclamation className="mt-1 text-amber-200" />
                  <div>
                    <p className="font-semibold text-white">Surge pressure</p>
                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      {data.surgeAreas.length > 0
                        ? `${data.surgeAreas.length} zones are currently flagged by the existing surge detector.`
                        : 'No surge pressure detected in the current Redis snapshot.'}
                    </p>
                  </div>
                </div>
              </div>
            </Panel>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

export default App;
