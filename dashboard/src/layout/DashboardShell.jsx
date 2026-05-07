import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function DashboardShell({ socketStatus, apiError, activeSection, onNavigate, children }) {
  return (
    <div className="min-h-svh bg-transparent text-slate-100">
      <div className="pointer-events-none fixed inset-0 opacity-80">
        <div className="absolute left-[10%] top-16 h-64 w-64 animate-float rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute right-[8%] top-32 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-lime-300/5 blur-3xl" />
      </div>
      <div className="relative flex min-h-svh">
        <Sidebar activeSection={activeSection} onNavigate={onNavigate} />
        <main className="min-w-0 flex-1">
          <Topbar
            activeSection={activeSection}
            apiError={apiError}
            onNavigate={onNavigate}
            socketStatus={socketStatus}
          />
          <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
